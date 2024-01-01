import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Message from '../components/chat/Message'
import { collection, getDocs, onSnapshot, orderBy, query, where} from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Input from '../components/chat/Input'
import ChatList from '../components/chat/ChatList'
import { Link } from 'react-router-dom'
import { chatNames } from '../constant/chatNames'

const Chat = () => {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState([])
  const [selectedChat, setSelectedChat] = useState('allchat')

  const limitedRoles = ['fm', 'ceo', 'cfo', 'hrd']

  const [userData, setUserData] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const userQuery = query(collection(db, 'employees'), where('email', '==', currentUser.email))
      const querySnapshot = await getDocs(userQuery)

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data()
        setUserData(data)
      }
    }

    fetchUser()
  }, [currentUser.email])

  useEffect(() => {
    // console.log('updated chat', selectedChat)
    const messageQuery = query(collection(db, selectedChat), orderBy('createdAt'))

    const unsubscribe = onSnapshot(messageQuery, async (querySnapshot) => {
      const chatResult = []

      for (const document of querySnapshot.docs) {
        const messageData = document.data()

        // user data query
        const userQuery = query(
          collection(db, 'employees'),
          where('email', '==', messageData.sender)
        )
        const userSnapshot = await getDocs(userQuery)

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data()

          chatResult.push({
            id: document.id,
            name: userData.name,
            role: userData.role,
            ...messageData,
          })
        }
      }

      // const chatResult = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }))

      setMessages(chatResult)
    })

    return () => unsubscribe()
  }, [selectedChat])

  const handleSelectedChat = (chat) => {
    setSelectedChat(chat)
  }

  return (
    <div className="flex h-screen bg-gray-200">

      <ChatList selectedChat={handleSelectedChat} />

      <div className="flex flex-col w-full">
        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white p-4 border-b">
          <h2 className="text-xl font-semibold">{chatNames[selectedChat]}</h2>

          <Link to='/dashboard'>
            <button className="text-gray-600 p-1 rounded-full hover:bg-gray-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </Link>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto h-full">
          {messages.length == 0 ? (
            <h2 className="text-xl m-4">
              No chat history
            </h2>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                name={message.name}
                role={message.role}
                message={message.message}
                isSender={message.sender === currentUser.email}
              />
            ))
          )}
        </div>

        {!limitedRoles.includes(userData.role) && (
          <Input selectedChat={selectedChat}/>
        )}
      </div>
    </div>
  )
}

export default Chat
