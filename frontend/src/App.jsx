import { Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Exam from './pages/Exam'
import AIChat from './pages/AIChat'
import Universities from './pages/Universities'
import Profile from './pages/Profile'
import Topics from './pages/Topics'

function Protected({ children }) {
  const token = useStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="topics"       element={<Topics />} />
        <Route path="exam"         element={<Exam />} />
        <Route path="ai"           element={<AIChat />} />
        <Route path="universities" element={<Universities />} />
        <Route path="profile"      element={<Profile />} />
      </Route>
    </Routes>
  )
}