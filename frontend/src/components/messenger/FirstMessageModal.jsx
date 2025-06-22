import { useState } from 'react'
import { X, Send } from 'lucide-react'

const FirstMessageModal = ({ onClose, tutorName }) => {
  
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
          <h2 className='text-xl font-semibold text-yellow-800 mb-4'>🌼 Start a conversation with <span className='text-[#E9967A]'>{tutorName}</span></h2>
          
          <textarea
            placeholder='Type your message here...'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg resize-none mb-4'
            rows={4}
          />
          
          <button className='flex gap-2 justify-center items-center w-full bg-yellow-800 text-white py-3 px-4 rounded-lg hover:bg-yellow-900 transition-colors duration-200'>
            <Send className='w-4 h-4'/> Send Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirstMessageModal