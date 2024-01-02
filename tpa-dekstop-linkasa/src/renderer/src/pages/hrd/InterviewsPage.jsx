import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import PopUp from '../../components/PopUp'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import InterviewModal from '../../components/job/InterviewModal'

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [applicantInfo, setApplicantInfo] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'interviews'), (snapshot) => {
      const interviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setInterviews(interviewsData)
    })

    return () => unsubscribe()
  }, [])

  const handleDeleteInterview = async (interviewId) => {
    try {
      await deleteDoc(doc(db, 'interviews', interviewId))
      setSuccess('Delete success')
    } catch (error) {
      console.error('Error deleting interview:', error)
    }
  }

  const openUpdateModal = (interview) => {
    setSelectedInterview(interview)
    setOpenModal(true)
  }

  return (
    <div>
      <h2 className="text-xl text-gray-600 font-bold mb-4">Interview Schedules</h2>
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="flex items-center justify-between space-x-2 border p-4 rounded-md mb-4"
        >
          <div>
            <h2 className="text-lg font-bold mb-2">Applicant: {interview.applicant.name}</h2>
            <p className="text-gray-700 mb-2">
              Date and Time:{' '}
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
              }).format(interview.datetime.toDate())}
            </p>
            <p className="text-gray-700 mb-2">Note: {interview.note}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => openUpdateModal(interview)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <PencilAltIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteInterview(interview.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      <InterviewModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedInterview={selectedInterview}
        setSelectedInterview={setSelectedInterview}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </div>
  )
}

export default InterviewsPage
