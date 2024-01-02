import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../utils/firebase'
import { roles } from '../../constant/roles'
import InterviewModal from '../../components/job/InterviewModal'

const ApplicantsPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [applicants, setApplicants] = useState([])
  const [selectedPosition, setSelectedPosition] = useState('')
  const [applicant, setApplicant] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'applicants'), (snapshot) => {
      const applicantsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setApplicants(applicantsData)
    })

    return () => unsubscribe()
  }, [])

  const handleDownloadCV = (cvUrl) => {
    window.open(cvUrl, '_blank')
  }

  const filteredApplicants = selectedPosition
    ? applicants.filter((applicant) => applicant.position === selectedPosition)
    : applicants

  const proceedInterview = (applicant) => {
    setApplicant(applicant)
    setOpenModal(true)
  }

  return (
    <>
      <div className="mb-4">
        <label className="text-gray-700 font-semibold">Filter by Position: </label>
        <select
          onChange={(e) => setSelectedPosition(e.target.value)}
          value={selectedPosition}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="">All Positions</option>
          {Object.keys(roles).map((position) => (
            <option key={position} value={position}>
              {roles[position]}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-xl text-gray-600 font-bold mb-4">Applicants</h2>
      {filteredApplicants.map((applicant) => (
        <div
          key={applicant.id}
          className="flex items-center justify-between space-x-2 border p-4 rounded-md mb-4"
        >
          <div>
            <h2 className="text-lg font-bold mb-2">Name: {applicant.name}</h2>
            <p className="text-gray-700 mb-2">
              Apply for: <strong>{roles[applicant.position]}</strong>
            </p>
            <p className="text-gray-700 mb-2">Phone Number: {applicant.phone}</p>
            <p className="text-gray-700 mb-2">Email: {applicant.email}</p>
            <p className="text-gray-700 mb-2">Birthdate: {applicant.birthdate}</p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => proceedInterview(applicant)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Proceed Interview
            </button>
            <button
              onClick={() => handleDownloadCV(applicant.cv)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Download CV
            </button>
          </div>
        </div>
      ))}

      <InterviewModal
        selectedApplicant={applicant}
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </>
  )
}

export default ApplicantsPage
