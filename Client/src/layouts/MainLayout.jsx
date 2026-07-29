import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default MainLayout
