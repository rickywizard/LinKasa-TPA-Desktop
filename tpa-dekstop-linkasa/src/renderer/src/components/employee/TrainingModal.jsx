import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import PopUp from '../PopUp'
import FormField from '../FormField'
import { TrashIcon } from '@heroicons/react/solid'
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebase'

Modal.setAppElement('#root')

const TrainingModal = ({ isOpen, closeModal, selectedTraining, setSelectedTraining }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [employees, setEmployees] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])

  const [form, setForm] = useState({
    name: '',
    trainer: '',
    datetime: '',
    detail: '',
    participants: []
  })

  useEffect(() => {
    setForm({
      name: selectedTraining ? selectedTraining.name : '',
      trainer: selectedTraining ? selectedTraining.trainer : '',
      datetime: selectedTraining
        ? new Date(selectedTraining.datetime.toDate()).toISOString().slice(0, -8)
        : '',
      detail: selectedTraining ? selectedTraining.detail : '',
      participants: selectedTraining ? [...selectedTraining.participants] : []
    })
  }, [selectedTraining])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const employeesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setEmployees(employeesData)
    })

    return () => unsubscribe()
  }, [])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      name: '',
      trainer: '',
      datetime: '',
      detail: '',
      participants: []
    })
    setSelectedTraining(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleAddParticipant = () => {
    setForm({
      ...form,
      participants: [...form.participants, '']
    })
  }

  const handleRemoveParticipant = (index) => {
    const updatedParticipants = [...form.participants]
    const removedParticipant = updatedParticipants.splice(index, 1)[0]

    setSelectedParticipants((prevSelected) =>
      prevSelected.filter((selected) => selected !== removedParticipant)
    )

    setForm({
      ...form,
      participants: updatedParticipants
    })
  }

  const handleParticipantChange = (index, value) => {
    const updatedParticipants = [...form.participants]
    updatedParticipants[index] = value

    setSelectedParticipants(updatedParticipants.filter(Boolean))

    setForm({
      ...form,
      participants: updatedParticipants
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.name.trim() === '' ||
      form.trainer.trim() === '' ||
      form.datetime === '' ||
      form.detail.trim() === '' ||
      form.participants.length === 0 ||
      form.participants.some((participant) => participant.trim() === '')
    ) {
      setError('Field can not be empty')
      return
    }

    try {
      setError('')

      const datetimeValue = new Date(form.datetime)

      if (selectedTraining) {
        const trainingRef = doc(db, 'trainings', selectedTraining.id)
        await updateDoc(trainingRef, {
          ...form,
          datetime: datetimeValue
        })

        setSuccess('Successfully updated training schedule')
      } else {
        await addDoc(collection(db, 'trainings'), {
          ...form,
          datetime: datetimeValue
        })
        setSuccess('Successfully add new training schedule')
      }
    } catch (error) {
      setError('Failed add new training schedule')
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
            {selectedTraining ? 'Update' : 'Add New'} Training Schedule
          </h2>

          <form onSubmit={handleSubmit}>
            <FormField
              labelName="Training Name"
              type="text"
              name="name"
              placeholder="Training name"
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              labelName="Trainer name"
              type="text"
              name="trainer"
              placeholder="Trainer name"
              value={form.trainer}
              handleChange={handleChange}
            />

            <FormField
              labelName="Date and Time"
              type="datetime-local"
              name="datetime"
              placeholder="Date and time"
              value={form.datetime}
              handleChange={handleChange}
            />

            <FormField
              labelName="Training Detail"
              type="text"
              name="detail"
              placeholder="Training detail"
              value={form.detail}
              handleChange={handleChange}
            />

            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="participants" className="block text-sm font-medium text-gray-900">
                  Participants
                </label>
                <button
                  type="button"
                  className="font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black hover:bg-slate-300"
                  onClick={handleAddParticipant}
                >
                  Assign employee
                </button>
              </div>

              {form.participants.map((participant, index) => (
                <div key={index} className="flex mb-2">
                  <select
                    value={participant}
                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded-md mr-2"
                  >
                    <option value="">Select Employee</option>
                    {employees
                      .filter(
                        (employee) =>
                          !selectedParticipants.includes(employee.id) || participant === employee.id
                      )
                      .map((employee, index) => (
                        <option key={index} value={employee.id}>
                          {employee.name} - {employee.role} - {employee.email}
                        </option>
                      ))}
                  </select>
                  {index === form.participants.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(index)}
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
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

export default TrainingModal
