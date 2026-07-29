import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, role }) {
  const location = useLocation()
  const { user, admin, isLoading } = useAuth()
  const account = role === 'admin' ? admin : user

  if (isLoading) {
    return <div className="grid min-h-[50vh] place-items-center text-sm text-zinc-500">Checking session…</div>
  }

  if (!account || account.role !== role) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
