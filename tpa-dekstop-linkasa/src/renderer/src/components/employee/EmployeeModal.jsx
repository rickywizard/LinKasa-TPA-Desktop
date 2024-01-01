import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FormField from '../FormField'
import PopUp from '../PopUp'
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'

Modal.setAppElement('#root')

const EmployeeModal = ({ isOpen, closeModal, selectedEmployee, setSelectedEmployee }) => {
  const { signup, login } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    role: '',
    salary: '',
    kpi: ''
  })

  useEffect(() => {
    setForm({
      name: selectedEmployee ? selectedEmployee.name : '',
      email: selectedEmployee ? selectedEmployee.email : '',
      phone: selectedEmployee ? selectedEmployee.phone : '',
      birthdate: selectedEmployee ? selectedEmployee.birthdate : '',
      role: selectedEmployee ? selectedEmployee.role : '',
      salary: selectedEmployee ? selectedEmployee.salary : '',
      kpi: selectedEmployee ? selectedEmployee.kpi : ''
    })
  }, [selectedEmployee])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      name: '',
      email: '',
      phone: '',
      birthdate: '',
      role: '',
      salary: '',
      kpi: ''
    })
    setSelectedEmployee(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.name.trim() === '' ||
      form.email.trim() === '' ||
      form.phone.trim() === '' ||
      form.birthdate.trim() === '' ||
      form.role.trim() === '' ||
      form.salary.trim() === '' ||
      form.kpi === ''
    ) {
      setError('Field can not be empty')
      return
    }

    if (form.phone.trim().length < 12) {
      setError('Phone number must be at least 12 digits')
      return
    }

    if (form.salary.trim() === '0') {
      setError('Salary can not be zero')
      return
    }

    const password = `linkasa${form.birthdate.trim()}`

    try {
      setError('')

      if (selectedEmployee) {
        const employeeRef = doc(db, 'employees', selectedEmployee.id)
        await updateDoc(employeeRef, form)

        setSuccess('Successfully updated employee')
      } else {
        // to auth
        await signup(form.email, password)

        // to firestore
        await addDoc(collection(db, 'employees'), form)
        setSuccess('Successfully add new employee')

        // login back
        await login('hrd@linkasa.com', 'hrd123')
      }
    } catch (error) {
      setError('Failed to create employee')
    }

    handleCloseModal()
  }

  const checkEmailExists = async (email) => {
    const employeeQuery = query(collection(db, 'employees'), where('email', '==', email))
    const querySnapshot = await getDocs(employeeQuery)
    return querySnapshot.docs.length > 0
  }

  const generateEmail = async (name) => {
    const words = name.split(' ')

    const firstName = words[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, '')

    const lastName = words[words.length - 1].toLowerCase().replace(/[^a-zA-Z0-9]/g, '')

    let generatedEmail = `${firstName}.${lastName}@linkasa.com`

    let suffix = 1
    while (await checkEmailExists(generatedEmail)) {
      generatedEmail = `${firstName}.${lastName}${suffix}@linkasa.com`
      suffix++
    }

    return generatedEmail
  }

  const handleAuto = async () => {
    if (form.name.trim() !== '') {
      const generatedEmail = await generateEmail(form.name)

      setForm({ ...form, email: generatedEmail })
    } else {
      setError('Name must be filled before generate email')
    }
  }

  const checkRoleExists = async (role) => {
    const roleQuery = query(collection(db, 'employees'), where('role', '==', role))
    const querySnapshot = await getDocs(roleQuery)

    return querySnapshot.docs.length > 0
  }

  const handleRoleChange = async (e) => {
    const newRole = e.target.value

    const limitedRoles = [
      'csm',
      'aom',
      'fom',
      'ghm',
      'lom',
      'mm',
      'bssu',
      'cm',
      'lm',
      'fm',
      'cem',
      'ceo',
      'cfo',
      'coo',
      'cso'
    ]

    if (limitedRoles.includes(newRole)) {
      const roleExists = await checkRoleExists(newRole)

      if (roleExists) {
        setError('Role already exists. Please choose another role.')
        setForm({ ...form, role: '' })
      } else {
        setError('')
        setForm({ ...form, role: newRole })
      }
    } else {
      setError('')
      setForm({ ...form, role: newRole })
    }
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

          <h2 className="text-2xl mb-4 font-semibold">{selectedEmployee ? 'Update' : 'Add New'} Employee</h2>

          <form onSubmit={handleSubmit}>
            <FormField
              labelName="Name"
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              handleChange={handleChange}
            />
            <FormField
              labelName="Email"
              type="text"
              name="email"
              placeholder="john.doe@linkasa.com"
              value={form.email}
              handleChange={handleChange}
              isDisabled={true}
              isAuto={true}
              handleAuto={handleAuto}
            />
            <FormField
              labelName="Phone Number"
              type="text"
              name="phone"
              placeholder="0812 3456 7890"
              value={form.phone}
              handleChange={handleChange}
            />
            <FormField
              labelName="Birthdate"
              type="date"
              name="birthdate"
              value={form.birthdate}
              handleChange={handleChange}
            />

            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleRoleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select role</option>
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

            <FormField
              labelName="Salary"
              type="number"
              name="salary"
              value={form.salary}
              placeholder="5000000"
              handleChange={handleChange}
            />

            <FormField
              labelName="Key Performance Indicator"
              type="number"
              name="kpi"
              value={form.kpi}
              placeholder="6.0"
              handleChange={handleChange}
            />

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

export default EmployeeModal
