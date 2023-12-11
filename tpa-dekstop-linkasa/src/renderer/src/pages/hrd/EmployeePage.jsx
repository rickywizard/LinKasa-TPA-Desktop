import React, { useState } from 'react'
import plusIcon from '../../assets/plus-solid.svg'
import EmployeeModal from '../../components/Employee/EmployeeModal'

const EmployeePage = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <div>
        <h2>Employee List</h2>
      </div>

      <button onClick={() => setOpenModal(true)}>
        <div className="fixed bottom-7 right-7 bg-green-400 text-white p-5 rounded-full cursor-pointer text-center hover:bg-green-600">
          <img src={plusIcon} alt="" width="20" height="20" />
        </div>
      </button>

      <EmployeeModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </>
  )
}

export default EmployeePage
