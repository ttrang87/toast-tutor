import { useState } from "react"
import { Search } from "lucide-react"
import avatars from "../tutor_profile/AvatarList"

export default function ContactsList({ contacts, selectedContactId, onSelectContact }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (dateInput) => {
     if (!dateInput) return "now";

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "unknown"
    }
    
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const getAvatarById = (avatarId) => {
    const avatar = avatars.find((av) => av.id === avatarId)
    return avatar ? avatar.src : null
  }

  return (
    <div className="h-full flex flex-col bg-yellow-50">
      {/* Header */}
      <div className="rounded-t-xl p-4 border-b-2 border-orange-300 bg-[#d46d47]">
        <h2 className="text-xl font-bold text-white mb-3 drop-shadow-sm">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-700 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none text-orange-700 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto rounded-b-xl">
        {filteredContacts.map((contact) => {
          const avatarSrc = getAvatarById(contact.avatar)

          return (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={`p-4 border-b border-orange-200 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-200 hover:shadow-sm ${
                selectedContactId === contact.id
                  ? "bg-gradient-to-r from-orange-50 to-orange-200 border-l-4 border-l-orange-400 shadow-sm"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-2 border-orange-300 shadow-sm bg-gradient-to-br from-orange-400 to-orange-300 flex items-center justify-center">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={contact.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {contact.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    )}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-yellow-700 truncate">{contact.name}</h3>
                    <span className="text-xs text-yellow-800 font-medium flex-shrink-0">
                      {formatTime(contact.lastMessageTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-yellow-800 truncate flex-1 font-medium">
                      {contact.lastMessage}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 shadow-sm font-bold">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}