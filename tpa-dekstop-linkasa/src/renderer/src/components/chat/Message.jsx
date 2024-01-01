import React from 'react'

const Message = ({ name, role, message, isSender }) => {
  return isSender ? (
    <div className="flex p-4 flex-col items-end justify-end">
      <p className="mx-3 mb-2 text-sm">{name} - {role}</p>
      <div className="mx-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg w-fit">{message}</div>
      </div>
    </div>
  ) : (
    <div className="flex p-4 flex-col">
      <p className="mx-3 mb-2 text-sm">{name} - {role}</p>
      <div className="mx-3">
        <div className="bg-green-600 text-white p-2 rounded-lg w-fit">{message}</div>
      </div>
    </div>
  )
}

export default Message
