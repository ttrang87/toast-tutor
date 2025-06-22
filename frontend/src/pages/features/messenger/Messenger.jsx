import { useState, useEffect } from "react"
import ContactsList from "../../../components/messenger/ContactList"
import ChatInterface from "../../../components/messenger/ChatInterface"
import axios from "axios"
import { API_ROUTES } from "../../../constant/APIRoutes"
import { getAllChatBoxes, getChatBox, saveChatBox } from "../../../utils/indexedDB"
import { supabase } from "../../../utils/supabaseClient"

export default function MessengerInterface() {
    const [selectedContactId, setSelectedContactId] = useState(null)
    const [contacts, setContacts] = useState([])
    const [conversations, setConversations] = useState({})
    const [chatboxIds, setChatboxIds] = useState([])

    useEffect(() => {
        const getChats = async () => {
            try {
                const user_id = localStorage.getItem("userId")
                if (!user_id) throw new Error("Missing userID")

                // 1. Try to load from local IndexedDB
                const localChatBoxes = await getAllChatBoxes()

                if (localChatBoxes.length > 0) {
                    const localContacts = []
                    const localConversations = {}

                    localChatBoxes.forEach((box) => {
                        const chatId = box.id
                        const latest = box.messages[box.messages.length - 1]
                        localContacts.push({
                            id: chatId,
                            name: box.name,
                            other_user_id: box.other_user_id,
                            avatar: box.avatar,
                            lastMessage: latest?.text || "No messages",
                            lastMessageTime: latest?.created_at,
                            unreadCount: 0,
                            isOnline: true,
                        })
                        localConversations[chatId] = {
                            contactId: chatId,
                            messages: box.messages,
                        }
                    })


                    setContacts(localContacts)
                    setConversations(localConversations)
                    if (localContacts.length > 0) {
                        setSelectedContactId(localContacts[0].id)
                    }
                }

                // 2. Always fetch from API (and override local with fresh)
                const response = await axios.get(API_ROUTES.GET_CHATS, {
                    params: { user_id },
                })

                if (response.status !== 200) throw new Error("Failed to fetch chats")

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
                        avatar: box.avatar, // ✅ keep avatar as number
                        lastMessage: messages[messages.length - 1]?.text || "No messages",
                        lastMessageTime: messages[messages.length - 1].created_at,
                        unreadCount: 0,
                        isOnline: true,
                    })

                    freshConversations[chatId] = {
                        contactId: chatId,
                        messages,
                    }
                }

                setContacts(freshContacts)
                setConversations(freshConversations)
                setChatboxIds(ids)
                if (chatBoxes.length > 0) {
                    setSelectedContactId(chatBoxes[0].chat_box_id)
                }
            } catch (err) {
                console.error("Error fetching chats:", err.message)
            }
        }

        getChats()
    }, [])



    /* Subscribe */
    useEffect(() => {
        if (chatboxIds.length === 0) return

        let channels = []
        let mounted = true

        const setupChannels = async () => {
            try {
                // Clean up existing channels first and wait a bit
                supabase.removeAllChannels()

                // Small delay to ensure cleanup is complete
                await new Promise(resolve => setTimeout(resolve, 100))

                if (!mounted) return // Component unmounted during delay

                for (const chatboxId of chatboxIds) {
                    const channel = supabase.channel(`chatbox-${chatboxId}`, {
                        config: {
                            presence: {
                                key: chatboxId.toString()
                            }
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
                        (payload) => {
                            if (!mounted) return // Ignore if component unmounted

                            const newMessage = payload.new

                            // Create properly formatted message object
                            const formattedMessage = {
                                id: `${Date.now()}-${Math.random()}`,
                                text: newMessage.content,
                                sender: newMessage.sender_id,
                                created_at: newMessage.created_at,
                            }

                            // Update state only if component is still mounted
                            setConversations(prev => ({
                                ...prev,
                                [chatboxId]: {
                                    ...(prev[chatboxId] || { contactId: chatboxId, messages: [] }),
                                    messages: [...(prev[chatboxId]?.messages || []), formattedMessage]
                                }
                            }))

                            // Update IndexedDB
                            getChatBox(chatboxId).then((box) => {
                                if (box && mounted) {
                                    const updatedMessages = [...(box.messages || []), formattedMessage]
                                    saveChatBox({
                                        id: chatboxId,
                                        name: box.name,
                                        avatar: box.avatar,
                                        messages: updatedMessages,
                                    })
                                }
                            }).catch(err => {
                                console.error("Error updating IndexedDB:", err)
                            })

                            // Update contacts
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
                        }
                    )

                    // Subscribe and handle the response
                    channel.subscribe((status, err) => {
                        if (err) {
                            console.error(`Channel ${chatboxId} subscription error:`, err)
                        }
                    })

                    channels.push(channel)

                    // Small delay between channel setups to avoid overwhelming the connection
                    await new Promise(resolve => setTimeout(resolve, 50))
                }
            } catch (error) {
                console.error("Error setting up channels:", error)
            }
        }

        setupChannels()

        // Cleanup function
        return () => {
            mounted = false

            // Clean up channels properly
            channels.forEach(channel => {
                try {
                    channel.unsubscribe()
                } catch (err) {
                    console.error("Error unsubscribing channel:", err)
                }
            })

            // Clear the channels array
            channels = []

            // Small delay before removing all channels to ensure unsubscribe completes
            setTimeout(() => {
                try {
                    supabase.removeAllChannels()
                } catch (err) {
                    console.error("Error removing all channels:", err)
                }
            }, 100)
        }
    }, [chatboxIds])

    const selectedContact = contacts.find((c) => c.id === selectedContactId)
    const selectedConversation = selectedContactId ? conversations[selectedContactId] : null

    return (
        <div className="w-screen h-screen bg-white overflow-hidden flex m-3 flex-1">
            {/* Contacts List */}
            <div className="w-1/4 flex-shrink-0">
                <ContactsList
                    contacts={contacts}
                    selectedContactId={selectedContactId}
                    onSelectContact={setSelectedContactId}
                />
            </div>

            {/* Chat Interface */}
            <div className="w-3/4 flex-1 flex flex-col h-full">
                {selectedContact && selectedConversation ? (
                    <ChatInterface contact={selectedContact} conversation={selectedConversation} />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-3xl">🍞</span>
                            </div>
                            <h3 className="text-xl font-bold text-orange-700 mb-2">Welcome to Toast Tutor Chat</h3>
                            <p className="text-orange-600 font-medium">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
