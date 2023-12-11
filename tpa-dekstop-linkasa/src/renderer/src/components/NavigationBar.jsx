import React from 'react'

const NavigationBar = ({ role, selectedMenu }) => {
  const handleMenuClick = (menu) => {
    selectedMenu(menu)
  }

  return (
    <aside className='bg-gray-800 h-screen w-52 text-white flex flex-col justify-center items-center'>
      <nav className='w-full'>
        <ul>
          {role === 'hrd' && (
            <>
              <li>
                <button
                  onClick={() => handleMenuClick('employees')}
                  className='block p-3 hover:bg-gray-700 w-full text-left'>
                  Employees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('jobvacancies')}
                  className='block p-3 hover:bg-gray-700 w-full text-left'>
                    Job vacancies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('trainingschedule')}
                  className='block p-3 hover:bg-gray-700 w-full text-left'>
                    Training schedule
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  )
}

export default NavigationBar
