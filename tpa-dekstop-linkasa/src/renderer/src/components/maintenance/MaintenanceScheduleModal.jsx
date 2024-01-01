import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FormField from '../FormField'
import { TrashIcon } from '@heroicons/react/solid'
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import PopUp from '../PopUp'
import { roles } from '../../constant/roles'

Modal.setAppElement('#root')

const MaintenanceScheduleModal = ({
  isOpen,
  closeModal,
  selectedMaintenance,
  setSelectedMaintenance,
  employees,
  role
}) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedStaffs, setSelectedStaffs] = useState([])
  const [facilites, setFacilities] = useState([])

  const [form, setForm] = useState({
    facility: '',
    datetime: '',
    status: '',
    staffs: []
  })

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const facilitySnapshot = await getDocs(collection(db, 'facilities'))

        const facilityData = facilitySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setFacilities(facilityData)
      } catch (error) {
        console.log('Failed to fetch facility: ', error)
      }
    }

    fetchFacility()
  }, [])

  useEffect(() => {
    setForm({
      facility: selectedMaintenance ? selectedMaintenance.facility : '',
      datetime: selectedMaintenance
        ? new Date(selectedMaintenance.datetime.toDate()).toISOString().slice(0, -8)
        : '',
      status: selectedMaintenance ? selectedMaintenance.status : '',
      staffs: selectedMaintenance ? [...selectedMaintenance.staffs] : []
    })
  }, [selectedMaintenance])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      facility: '',
      datetime: '',
      status: '',
      staffs: []
    })
    setSelectedMaintenance(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleAddStaff = () => {
    setForm({
      ...form,
      staffs: [...form.staffs, '']
    })
  }

  const handleRemoveStaff = (index) => {
    const updatedStaffs = [...form.staffs]
    const removedStaff = updatedStaffs.splice(index, 1)[0]

    setSelectedStaffs((prevSelected) =>
      prevSelected.filter((selected) => selected !== removedStaff)
    )

    setForm({
      ...form,
      staffs: updatedStaffs
    })
  }

  const handleStaffChange = (index, value) => {
    const updatedStaffs = [...form.staffs]
    updatedStaffs[index] = value

    setSelectedStaffs(updatedStaffs.filter(Boolean))

    setForm((prevForm) => ({
      ...prevForm,
      staffs: updatedStaffs
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.facility.trim() === '' ||
      form.datetime === '' ||
      form.staffs.length === 0 ||
      form.staffs.some((staff) => staff.trim() === '')
    ) {
      setError('Field cannot be empty')
      return
    }

    try {
      setError('')

      const datetimeValue = new Date(form.datetime)

      if (selectedMaintenance) {
        const maintenanceRef = doc(db, 'maintenanceschedules', selectedMaintenance.id)
        await updateDoc(maintenanceRef, {
          ...form,
          datetime: datetimeValue
        })
        setSuccess('Successfully add new maintenance schedule')
      } else {
        await addDoc(collection(db, 'maintenanceschedules'), {
          ...form,
          datetime: datetimeValue,
          status: 'Not Done'
        })
        setSuccess('Successfully add new maintenance schedule')
      }
    } catch (error) {
      setError('Failed add new maintenance schedule')
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
            {selectedMaintenance ? 'Update' : 'Add New'} Maintenance Schedule
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Facility & Equipment</label>
              <select
                name="facility"
                value={form.facility}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select facility or equipment</option>
                {facilites.map((facility, index) => (
                  <option key={index} value={facility.name}>
                    {facility.name} - {facility.clear ? 'Clear' : 'Need maintenance'}
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
                  id="done"
                  name="status"
                  value="Done"
                  checked={form.status === 'Done'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="done" className="text-sm text-gray-900">
                  Done
                </label>
                <input
                  type="radio"
                  id="ongoing"
                  name="status"
                  value="On Going"
                  checked={form.status === 'On Going'}
                  onChange={handleChange}
                  className="ml-4 mr-2"
                />
                <label htmlFor="ongoing" className="text-sm text-gray-900">
                  On Going
                </label>
                <input
                  type="radio"
                  id="notdone"
                  name="status"
                  value="Not Done"
                  checked={form.status === 'Not Done'}
                  onChange={handleChange}
                  className="ml-4 mr-2"
                />
                <label htmlFor="notdone" className="text-sm text-gray-900">
                  Not Done
                </label>
              </div>
            </div>

            {role === 'mm' && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="staff" className="block text-sm font-medium text-gray-900">
                    Staff
                  </label>
                  <button
                    type="button"
                    className="font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black hover:bg-slate-300"
                    onClick={handleAddStaff}
                  >
                    Assign employee
                  </button>
                </div>

                {form.staffs.map((staff, index) => (
                  <div key={index} className="flex mb-2">
                    <select
                      value={staff}
                      onChange={(e) => handleStaffChange(index, e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md mr-2"
                    >
                      <option value="">Select Staff</option>
                      {employees
                        .filter(
                          (employee) =>
                            !selectedStaffs.includes(employee.id) || staff === employee.id
                        )
                        .map((employee, index) => (
                          <option key={index} value={employee.id}>
                            {employee.name} - {roles[employee.role]} - {employee.email}
                          </option>
                        ))}
                    </select>
                    {index === form.staffs.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStaff(index)}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

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

export default MaintenanceScheduleModal
