import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../../utils/firebase'

const Input = ({ selectedChat }) => {
  const { currentUser } = useAuth()
  const [sendMessage, setSendMessage] = useState('')

  const handleSendMessage = async () => {
    console.log('send clicked')
    if (sendMessage.trim() !== '') {
      try {
        await addDoc(collection(db, selectedChat), {
          createdAt: serverTimestamp(),
          message: sendMessage,
          sender: currentUser.email
        })

        setSendMessage('')
      } catch (error) {
        console.log('Error sending message: ', error)
      }
    }
  }

  const handleInputChange = (e) => {
    setSendMessage(e.target.value)
  }

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="sticky bottom-0 flex justify-between items-center bg-white p-4 border-b">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 border border-gray-400 rounded-full py-2 px-4 focus:outline-none"
        onChange={handleInputChange}
        onKeyDown={handleKey}
        value={sendMessage}
      />
      <button
        className="ml-2 py-2 px-4 bg-green-400 text-white rounded-full hover:bg-green-600 focus:outline-none"
        onClick={handleSendMessage}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
          <path
            opacity="1"
            fill="#ffffff"
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </button>
    </div>
  )
}

export default Input
