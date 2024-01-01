import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FormField from '../FormField'
import { cityOptions } from '../../constant/cities.js'
import { TrashIcon } from '@heroicons/react/solid'
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebase.js'
import PopUp from '../PopUp.jsx'

Modal.setAppElement('#root')

const FlightScheduleModal = ({ isOpen, closeModal, selectedFlight, setSelectedFlight }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [airplanes, setAirplanes] = useState([])
  const [selectedCrews, setSelectedCrews] = useState([])
  const [selectedPilots, setSelectedPilots] = useState([])
  const [crewData, setCrewData] = useState([])

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const crewSnapshot = await getDocs(collection(db, 'flightcrews'))

        const crews = crewSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setCrewData(crews)
      } catch (error) {
        console.log('Failed to fetch flight crews: ', error)
      }
    }

    fetchCrew()
  }, [])

  useEffect(() => {
    const fetchAirplanes = async () => {
      try {
        const airplanesSnapshot = await getDocs(collection(db, 'airplane'))

        const airplanesData = airplanesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setAirplanes(airplanesData)
      } catch (error) {
        console.error('Error fetching airplanes:', error)
      }
    }

    fetchAirplanes()
  }, [])

  const [form, setForm] = useState({
    flightnumber: '',
    source: '',
    destination: '',
    datetime: '',
    airplane: '',
    pilot: '',
    copilot: '',
    flightcrews: [],
    status: ''
  })

  useEffect(() => {
    setForm({
      flightnumber: selectedFlight ? selectedFlight.flightnumber : '',
      source: selectedFlight ? selectedFlight.source : '',
      destination: selectedFlight ? selectedFlight.destination : '',
      datetime: selectedFlight
        ? new Date(selectedFlight.datetime.toDate()).toISOString().slice(0, -8)
        : '',
      airplane: selectedFlight ? selectedFlight.airplane : '',
      pilot: selectedFlight ? selectedFlight.pilot : '',
      copilot: selectedFlight ? selectedFlight.copilot : '',
      flightcrews: selectedFlight ? [...selectedFlight.flightcrews] : [],
      status: selectedFlight ? selectedFlight.status : ''
    })
  }, [selectedFlight])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      flightnumber: '',
      source: '',
      destination: '',
      datetime: '',
      airplane: '',
      pilot: '',
      copilot: '',
      flightcrews: [],
      status: ''
    })
    setSelectedFlight(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleAddCrew = () => {
    setForm({
      ...form,
      flightcrews: [...form.flightcrews, '']
    })
  }

  const handleRemoveCrew = (index) => {
    const updatedCrews = [...form.flightcrews]
    const removedCrew = updatedCrews.splice(index, 1)[0]

    setSelectedCrews((prevSelected) => prevSelected.filter((selected) => selected !== removedCrew))

    setForm({
      ...form,
      flightcrews: updatedCrews
    })
  }

  const handleCrewChange = (index, value) => {
    const updatedCrews = [...form.flightcrews]
    updatedCrews[index] = value

    setSelectedCrews(updatedCrews.filter(Boolean))

    setForm({
      ...form,
      flightcrews: updatedCrews
    })
  }

  const getRemainingCities = (selectedCity) => {
    return Object.values(cityOptions).filter((city) => city !== selectedCity)
  }

  const sourceOptions = form.destination
    ? getRemainingCities(form.destination, cityOptions)
    : Object.values(cityOptions)

  const destinationOptions = form.source
    ? getRemainingCities(form.source, cityOptions)
    : Object.values(cityOptions)

  const generateFlightNumber = (dateTimeLocal, airplaneCode, destination) => {
    const date = new Date(dateTimeLocal)

    const year = date.getFullYear().toString().slice(-2)

    const formattedDate = `${year}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
      .getDate()
      .toString()
      .padStart(2, '0')}`

    const flightNumber = `${formattedDate}${airplaneCode}${destination}`

    return flightNumber
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.source.trim() === '' ||
      form.destination.trim() === '' ||
      form.datetime === '' ||
      form.airplane.trim() === '' ||
      form.pilot.trim() === '' ||
      form.copilot.trim() === '' ||
      form.flightcrews.length === 0 ||
      form.flightcrews.some((crew) => crew.trim() === '')
    ) {
      setError('Field can not be empty')
      return
    }

    const flightNumber = generateFlightNumber(form.datetime, form.airplane, form.destination)

    try {
      setError('')

      const datetimeValue = new Date(form.datetime)

      if (selectedFlight) {
        const flightRef = doc(db, 'flightschedules', selectedFlight.id)
        await updateDoc(flightRef, {
          ...form,
          datetime: datetimeValue
        })

        setSuccess('Successfully updated flight')
      } else {
        await addDoc(collection(db, 'flightschedules'), {
          ...form,
          datetime: datetimeValue,
          flightnumber: flightNumber,
          status: 'On Time'
        })

        setSuccess('Successfully add new flight')
      }
    } catch (error) {
      setError('Failed save new flight')
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
            {selectedFlight ? 'Update' : 'Add New'} Flight Schedule
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Source</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select source</option>
                {sourceOptions.map((city) => (
                  <option key={city} value={city}>
                    {Object.keys(cityOptions).find((key) => cityOptions[key] === city)} - {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Destination</label>
              <select
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select destination</option>
                {destinationOptions.map((city) => (
                  <option key={city} value={city}>
                    {Object.keys(cityOptions).find((key) => cityOptions[key] === city)} - {city}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              labelName="Date and Time"
              type="datetime-local"
              name="datetime"
              placeholder="Date and time"
              value={form.datetime}
              handleChange={handleChange}
            />

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-900">Status</label>
              <div className="mt-1 flex items-center">
                <input
                  type="radio"
                  id="ontime"
                  name="status"
                  value="On Time"
                  checked={form.status === 'On Time'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="ontime" className="text-sm text-gray-900">
                  On Time
                </label>
                <input
                  type="radio"
                  id="delay"
                  name="status"
                  value="Delay"
                  checked={form.status === 'Delay'}
                  onChange={handleChange}
                  className="ml-4 mr-2"
                />
                <label htmlFor="delay" className="text-sm text-gray-900">
                  Delay
                </label>
                <input
                  type="radio"
                  id="cancelled"
                  name="status"
                  value="Cancelled"
                  checked={form.status === 'Cancelled'}
                  onChange={handleChange}
                  className="ml-4 mr-2"
                />
                <label htmlFor="cancelled" className="text-sm text-gray-900">
                  Cancelled
                </label>
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Airplane</label>
              <select
                name="airplane"
                value={form.airplane}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select airplane</option>
                {airplanes.map((airplane, index) => (
                  <option key={index} value={airplane.plane}>
                    {airplane.airline} - {airplane.plane}
                  </option>
                ))}
              </select>
            </div>

            {/* ASSIGN FLIGHT CREWS */}
            <h2 className="text-md font-semibold my-4">Assign Flight Crews</h2>

            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="flightcrews" className="block text-sm font-medium text-gray-900">
                  Pilots
                </label>
              </div>

              <div className="flex mb-2">
                <select
                  name="pilot"
                  value={form.pilot}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md mr-2"
                >
                  <option value="">Select Pilot</option>
                  {crewData
                    .filter(
                      (crew) =>
                        crew.position === 'Pilot' &&
                        (form.copilot === '' || form.copilot !== crew.id)
                    )
                    .map((crew, index) => (
                      <option key={index} value={crew.id}>
                        {crew.name} - {crew.position}
                      </option>
                    ))}
                </select>

                <select
                  name="copilot"
                  value={form.copilot}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md mr-2"
                >
                  <option value="">Select Co-Pilot</option>
                  {crewData
                    .filter(
                      (crew) =>
                        crew.position === 'Pilot' && (form.pilot === '' || form.pilot !== crew.id)
                    )
                    .map((crew, index) => (
                      <option key={index} value={crew.id}>
                        {crew.name} - {crew.position}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="participants" className="block text-sm font-medium text-gray-900">
                  Flight Attendants
                </label>
                <button
                  type="button"
                  className="font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black hover:bg-slate-300"
                  onClick={handleAddCrew}
                >
                  Add Flight Attendant
                </button>
              </div>

              {form.flightcrews.map((flightcrew, index) => (
                <div key={index} className="flex mb-2">
                  <select
                    value={flightcrew}
                    onChange={(e) => handleCrewChange(index, e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded-md mr-2"
                  >
                    <option value="">Select Flight Attendant</option>
                    {crewData
                      .filter(
                        (crew) =>
                          crew.position === 'Attendant' &&
                          (!selectedCrews.includes(crew.id) || flightcrew === crew.id)
                      )
                      .map((crew, index) => (
                        <option key={index} value={crew.id}>
                          {crew.name} - {crew.position}
                        </option>
                      ))}
                  </select>
                  {index === form.flightcrews.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCrew(index)}
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

export default FlightScheduleModal
