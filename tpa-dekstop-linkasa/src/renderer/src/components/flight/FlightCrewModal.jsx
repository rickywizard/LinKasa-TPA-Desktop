import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FormField from '../FormField'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import PopUp from '../PopUp'

Modal.setAppElement('#root')

const FlightCrewModal = ({ isOpen, closeModal, selectedCrew, setSelectedCrew }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    gender: '',
    position: ''
  })

  useEffect(() => {
    setForm({
      name: selectedCrew ? selectedCrew.name : '',
      birthdate: selectedCrew ? selectedCrew.birthdate : '',
      gender: selectedCrew ? selectedCrew.gender : '',
      position: selectedCrew ? selectedCrew.position : ''
    })
  }, [selectedCrew])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      name: '',
      birthdate: '',
      gender: '',
      position: ''
    })
    setSelectedCrew(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.name.trim() === '' ||
      form.birthdate.trim() === '' ||
      form.gender === '' ||
      form.position === ''
    ) {
      setError('Field cannot be empty')
      return
    }

    try {
      setError('')

      if (selectedCrew) {
        const crewRef = doc(db, 'flightcrews', selectedCrew.id)

        await updateDoc(crewRef, form)
        setSuccess('Successfully udpated fligth crew')
      } else {
        await addDoc(collection(db, 'flightcrews'), form)
        setSuccess('New flight crew added')
      }
    } catch (error) {
      setError('Failed save new crew')
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
            {selectedCrew ? 'Update' : 'Add New'} Flight Crew
          </h2>

          <form onSubmit={handleSubmit}>
            <FormField
              labelName="Name"
              type="name"
              name="name"
              placeholder="Name"
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              labelName="Birthdate"
              type="date"
              name="birthdate"
              value={form.birthdate}
              handleChange={handleChange}
            />

            {/* Gender Radio Buttons */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900">Gender</label>
              <div className="mt-1 flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={form.gender === 'Male'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="male" className="text-sm text-gray-900">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={form.gender === 'Female'}
                  onChange={handleChange}
                  className="ml-4 mr-2"
                />
                <label htmlFor="female" className="text-sm text-gray-900">
                  Female
                </label>
              </div>
            </div>

            {/* Position Radio Buttons */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900">Position</label>
              <div className="mt-1 flex items-center">
                <input
                  type="radio"
                  id="pilot"
                  name="position"
                  value="Pilot"
                  checked={form.position === 'Pilot'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="pilot" className="text-sm text-gray-900">
                  Pilot
                </label>
                <input
                  type="radio"
                  id="attendant"
                  name="position"
                  value="Attendant"
                  checked={form.position === 'Attendant'}
                  onChange={handleChange}
                  className="ml-4 mr-2"
                />
                <label htmlFor="attendant" className="text-sm text-gray-900">
                  Flight Attendant
                </label>
              </div>
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

export default FlightCrewModal
