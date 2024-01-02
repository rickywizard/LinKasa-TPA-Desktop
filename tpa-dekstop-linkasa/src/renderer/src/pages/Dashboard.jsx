import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import NavigationBar from '../components/NavigationBar'
import TopBar from '../components/TopBar'
import { useNavigate } from 'react-router-dom'
import EmployeePage from './hrd/EmployeePage'
import PopUp from '../components/PopUp'
import FlightSchedulePage from './fom/FlightSchedulePage'
import EmployeeTrainingPage from './hrd/EmployeeTrainingPage'
import FlightCrewPage from './fom/FlightCrewPage'
import MaintenanceSchedulePage from './maintenance/MaintenanceSchedulePage'
import LostFoundPage from './lostfound/LostFoundPage'
import JobVacancyPage from './hrd/JobVacancyPage'
import ApplicantsPage from './hrd/ApplicantsPage'
import InterviewsPage from './hrd/InterviewsPage'

const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState('')
  const [userData, setUserData] = useState([])
  const [selectedMenu, setSelectedMenu] = useState('')
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
      <TopBar handleSignOut={handleSignOut} />
      <div className="flex h-screen overflow-y-hidden">
        <NavigationBar role={userData.role} selectedMenu={handleSelectedMenu} />

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-2">Hello, {userData.name}</h1>

          {/* HRD */}
          {selectedMenu === 'employees' && <EmployeePage />}
          {selectedMenu === 'trainingschedule' && <EmployeeTrainingPage />}
          {selectedMenu === 'jobvacancies' && <JobVacancyPage />}
          {selectedMenu === 'applicants' && <ApplicantsPage />}
          {selectedMenu === 'interviews' && <InterviewsPage />}

          {/* FLIGHT OPERATIONS MANAGER */}
          {selectedMenu === 'flightschedule' && <FlightSchedulePage role={userData.role} />}
          {selectedMenu === 'flightcrew' && <FlightCrewPage/>}

          {/* COO & Maintenance Manager */}
          {selectedMenu === 'maintenanceschedule' && <MaintenanceSchedulePage role={userData.role} />}

          {selectedMenu === 'lostlog' && <LostFoundPage />}
        </div>
      </div>

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}
    </>
  )
}

export default Dashboard
