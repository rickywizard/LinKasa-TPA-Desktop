import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../utils/firebase'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import TrainingModal from '../../components/employee/TrainingModal'
import PopUp from '../../components/PopUp'

const EmployeeTrainingPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [trainings, setTrainings] = useState([])
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'trainings'), (snapshot) => {
      const trainingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setTrainings(trainingsData)
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (trainingId) => {
    try {
      const trainingRef = doc(db, 'trainings', trainingId)
      await deleteDoc(trainingRef)

      setSuccess('Successfully delete training')
    } catch (error) {
      setError('Error deleting training')
    }
  }

  const openUpdateModal = (training) => {
    setSelectedTraining(training)
    setOpenModal(true)
  }

  return (
    <>
      <div className="container mx-auto mt-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg text-gray-600">Employee Training Schedule</h2>

          <button
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none"
            onClick={() => setOpenModal(true)}
          >
            Add
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="bg-white p-4 rounded-md shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{training.name}</h3>
                <p className="text-gray-600">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  }).format(training.datetime.toDate())}
                </p>
                <p className="text-gray-600 w-96">{training.detail}</p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none"
                  onClick={() => openUpdateModal(training)}
                >
                  <PencilAltIcon className="w-5 h-5" />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none"
                  onClick={() => handleDelete(training.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TrainingModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedTraining={selectedTraining}
        setSelectedTraining={setSelectedTraining}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default EmployeeTrainingPage
