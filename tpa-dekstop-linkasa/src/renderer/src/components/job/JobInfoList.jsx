import React from 'react'

const JobInfoList = ({ text }) => {
  // Pastikan text benar-benar bertipe string
  const stringText = text.replace(/\\n/g, '\n')

  // Sekarang kita bisa split
  const infos = stringText.split('\n')

  return (
    <ul>
      {infos.map((info, index) => (
        <li className='text-sm text-gray-700 mb-2' key={index}>{info}</li>
      ))}
    </ul>
  )
}

export default JobInfoList
