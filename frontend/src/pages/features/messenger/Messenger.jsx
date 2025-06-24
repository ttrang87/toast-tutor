import { useState, useEffect } from "react"
import ContactsList from "../../../components/messenger/ContactList"
import ChatInterface from "../../../components/messenger/ChatInterface"
import { useParams, useNavigate } from "react-router-dom"
import { useChatContext } from "../../../components/messenger/ChatContext"

export default function MessengerInterface() {
    const [selectedContactId, setSelectedContactId] = useState(null)
    const navigate = useNavigate()
    const { id: chatId } = useParams()
    const selectedChatId = chatId ? parseInt(chatId, 10) : null

    const {
        contacts,
        conversations,
        isLoading,
        isInitialized,
        initializeChats
    } = useChatContext()

    // Initialize chats only once when component first mounts
    useEffect(() => {
        if (!isInitialized) {
            initializeChats()
        }
    }, []) // Empty dependency array - only runs once

    // Handle URL-based contact selection
    useEffect(() => {
        if (selectedChatId && contacts.length > 0) {
            const contactExists = contacts.some(contact => contact.id === selectedChatId)
            if (contactExists && selectedContactId !== selectedChatId) {
                setSelectedContactId(selectedChatId)
            }
        }
    }, [selectedChatId, contacts.length, selectedContactId])

    const handleSelectContact = (contactId) => {
        setSelectedContactId(contactId)
        navigate(`/chat/${contactId}`, { replace: true })
    }

    // Derive selected data
    const selectedContact = contacts.find((c) => c.id === selectedContactId)
    const selectedConversation = selectedContactId && conversations[selectedContactId]
        ? conversations[selectedContactId]
        : null

    return (
        <div className="w-screen h-screen bg-white overflow-hidden flex m-3 flex-1">
            {/* Contacts List */}
            <div className="w-1/4 flex-shrink-0">
                <ContactsList
                    contacts={contacts}
                    selectedContactId={selectedContactId}
                    onSelectContact={handleSelectContact}
                />
            </div>

            {/* Chat Interface */}
            <div className="w-3/4 flex-1 flex flex-col h-full">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-orange-600 font-medium">Loading chats...</p>
                        </div>
                    </div>
                ) : selectedContact && selectedConversation ? (
                    <ChatInterface contact={selectedContact} conversation={selectedConversation} />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 mx-3 mb-3 rounded-xl">
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