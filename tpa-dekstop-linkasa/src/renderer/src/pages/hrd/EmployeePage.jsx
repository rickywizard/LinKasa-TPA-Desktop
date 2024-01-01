import React, { useEffect, useState } from 'react'
import plusIcon from '../../assets/plus-solid.svg'
import EmployeeModal from '../../components/employee/EmployeeModal'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import { roles } from '../../constant/roles'
import { TrashIcon, PencilAltIcon } from '@heroicons/react/solid'
import PopUp from '../../components/PopUp'

const EmployeePage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const deleteEmployee = async (employeeId) => {
    try {
      const employeeRef = doc(db, 'employees', employeeId)

      await deleteDoc(employeeRef)

      setSuccess('Delete success')
    } catch (error) {
      setError('Delete failed')
    }
  }

  const openUpdateModal = (employee) => {
    setSelectedEmployee(employee)
    setOpenModal(true)
  }

  return (
    <>
      <h2 className="font-bold text-lg text-gray-600 mb-4">Employee List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee, index) => (
          <div
            className="bg-white rounded-lg shadow-xl mx-2 hover:cursor-pointer hover:-translate-y-1.5 transition-transform"
            key={index}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{employee.name}</h2>
                <div className="flex space-x-2">
                  {/* update */}
                  <button
                    className="text-green-500 hover:text-green-700 focus:outline-none"
                    onClick={() => openUpdateModal(employee)}
                  >
                    <PencilAltIcon className="w-5 h-5" />
                  </button>
                  {/* delete */}
                  <button
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{employee.email}</p>
              <p className="text-gray-600 mb-2">{roles[employee.role]}</p>
              <p className="text-gray-600 mb-2">{employee.birthdate.toString()}</p>
              <p className="text-gray-600 mb-2">{employee.phone}</p>
              <p className="text-gray-600 mb-2">KPI: {employee.kpi}</p>
              <p className="text-gray-600">Salary: Rp{employee.salary}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setOpenModal(true)}>
        <div className="fixed bottom-7 right-7 bg-green-400 text-white p-5 rounded-full cursor-pointer text-center hover:bg-green-600">
          <img src={plusIcon} alt="" width="20" height="20" />
        </div>
      </button>

      <EmployeeModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default EmployeePage
