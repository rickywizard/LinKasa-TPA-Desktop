import React from 'react'

const NavigationBar = ({ role, selectedMenu }) => {
  const handleMenuClick = (menu) => {
    selectedMenu(menu)
  }

  return (
    <aside className="bg-gray-800 w-52 text-white flex flex-col justify-center items-center overflow-y-auto">
      <nav className="w-full">
        <ul>
          {role === 'hrd' && (
            <>
              <li>
                <button
                  onClick={() => handleMenuClick('employees')}
                  className="block p-3 hover:bg-gray-700 w-full text-left"
                >
                  Employees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('trainingschedule')}
                  className="block p-3 hover:bg-gray-700 w-full text-left"
                >
                  Training schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('jobvacancies')}
                  className="block p-3 hover:bg-gray-700 w-full text-left"
                >
                  Job Vacancies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('applicants')}
                  className="block p-3 hover:bg-gray-700 w-full text-left"
                >
                  Applicants
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('interviews')}
                  className="block p-3 hover:bg-gray-700 w-full text-left"
                >
                  Interview Schedules
                </button>
              </li>
            </>
          )}

          {(role === 'fom' ||
            role === 'ids' ||
            role === 'cis' ||
            role === 'ga' ||
            role === 'aom' ||
            role === 'coo') && (
            <>
              <li>
                <button
                  onClick={() => handleMenuClick('flightschedule')}
                  className="block p-3 hover:bg-gray-700 w-full text-left"
                >
                  Flight Schedule
                </button>
              </li>
              {role === 'fom' && (
                <li>
                  <button
                    onClick={() => handleMenuClick('flightcrew')}
                    className="block p-3 hover:bg-gray-700 w-full text-left"
                  >
                    Flight Crew
                  </button>
                </li>
              )}
            </>
          )}

          {(role === 'coo' || role === 'mm') && (
            <li>
              <button
                onClick={() => handleMenuClick('maintenanceschedule')}
                className="block p-3 hover:bg-gray-700 w-full text-left"
              >
                Maintenance Schedule
              </button>
            </li>
          )}

          {role === 'lfs' && (
            <li>
              <button
                onClick={() => handleMenuClick('lostlog')}
                className="block p-3 hover:bg-gray-700 w-full text-left"
              >
                Lost and Found
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  )
}

export default NavigationBar
