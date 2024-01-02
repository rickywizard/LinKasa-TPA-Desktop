import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { db } from '../../../utils/firebase'
import PopUp from '../PopUp'
import FormField from '../FormField'

const InterviewModal = ({ selectedApplicant, isOpen, closeModal, selectedInterview, setSelectedInterview }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    applicant: [],
    datetime: '',
    note: ''
  })

  useEffect(() => {
    setForm({
      applicant: selectedInterview ? selectedInterview.applicant : [],
      datetime: selectedInterview
        ? new Date(selectedInterview.datetime.toDate()).toISOString().slice(0, -8)
        : '',
      note: selectedInterview ? selectedInterview.note : '',
    })
  }, [selectedInterview])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      applicant: '',
      datetime: '',
      note: ''
    })
    if (selectedInterview) {
      setSelectedInterview(null)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.note.trim() === '' ||
      form.datetime === ''
    ) {
      setError('Field can not be empty')
      return
    }

    try {
      setError('')

      const datetimeValue = new Date(form.datetime)

      if (selectedInterview) {
        const interviewRef = doc(db, 'interviews', selectedInterview.id)
        await updateDoc(interviewRef, {
          ...form,
          datetime: datetimeValue
        })

        setSuccess('Successfully updated interview schedule')
      } else {
        await addDoc(collection(db, 'interviews'), {
          ...form,
          applicant: selectedApplicant,
          datetime: datetimeValue
        })
        setSuccess('Successfully add new interview schedule')
      }
    } catch (error) {
      setError('Failed add new interview schedule')
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
            {selectedInterview ? 'Update' : 'Add New'} Interview Schedules
          </h2>

          <h4 className="text-lg font-semibold">{selectedInterview ? selectedInterview.applicant.name : selectedApplicant ? selectedApplicant.name : ''}</h4>
          <p className="text-sm text-gray-600 mb-4 font-semibold">{selectedInterview ? selectedInterview.applicant.email : selectedApplicant ? selectedApplicant.email : ''}</p>

          <form onSubmit={handleSubmit}>
            <FormField
              labelName="Date and Time"
              type="datetime-local"
              name="datetime"
              placeholder="Date and time"
              value={form.datetime}
              handleChange={handleChange}
            />

            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
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

export default InterviewModal
