import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import PopUp from '../../components/PopUp'
import FlightScheduleModal from '../../components/flight/FlightScheduleModal'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../utils/firebase'

const FlightSchedulePage = ({ role }) => {
  const [openModal, setOpenModal] = useState(false)
  const [flights, setFlights] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'flightschedules'), (snapshot) => {
      const flightsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setFlights(flightsData)
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (flightId) => {
    try {
      const flightRef = doc(db, 'flightschedules', flightId)
      await deleteDoc(flightRef)

      setSuccess('Successfully delete flight')
    } catch (error) {
      setError('Error deleting flight')
    }
  }

  const openUpdateModal = (flight) => {
    setSelectedFlight(flight)
    setOpenModal(true)
  }

  return (
    <>
      <div className="mx-auto mt-4 bg-white overflow-hidden">
        {role === 'fom' && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
            onClick={() => setOpenModal(true)}
          >
            Add Flight Schedule
          </button>
        )}

        {flights.map((flight, index) => (
          <div key={index} className="p-4 border rounded-md shadow-md mb-2">
            <h2 className="text-xl font-bold mb-2">{flight.flightnumber}</h2>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Source: {flight.source}</span>
              <span>Destination: {flight.destination}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Airplane: {flight.airplane}</span>
            </div>

            <div className="text-gray-600 mb-2">
              <span>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric'
                }).format(flight.datetime.toDate())}
              </span>
            </div>

            <div className="text-gray-600 mb-2">
              Status:{' '}
              <strong
                className={`${
                  flight.status === 'On Time'
                    ? 'text-green-500'
                    : flight.status === 'Delay'
                    ? 'text-orange-400'
                    : 'text-red-500'
                }`}
              >
                {flight.status}
              </strong>
            </div>

            {role === 'fom' && (
              <div className="flex items-center">
                <button
                  onClick={() => openUpdateModal(flight)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                >
                  <PencilAltIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(flight.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <FlightScheduleModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedFlight={selectedFlight}
        setSelectedFlight={setSelectedFlight}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default FlightSchedulePage
