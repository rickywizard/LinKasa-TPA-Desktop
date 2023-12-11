import React from 'react'
import logo from '../../../../resources/logo.png?asset'

const TopBar = ({ handleSignOut }) => {
  return (
    <div className='bg-white px-4 py-1 flex justify-between items-center border-b border-gray-300'>
      <img src={logo} alt='Logo' className='w-40' />
      <button onClick={handleSignOut} className='text-black hover:bg-gray-200 p-2'>
        Sign Out
      </button>
    </div>
  )
}

export default TopBar
