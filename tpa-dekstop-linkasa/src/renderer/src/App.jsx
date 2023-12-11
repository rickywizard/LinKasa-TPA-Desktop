import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import { AuthProvider } from '../../renderer/src/contexts/AuthContext'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
