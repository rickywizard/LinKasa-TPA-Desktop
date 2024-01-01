import { CheckIcon, PencilAltIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import LostFoundModal from '../../components/lostfound/LostFoundModal'
import PopUp from '../../components/PopUp'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebase'

const LostFoundPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lostItems, setLostItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lostitems'), (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setLostItems(itemsData)
    })

    return () => unsubscribe()
  }, [])

  const openUpdateModal = (item) => {
    setSelectedItem(item)
    setOpenModal(true)
  }

  const handleCheck = async (item) => {
    const itemRef = doc(db, 'lostitems', item.id)
    try {
      await updateDoc(itemRef, {
        status: 'Returned'
      })
      setSuccess('Successfully updated status')
    } catch (error) {
      setError('Failed to update status')
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg text-gray-600 mb-4">Lost and Found Items</h2>

        <button
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none"
          onClick={() => setOpenModal(true)}
        >
          Add
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r w-1/6">Name</th>
            <th className="py-2 px-4 border-b border-r w-1/6">Classification</th>
            <th className="py-2 px-4 border-b border-r w-1/6">Photo</th>
            <th className="py-2 px-4 border-b border-r w-1/6">Detail</th>
            <th className="py-2 px-4 border-b border-r w-1/6">Found Date & Time</th>
            <th className="py-2 px-4 border-b border-r w-1/6">Status</th>
            <th className="py-2 px-4 border-b border-r w-1/6">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {lostItems.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b border-r w-1/6">{item.name}</td>
              <td className="py-2 px-4 border-b border-r w-1/6">
                {item.classification.charAt(0).toUpperCase() + item.classification.slice(1)}
              </td>
              <td className="py-2 px-4 border-b border-r w-1/6">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="mx-auto w-full h-full object-cover"
                />
              </td>
              <td className="py-2 px-4 border-b border-r w-1/6">
                {item.detail === '' ? '-' : item.detail}
              </td>
              <td className="py-2 px-4 border-b border-r w-1/6">
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric'
                }).format(item.foundAt.toDate())}
              </td>
              <td className="py-2 px-4 border-b border-r w-1/6">
                <span
                  className={`${item.status === 'Unclaimed' ? 'text-red-500' : 'text-green-500'} font-semibold`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-r w-1/6">
                <button
                  onClick={() => openUpdateModal(item)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <PencilAltIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleCheck(item)}
                  className="text-green-500 hover:text-green-700 focus:outline-none ml-2"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <LostFoundModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default LostFoundPage
