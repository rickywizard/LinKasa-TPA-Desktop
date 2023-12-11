import React from 'react'

const FormField = ({ labelName, type, name, placeholder, value, handleChange, isRequired, isDisabled, isAuto, handleAuto }) => {
  return (
    <div className='mt-2'>
      <div className='flex items-center gap-2 mb-2'>
        <label
          htmlFor={name}
          className='block text-sm font-medium text-gray-900'
        >
          {labelName}
        </label>

        {isAuto && (
          <button
            type='button'
            className='font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black hover:bg-slate-300'
            onClick={handleAuto}>
            Generate email
          </button>
        )}
      </div>

      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={isRequired}
        disabled={isDisabled}
        className='bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-[#46ff62cd] focus:border-[#46ff62cd] outline-none block w-full p-3'
      />
    </div>
  )
}

export default FormField
