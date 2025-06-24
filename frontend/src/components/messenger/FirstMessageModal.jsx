import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_ROUTES } from '../../constant/APIRoutes'
import toast from 'react-hot-toast'

const FirstMessageModal = ({ onClose, tutorName }) => {
  const navigate = useNavigate()
  const { id: chatId } = useParams(); // Descriptive name
  const user2 = chatId ? parseInt(chatId, 10) : null;
  const [content, setContent] = useState("")

  const handleStartMessage = async () => {
    if (content.length === 0) {
      toast.error("Please type first message!", {duration: 1000})
    }
    try {
      const user1 = localStorage.getItem("userId")
      if (!user1 || !user2 || !content) {
        console.error("Missing input")
        return
      }

      const data = {
        user1: user1,
        user2: user2,
        content: content,
        sender_id: user1
      }

      const response = await axios.post(API_ROUTES.START_MESSAGE, data)

      if (response.status !== 201) {
        throw new Error("Failed to create chatbox")
      }

      const new_chat_box = response.data.new_chat_box
      navigate(`/chat/${new_chat_box.chat_box_id}`)
    } catch (err) {
      console.error("Failed to start chat:", err)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='modal-container bg-white rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide relative'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div>
          <h2 className='text-xl font-semibold text-yellow-800 mb-4'>
            🌼 Start a conversation with <span className='text-[#E9967A]'>{tutorName}</span>
          </h2>

          <textarea
            placeholder='Type your message here...'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg resize-none mb-4'
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={handleStartMessage}
            className='flex gap-2 justify-center items-center w-full bg-yellow-800 text-white py-3 px-4 rounded-lg hover:bg-yellow-900 transition-colors duration-200'
          >
            <Send className='w-4 h-4' /> Send Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirstMessageModal
