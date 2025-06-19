import { useState, useEffect } from "react"
import ContactsList from "../../../components/messenger/ContactList"
import ChatInterface from "../../../components/messenger/ChatInterface"
import axios from "axios"
import { API_ROUTES } from "../../../constant/APIRoutes"

export default function MessengerInterface() {
    const [selectedContactId, setSelectedContactId] = useState(null)
    const [contacts, setContacts] = useState([])
    const [conversations, setConversations] = useState({})

    useEffect(() => {
        const getChats = async () => {
            try {
                const user_id = localStorage.getItem("userId")
                if (!user_id) throw new Error("Missing userID")

                const response = await axios.get(API_ROUTES.GET_CHATS, {
                    params: { user_id },
                })

                if (response.status !== 200) throw new Error("Failed to fetch chats")

                const chatBoxes = response.data.chat_boxes

                // Build contacts and conversations
                const newContacts = []
                const newConversations = {}

                chatBoxes.forEach((box) => {
                    const chatId = box.chat_box_id.toString()
                    const latestMessage = box.hot_messages[0] // first one is the latest

                    newContacts.push({
                        id: chatId,
                        name: box.name,
                        avatar: box.avatar,
                        lastMessage: latestMessage?.content || "No messages yet",
                        lastMessageTime: latestMessage?.created_at
                            ? new Date(latestMessage.created_at)
                            : new Date(),
                        unreadCount: 0,
                        isOnline: true,
                        role: "user",
                    })

                    newConversations[chatId] = {
                        contactId: chatId,
                        messages: box.hot_messages.map((msg, index) => ({
                            id: `${index + 1}`,
                            text: msg.content,
                            sender: msg.sender === Number(user_id) ? "user" : "contact",
                            timestamp: new Date(msg.created_at),
                            senderName: msg.sender === Number(user_id) ? "You" : box.name,
                            avatar: "/placeholder.svg?height=40&width=40",
                        })),
                    }
                })

                setContacts(newContacts)
                setConversations(newConversations)

                // Auto-select the first chat
                if (chatBoxes.length > 0) {
                    setSelectedContactId(chatBoxes[0].chat_box_id.toString())
                }
            } catch (err) {
                console.error("Error fetching chats:", err.message)
            }
        }

        getChats()
    }, [])

    const selectedContact = contacts.find((c) => c.id === selectedContactId)
    const selectedConversation = selectedContactId ? conversations[selectedContactId] : null

    return (
        <div className="w-screen bg-white overflow-hidden flex m-3 flex-1">
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
