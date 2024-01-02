import React, { useState, useEffect } from 'react'
import { collection, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import { roles } from '../../constant/roles'
import JobInfoList from '../../components/job/JobInfoList'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import JobVacancyModal from '../../components/job/JobVacancyModal'

const JobVacancyPage = () => {
  const [jobVacancies, setJobVacancies] = useState([])
  const [expandedRequirements, setExpandedRequirements] = useState(null)
  const [expandedDescription, setExpandedDescription] = useState(null)

  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedVacancy, setSelectedVacancy] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobvacancies'), (snapshot) => {
      const vacanciesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setJobVacancies(vacanciesData)
    })

    return () => unsubscribe()
  }, [])

  const toggleRequirementsExpansion = (jobId) => {
    setExpandedRequirements((prevExpandedRequirements) =>
      prevExpandedRequirements === jobId ? null : jobId
    )
  }

  const toggleDescriptionExpansion = (jobId) => {
    setExpandedDescription((prevExpandedDescription) =>
      prevExpandedDescription === jobId ? null : jobId
    )
  }

  const handleDelete = async (jobId) => {
    try {
      const vacanciesRef = doc(db, 'jobvacancies', jobId)
      await deleteDoc(vacanciesRef)

      setSuccess('Successfully delete training')
    } catch (error) {
      setError('Error deleting training')
    }
  }

  const openUpdateModal = (job) => {
    setSelectedVacancy(job)
    setOpenModal(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-600">Job Vacancies</h2>

        <button
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none"
          onClick={() => setOpenModal(true)}
        >
          Add
        </button>
      </div>

      {jobVacancies.length === 0 ? (
        <p>No job vacancies available at the moment.</p>
      ) : (
        <div>
          {jobVacancies.map((job) => (
            <div key={job.id} className="border p-4 rounded-md mb-4">
              <h2 className="text-2xl font-bold mb-2">{roles[job.position]}</h2>
              <h2 className="text-lg text-gray-700 font-semibold mb-2">PT. LinKasa Pura</h2>
              <button
                onClick={() => toggleRequirementsExpansion(job.id)}
                className="text-gray-700 hover:underline focus:outline-none mb-2 block"
              >
                Show Requirements
              </button>
              {expandedRequirements === job.id && <JobInfoList text={job.requirement} />}
              <button
                onClick={() => toggleDescriptionExpansion(job.id)}
                className="text-gray-700 hover:underline focus:outline-none mb-2 block"
              >
                Show Description
              </button>
              {expandedDescription === job.id && <JobInfoList text={job.description} />}

              <div className="flex space-x-2">
                <button
                  onClick={() => openUpdateModal(job)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                >
                  <PencilAltIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobVacancyModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedVacancy={selectedVacancy}
        setSelectedVacancy={setSelectedVacancy}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default JobVacancyPage
