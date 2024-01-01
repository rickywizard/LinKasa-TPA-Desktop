import React from 'react'

const ChatList = ({ selectedChat }) => {
  const handleChatClick = (chat) => {
    // console.log('click', chat)
    selectedChat(chat)
  }

  return (
    <div className="w-1/3 bg-gray-800 p-4 text-white overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-4">LinKasa Chat</h1>
      <ul>
        {/* GENERAL CHAT */}
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('allchat')}
        >
          General Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('gopchat')}
        >
          General Operations Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('gschat')}
        >
          General Security Chat
        </li>

        <div className="border-b border-gray-300 mb-4"></div>

        {/* DEPARTMENT CHAT */}
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('cschat')}
        >
          Customer Service Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('idchat')}
        >
          Information Desk Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('lfchat')}
        >
          Lost and Found Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('cichat')}
        >
          Check-in Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('gachat')}
        >
          Gate Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('aochat')}
        >
          Airport Operations Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('fochat')}
        >
          Flight Operations Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('ghchat')}
        >
          Ground Handling Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('lochat')}
        >
          Landside Operations Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('mtchat')}
        >
          Maintenance Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('cbchat')}
        >
          Custom and Border Control Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('bschat')}
        >
          Baggage Security Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('carchat')}
        >
          Cargo Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('logchat')}
        >
          Logistics Chat
        </li>
        <li
          className="mb-2 cursor-pointer hover:text-gray-300 p-3 hover:bg-gray-700 w-full text-left"
          onClick={() => handleChatClick('cechat')}
        >
          Civil Engineering Chat
        </li>
      </ul>
    </div>
  )
}

export default ChatList
