import React, { useEffect, useState } from 'react'
import PopUp from '../../components/PopUp'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import plusIcon from '../../assets/plus-solid.svg'
import FlightCrewModal from '../../components/flight/FlightCrewModal'

const FlightCrewPage = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [crewData, setCrewData] = useState([])
  const [selectedCrew, setSelectedCrew] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'flightcrews'), (snapshot) => {
      const crews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setCrewData(crews)
    })

    return () => unsubscribe()
  }, [])

  const deleteCrew = async (crewId) => {
    try {
      const crewRef = doc(db, 'flightcrews', crewId)

      await deleteDoc(crewRef)

      setSuccess('Delete success')
    } catch (error) {
      setError('Delete failed')
    }
  }

  const openUpdateModal = (crew) => {
    setSelectedCrew(crew)
    setOpenModal(true)
  }

  return (
    <>
      <h2 className="font-bold text-lg text-gray-600">Flight Crew List</h2>
      <div className="mx-auto mt-4 bg-white overflow-hidden flex items-center justify-center">
        <div className="w-full">
          {crewData.map((crew, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md mb-4 p-4 flex justify-between items-center"
            >
              <div>
                <strong>Nama:</strong> {crew.name}
                <br />
                <strong>Gender:</strong> {crew.gender}
                <br />
                <strong>Jabatan:</strong> {crew.position}
                <br />
                <strong>Tanggal Lahir:</strong> {crew.birthdate}
              </div>
              <div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                  onClick={() => openUpdateModal(crew)}
                >
                  <PencilAltIcon className="w-5 h-5" />
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => deleteCrew(crew.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setOpenModal(true)}>
        <div className="fixed bottom-7 right-7 bg-green-400 text-white p-5 rounded-full cursor-pointer text-center hover:bg-green-600">
          <img src={plusIcon} alt="" width="20" height="20" />
        </div>
      </button>

      <FlightCrewModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedCrew={selectedCrew}
        setSelectedCrew={setSelectedCrew}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default FlightCrewPage
