import { useState, useRef, useEffect } from "react"
import { Send, MoreVertical, Phone, Video } from "lucide-react"
import avatars from "../tutor_profile/AvatarList"

export default function ChatInterface({ contact, conversation }) {
  const [messages, setMessages] = useState(conversation.messages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMessages(conversation.messages)
  }, [conversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getAvatarById = (avatarId) => {
    const avatar = avatars.find(av => av.id === avatarId)
    return avatar ? avatar.src : null
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      senderName: "You"
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage("")
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const contactAvatarSrc = getAvatarById(contact.avatar)

  return (
    <div className="flex flex-col h-full ml-3 mr-4">
      {/* Chat Header */}
      <div className="rounded-t-xl bg-[#de7321] px-6 py-4 flex items-center justify-between border-b-2 border-orange-300 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-3 border-white shadow-md bg-gradient-to-br from-yellow-800 to-yellow-600 flex items-center justify-center">
              {contactAvatarSrc ? (
                <img src={contactAvatarSrc} alt={contact.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold">
                  {contact.name.split(" ").map(n => n[0]).join("")}
                </span>
              )}
            </div>
            {contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            )}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg drop-shadow-sm">{contact.name}</h2>
            <p className="text-white/90 text-sm font-medium">
              {contact.subject && `${contact.subject} • `}{contact.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-white hover:bg-white/25 rounded-full p-2 transition-all">
            <Phone className="h-5 w-5" />
          </button>
          <button className="text-white hover:bg-white/25 rounded-full p-2 transition-all">
            <Video className="h-5 w-5" />
          </button>
          <button className="text-white hover:bg-white/25 rounded-full p-2 transition-all">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.sender === "user"
            const messageAvatarSrc = !isUser ? getAvatarById(contact.avatar) : null

            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {!isUser && (
                    <div className="h-8 w-8 mb-1 rounded-full border-2 border-orange-300 bg-gradient-to-br from-orange-400 to-orange-300 flex items-center justify-center flex-shrink-0">
                      {messageAvatarSrc ? (
                        <img src={messageAvatarSrc} alt={contact.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {contact.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isUser
                          ? "bg-gradient-to-r from-orange-400 to-orange-300 text-white rounded-br-md font-medium"
                          : "bg-white text-yellow-800 border-2 border-orange-200 rounded-bl-md font-medium shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <span className={`text-xs text-yellow-700 mt-1 font-medium ${isUser ? "text-right" : "text-left"}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-orange-300 p-4 bg-gradient-to-r from-orange-100 to-orange-50">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              className="w-full rounded-full border-2 border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none pl-4 pr-12 py-2 text-yellow-800 placeholder:text-yellow-700 bg-white shadow-sm font-medium"
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-orange-400 to-orange-300 hover:from-red-400 hover:to-orange-400 text-white rounded-full p-3 transition-all shadow-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
