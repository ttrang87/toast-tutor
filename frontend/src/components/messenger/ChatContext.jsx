import { createContext, useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { API_ROUTES } from '../../constant/APIRoutes'
import { getAllChatBoxes, getChatBox, saveChatBox } from '../../utils/indexedDB'
import { supabase } from '../../utils/supabaseClient'

const ChatContext = createContext()

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

export function ChatProvider({ children }) {
  const [contacts, setContacts] = useState([])
  const [conversations, setConversations] = useState({})
  const [chatboxIds, setChatboxIds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // refs to track state and prevent duplicate operations
  const hasCalledApi = useRef(false)
  const subscriptionsActive = useRef(false)
  const newChatboxListenerActive = useRef(false)

  const channelsRef = useRef([])


  const subscribeMessage = async (chatboxId) => {
    const channel = supabase.channel(`chatbox-${chatboxId}`, {
      config: {
        presence: { key: chatboxId.toString() }
      }
    })

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'toast_tutor_message',
        filter: `chatbox_id=eq.${chatboxId}`,
      },
      async (payload) => {
        const newMessage = payload.new
        const formattedMessage = {
          id: `${Date.now()}-${Math.random()}`,
          text: newMessage.content,
          sender: newMessage.sender_id,
          created_at: newMessage.created_at,
        }

        // Update conversations 
        setConversations(prev => ({
          ...prev,
          [chatboxId]: {
            ...(prev[chatboxId] || { contactId: chatboxId, messages: [] }),
            messages: [...(prev[chatboxId]?.messages || []), formattedMessage]
          }
        }))

        // Update contacts list
        setContacts(prev =>
          prev.map(c =>
            c.id === chatboxId
              ? {
                ...c,
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.created_at
              }
              : c
          )
        )

        // Update IndexedDB in background
        try {
          const box = await getChatBox(chatboxId)
          if (box) {
            const updatedMessages = [...(box.messages || []), formattedMessage]
            await saveChatBox({
              id: chatboxId,
              name: box.name,
              other_user_id: box.other_user_id,
              avatar: box.avatar,
              messages: updatedMessages,
            })
          }
        } catch (err) {
          console.error("Error updating IndexedDB:", err)
        }
      }
    )

    channel.subscribe((status, err) => {
      if (err) {
        console.error(`Channel ${chatboxId} subscription error:`, err)
      } else {
        console.log(`Channel ${chatboxId} subscribed with status:`, status)
      }
    })

    channelsRef.current.push(channel)
    // Small delay between subscriptions to avoid overwhelming
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // initialize chats (called once when app starts)
  const initializeChats = async () => {
    if (hasCalledApi.current) return //if called => stop
    try {
      setIsLoading(true)
      hasCalledApi.current = true

      const user_id = localStorage.getItem("userId")
      if (!user_id) throw new Error("Missing userID")

      // 1. Load from IndexedDB first for instant UI
      const localChatBoxes = await getAllChatBoxes()
      if (localChatBoxes.length > 0) {
        const initialContacts = []
        const initialConversations = {}
        const localIds = []

        localChatBoxes.forEach((box) => {
          const chatId = box.id
          localIds.push(chatId)
          const latest = box.messages[box.messages.length - 1]

          initialContacts.push({
            id: chatId,
            name: box.name,
            other_user_id: box.other_user_id,
            avatar: box.avatar,
            lastMessage: latest?.text || "No messages",
            lastMessageTime: latest?.created_at,
            unreadCount: 0,
            isOnline: true,
          })

          initialConversations[chatId] = {
            contactId: chatId,
            messages: box.messages,
          }
        })

        // cached data 
        setContacts(initialContacts)
        setConversations(initialConversations)
        setChatboxIds(localIds)
        setIsLoading(false) // show cached data while API loads
      }

      // 2. Fetch fresh data from API 
      const response = await axios.get(API_ROUTES.GET_CHATS, {
        params: { user_id },
      })

      if (response.status === 200) {
        const chatBoxes = response.data.chat_boxes
        const freshContacts = []
        const freshConversations = {}
        const ids = []

        for (const box of chatBoxes) {
          const chatId = box.chat_box_id
          ids.push(chatId)
          const messages = box.hot_messages.map((msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender,
            created_at: msg.created_at,
          })).reverse()

          // Save to IndexedDB
          await saveChatBox({
            id: chatId,
            name: box.name,
            other_user_id: box.other_user_id,
            avatar: box.avatar,
            messages,
          })

          freshContacts.push({
            id: chatId,
            name: box.name,
            other_user_id: box.other_user_id,
            avatar: box.avatar,
            lastMessage: messages[messages.length - 1]?.text || "No messages",
            lastMessageTime: messages[messages.length - 1]?.created_at,
            unreadCount: 0,
            isOnline: true,
          })

          freshConversations[chatId] = {
            contactId: chatId,
            messages,
          }
        }

        // Update with fresh API data
        setContacts(freshContacts)
        setConversations(freshConversations)
        setChatboxIds(ids)
      }
      setupNewChatboxListener(parseInt(user_id))

      setIsInitialized(true)
    } catch (err) {
      console.error("Error initializing chats:", err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Setup persistent Supabase subscriptions
  const setupPersistentSubscriptions = async () => {
    if (subscriptionsActive.current || chatboxIds.length === 0) return

    try {
      console.log('Setting up persistent subscriptions for', chatboxIds.length, 'chatboxes')
      subscriptionsActive.current = true

      // Clean up any existing channels first
      await supabase.removeAllChannels()
      // Reset the listener flag since we just killed everything
      newChatboxListenerActive.current = false
      await new Promise(resolve => setTimeout(resolve, 100))

      for (const chatboxId of chatboxIds) {
        await subscribeMessage(chatboxId)
      }

      console.log('All subscriptions active')
    } catch (error) {
      console.error("Error setting up persistent subscriptions:", error)
      subscriptionsActive.current = false
    }
  }

  //listen to new chat box
  const setupNewChatboxListener = (user_id) => {
    if (newChatboxListenerActive.current) return
    newChatboxListenerActive.current = true

    const channel = supabase.channel('chatbox-insert-listener')
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'toast_tutor_chatbox',
      },
      async (payload) => {
        const newChatbox = payload.new
        // Check if this chatbox involves the current user
        if (newChatbox.user1_id !== user_id && newChatbox.user2_id !== user_id) return

        try {
          // Get the new chatbox ID
          const newChatboxId = newChatbox.id

          // Fetch full chat data from API
          const response = await axios.get(API_ROUTES.GET_SINGLE_CHAT, {
            params: {
              chatbox_id: newChatboxId,
              user_id: user_id
            }
          })

          if (response.status === 200) {
            const chatBoxData = response.data.chatbox

            // Format messages
            const messages = chatBoxData.hot_messages.map((msg) => ({
              id: msg.id,
              text: msg.content,
              sender: msg.sender,
              created_at: msg.created_at,
            })).reverse()

            // Save to IndexedDB
            await saveChatBox({
              id: newChatboxId,
              name: chatBoxData.name,
              other_user_id: chatBoxData.other_user_id,
              avatar: chatBoxData.avatar,
              messages
            })

            // Update contacts state
            setContacts(prev => [
              ...prev,
              {
                id: newChatboxId,
                name: chatBoxData.name,
                other_user_id: chatBoxData.other_user_id,
                avatar: chatBoxData.avatar,
                lastMessage: messages[messages.length - 1]?.text || "No messages",
                lastMessageTime: messages[messages.length - 1]?.created_at,
                unreadCount: 0,
                isOnline: true,
              }
            ])

            // Update conversations state
            setConversations(prev => ({
              ...prev,
              [newChatboxId]: {
                contactId: newChatboxId,
                messages
              }
            }))

            // Add to chatbox IDs list
            setChatboxIds(prev =>
              prev.includes(newChatboxId) ? prev : [...prev, newChatboxId]
            )

            // Subscribe to new messages for this chatbox
            await subscribeMessage(newChatboxId)

            console.log('✅ New chatbox added and subscribed:', newChatboxId)
          }
        } catch (error) {
          console.error('❌ Error handling new chatbox:', error)
        }
      }
    )

    channel.subscribe((status, err) => {
      if (err) {
        console.error("❌ Failed to subscribe to chatbox INSERT:", err)
      } else {
        console.log("✅ Subscribed to chatbox INSERT listener:", status)
      }
    })

    channelsRef.current.push(channel)
  }

  // Cleanup function for logout/window close
  const cleanupSubscriptions = () => {
    console.log('Cleaning up subscriptions')
    subscriptionsActive.current = false

    channelsRef.current.forEach(channel => {
      try {
        channel.unsubscribe()
      } catch (err) {
        console.error("Error unsubscribing channel:", err)
      }
    })

    channelsRef.current = []

    setTimeout(() => {
      try {
        supabase.removeAllChannels()
      } catch (err) {
        console.error("Error removing all channels:", err)
      }
    }, 100)
  }

  // setup subscriptions when chatboxIds are available
  useEffect(() => {
    const setup = async () => {
      if (chatboxIds.length > 0 && !subscriptionsActive.current) {
        await setupPersistentSubscriptions()
      }
    }

    setup()

  }, [chatboxIds])

  // Cleanup on unmount or logout
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupSubscriptions()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanupSubscriptions()
    }
  }, [])

  // reset everything (for logout)
  const resetChatState = () => {
    console.log('Resetting chat state')
    cleanupSubscriptions()
    setContacts([])
    setConversations({})
    setChatboxIds([])
    setIsInitialized(false)
    hasCalledApi.current = false
    newChatboxListenerActive.current = false
  }

  const value = {
    contacts,
    conversations,
    isLoading,
    isInitialized,
    initializeChats,
    resetChatState,
    setContacts,
    setConversations,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}