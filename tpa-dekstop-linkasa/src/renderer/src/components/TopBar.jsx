import React from 'react'
import logo from '../../../../resources/logo.png?asset'
import { Link } from 'react-router-dom'

const TopBar = ({ handleSignOut }) => {
  return (
    <div className="sticky top-0 bg-white px-4 py-1 flex justify-between items-center border-b border-gray-300">
      <img src={logo} alt="Logo" className="w-40" />
      <div className="flex gap-7">
        <button className="text-black hover:bg-gray-200 p-2">
          <Link to="/chat">
            Chat
          </Link>
        </button>
        <button onClick={handleSignOut} className="text-black hover:bg-gray-200 p-2">
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default TopBar
