import React, { useState } from 'react'
import logo from '../../../../resources/logo.png?asset'
import background from '../../../../resources/background.jpg?asset'
import FormField from '../components/FormField'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import PopUp from '../components/PopUp'

const Login = () => {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setForm({ ...form, [name]: value })
    // console.log(form.email, ' ', form.password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(form.email, ' + ', form.password)

    if (form.email.trim() === '' ||
        form.password.trim() === '') {
      setError('Field can not be empty')
      return
    }

    try {
      setError('')
      setLoading(true)
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (error) {
      setError('Invalid credentials')
    }

    setLoading(false)
  }

  return (
    <div className='flex flex-col justify-center content-center items-center h-screen bg-image'>
      <img src={background} alt="background" className='absolute top-0 left-0 w-full h-full object-cover bg-size-cover bg-repeat-no-repeat z-[-1]' />
      <div className='flex flex-col items-center justify-center bg-gray-100 py-7 rounded-md shadow-md w-96'>
        <div className="mb-1">
          <img
            alt="Logo"
            src={logo}
            className="h-24 w-50"
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 font-lato">
            LinKasa Airport
          </h2>
        </div>
        <form onSubmit={handleSubmit} className='mt-7 w-80'>
          <div className='mb-5'>
            <FormField
              labelName='Email'
              type='text'
              name='email'
              placeholder='Email'
              handleChange={handleChange}
            />
            <FormField
              labelName='Password'
              type='password'
              name='password'
              placeholder='Password'
              handleChange={handleChange}
            />
          </div>
          <button type='submit' className='bg-green-500 w-full py-2 rounded-md text-center font-semibold text-white hover:bg-green-600'>
            Login
          </button>
        </form>

        {error && (
          <PopUp
            message={error}
            onClose={() => setError('')}
            type='error'
          />
        )}
      </div>
    </div>
  )
}

export default Login
