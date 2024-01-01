import React, { useEffect, useState } from 'react'
import MaintenanceScheduleItem from '../../components/maintenance/MaintenanceScheduleItem'
import PopUp from '../../components/PopUp'
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import MaintenanceScheduleModal from '../../components/maintenance/MaintenanceScheduleModal'

const MaintenanceSchedulePage = ({ role }) => {
  const [schedules, setSchedules] = useState([])
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [employees, setEmployees] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'maintenanceschedules'), (snapshot) => {
      const schedulesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setSchedules(schedulesData)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffQuery = query(collection(db, 'employees'), where('role', '==', 'ms'))
        const staffSnapshot = await getDocs(staffQuery)

        const staffs = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setEmployees(staffs)
      } catch (error) {
        console.log('Failed to fetch staff: ', error)
      }
    }

    fetchStaff()
  }, [])

  const handleDelete = async (scheduleId) => {
    try {
      const scheduleRef = doc(db, 'maintenanceschedules', scheduleId)
      await deleteDoc(scheduleRef)

      setSuccess('Successfully delete maintenance schedule')
    } catch (error) {
      setError('Error deleting maintenance schedule')
    }
  }

  const openUpdateModal = (schedule) => {
    setSelectedMaintenance(schedule)
    setOpenModal(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-600">Maintenance Schedule</h2>

        <button
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none"
          onClick={() => setOpenModal(true)}
        >
          Add
        </button>
      </div>
      {schedules.map((schedule, index) => (
        <MaintenanceScheduleItem key={index} schedule={schedule} employees={employees} handleDelete={handleDelete} openUpdateModal={openUpdateModal} />
      ))}

      <MaintenanceScheduleModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedMaintenance={selectedMaintenance}
        setSelectedMaintenance={setSelectedMaintenance}
        employees={employees}
        role={role}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default MaintenanceSchedulePage
