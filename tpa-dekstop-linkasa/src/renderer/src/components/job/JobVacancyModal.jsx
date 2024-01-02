import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { db } from '../../../utils/firebase'
import PopUp from '../PopUp'

const JobVacancyModal = ({ isOpen, closeModal, selectedVacancy, setSelectedVacancy }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    position: '',
    requirement: '',
    description: ''
  })

  useEffect(() => {
    setForm({
      position: selectedVacancy ? selectedVacancy.position : '',
      requirement: selectedVacancy ? selectedVacancy.requirement : '',
      description: selectedVacancy ? selectedVacancy.description : ''
    })
  }, [selectedVacancy])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      position: '',
      requirement: '',
      description: ''
    })
    setSelectedVacancy(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleTextChange = (e) => {
    const { name, value } = e.target

    const processedValue = value.replace(/\n/g, '\\n')

    setForm((prevForm) => ({ ...prevForm, [name]: processedValue }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.position.trim() === '' ||
      form.requirement.trim() === '' ||
      form.description.trim() === ''
    ) {
      setError('Field can not be empty')
      return
    }

    try {
      setError('')

      if (selectedVacancy) {
        const vacanciesRef = doc(db, 'jobvacancies', selectedVacancy.id)
        await updateDoc(vacanciesRef, form)

        setSuccess('Successfully updated job vacancies')
      } else {
        await addDoc(collection(db, 'jobvacancies'), form)
        setSuccess('Successfully add new job vacancies')
      }
    } catch (error) {
      setError('Failed add new job vacancies')
      console.log(error)
    }

    handleCloseModal()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        className="modal mx-auto my-24"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
      >
        <div className="bg-white p-6 rounded-md w-[36rem] overflow-hidden h-[36rem] overflow-y-auto">
          <span className="flex justify-end">
            <button
              onClick={handleCloseModal}
              className="text-gray-500 p-1 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </span>

          <h2 className="text-2xl mb-4 font-semibold">
            {selectedVacancy ? 'Update' : 'Add New'} Job Vacancies
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Position</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select position</option>
                <option value="csm">Customer Service Manager</option>
                <option value="ids">Information Desk Staff</option>
                <option value="lfs">Lost and Found Staff</option>
                <option value="cis">Check-in Staff</option>
                <option value="ga">Gate Agents</option>
                <option value="aom">Airport Operations Manager</option>
                <option value="fom">Flight Operations Manager</option>
                <option value="ghm">Ground Handling Manager</option>
                <option value="ghs">Ground Handling Staff</option>
                <option value="lom">Lanside Operations Manager</option>
                <option value="mm">Maintenance Manager</option>
                <option value="ms">Maintenance Staff</option>
                <option value="cbco">Customs and Border Control Officers</option>
                <option value="bssu">Baggage Security Supervisor</option>
                <option value="bsst">Baggage Security Staff</option>
                <option value="cm">Cargo Manager</option>
                <option value="lm">Logistic Manager</option>
                <option value="fm">Fuel Manager</option>
                <option value="ch">Cargo Handlers</option>
                <option value="cem">Civil Engineering Manager</option>
                <option value="ceo">Airport Director/CEO</option>
                <option value="cfo">Chief Financial Officer/CFO</option>
                <option value="coo">Chief Operations Officer/COO</option>
                <option value="cso">Chief Security Officer/CSO</option>
                <option value="hrd">Human Resource Director</option>
              </select>
            </div>

            {/* Requirement */}
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Job Requirement</label>
              <textarea
                name="requirement"
                value={form.requirement}
                onChange={handleTextChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              />
            </div>

            {/* Description */}
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Job Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleTextChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              />
            </div>

            <button
              type="submit"
              className="mt-5 bg-green-500 w-full py-2 rounded-md text-center font-semibold text-white hover:bg-green-600"
            >
              Save
            </button>
          </form>
        </div>
      </Modal>

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default JobVacancyModal
