import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import NavigationBar from '../components/NavigationBar'
import TopBar from '../components/TopBar'
import { useNavigate } from 'react-router-dom'
import EmployeePage from './hrd/EmployeePage'

const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState('')
  const [userData, setUserData] = useState([])
  const [selectedMenu, setSelectedMenu] = useState('employees')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const userQuery = query(collection(db, 'employees'), where('email', '==', currentUser.email))
      const querySnapshot = await getDocs(userQuery)

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data()
        setUserData(data)
      }
    }

    fetchUser()
  }, [currentUser.email])

  const handleSelectedMenu = (menu) => {
    setSelectedMenu(menu)
  }

  const handleSignOut = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      setError('Failed to log out')
    }
  }

  return (
    <>
      <TopBar handleSignOut={handleSignOut}/>
      <div className='flex'>
        <NavigationBar role={userData.role} selectedMenu={handleSelectedMenu} />

        <div className='flex-1 p-4'>
          <h1 className='text-2xl font-bold mb-2'>Hello, {userData.name}</h1>

          {selectedMenu === 'employees' && (
            <EmployeePage />
          )}

          {selectedMenu === 'jobvacancies' && (
            <div>
              <h2>Job Vacancies</h2>
            </div>
          )}

          {selectedMenu === 'trainingschedule' && (
            <div>
            <h2>Training Schedule</h2>
          </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
