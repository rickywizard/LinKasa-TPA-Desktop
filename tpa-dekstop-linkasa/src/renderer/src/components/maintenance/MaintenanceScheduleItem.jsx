import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import React, { useEffect, useRef, useState } from 'react'
import { roles } from '../../constant/roles'

const MaintenanceScheduleItem = ({ schedule, handleDelete, employees, openUpdateModal }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState('0px')
  const contentRef = useRef(null)

  useEffect(() => {
    setMaxHeight(isAccordionOpen ? `${contentRef.current.scrollHeight}px` : '0px')
  }, [isAccordionOpen])

  const toggleAccordion = () => {
    setAccordionOpen(!isAccordionOpen)
  }

  return (
    <div className="border mb-4 p-4 rounded overflow-hidden transition-max-height duration-300 ease-in-out">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold mb-1">{schedule.facility}</h3>
          <p className="text-gray-600 mb-1">
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric'
            }).format(schedule.datetime.toDate())}
          </p>
          <p className="text-gray-600 mb-1">
            Status:{' '}
            <span
              className={`${
                schedule.status === 'Done'
                  ? 'text-green-500'
                  : schedule.status === 'On Going'
                  ? 'text-orange-500'
                  : 'text-red-500'
              } font-bold`}
            >
              {schedule.status}
            </span>
          </p>
        </div>
        <button
          onClick={toggleAccordion}
          className="text-gray-500 hover:underline focus:outline-none"
        >
          {isAccordionOpen ? 'Hide Staff' : 'Show Staff'}
        </button>
        <div className="flex items-center">
          <button
            onClick={() => openUpdateModal(schedule)}
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
          >
            <PencilAltIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(schedule.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: `${maxHeight}` }}
        className={`transition-opacity duration-300 ease-in-out ${
          isAccordionOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h4 className="text-md font-semibold">Staff on Duty:</h4>
        <ul>
          {employees.map((staff, index) => (
            <li key={index}>{staff.name} - {roles[staff.role]} - {staff.email}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MaintenanceScheduleItem
