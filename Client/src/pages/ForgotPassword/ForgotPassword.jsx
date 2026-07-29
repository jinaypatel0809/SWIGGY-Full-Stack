import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { apiRequest } from '../../services/api'

function ForgotPassword() {
  const { role } = useParams()
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' })
  const [otpSent, setOtpSent] = useState(false)
  const [complete, setComplete] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!['user', 'admin'].includes(role)) return <Navigate to="/login" replace />

  const sendOtp = async () => {
    try {
      setError('')
      const data = await apiRequest(`/auth/${role}/forgot-password/send-otp`, {
        method: 'POST',
        body: JSON.stringify({ email: form.email }),
        authRole: role,
      })
      setMessage(data.message)
      setOtpSent(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const resetPassword = async () => {
    try {
      setError('')
      const data = await apiRequest(`/auth/${role}/forgot-password/reset`, {
        method: 'POST',
        body: JSON.stringify(form),
        authRole: role,
      })
      setMessage(data.message)
      setComplete(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-sm text-zinc-500">Reset your {role} account password using phone OTP.</p>
        {complete ? (
          <div className="mt-7"><p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{message}</p><Link to={role === 'admin' ? '/admin/login' : '/login'} className="mt-5 block rounded-lg bg-[#e23744] py-3 text-center font-semibold text-white">Back to login</Link></div>
        ) : (
          <div className="mt-7 space-y-4">
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Registered email" className="admin-input" />
            {otpSent && <><input inputMode="numeric" value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value.replace(/\D/g, '') })} placeholder="SMS OTP" className="admin-input" /><input type="password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} placeholder="New password" className="admin-input" /></>}
            {message && <p className="text-sm text-green-700">{message}</p>}
            {error && <p className="text-sm text-[#e23744]">{error}</p>}
            <button onClick={otpSent ? resetPassword : sendOtp} className="w-full rounded-lg bg-[#e23744] py-3 font-semibold text-white">{otpSent ? 'Verify OTP & Reset' : 'Send reset OTP'}</button>
          </div>
        )}
      </section>
    </main>
  )
}

export default ForgotPassword
