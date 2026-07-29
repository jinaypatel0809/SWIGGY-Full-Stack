import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [form, setForm] = useState({ email: '', password: '', otp: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { sendLoginOtp, verifyLoginOtp, isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    try {
      setError('')
      setIsSubmitting(true)
      if (!otpSent) {
        const data = await sendLoginOtp({ email: form.email.trim(), password: form.password, role: 'user' })
        setNotice(data.message)
        setOtpSent(true)
      } else {
        if (!form.otp.trim()) throw new Error('Please enter the OTP.')
        await verifyLoginOtp({ email: form.email.trim(), password: form.password, otp: form.otp, role: 'user' })
        navigate('/')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8">
        <h1 className="text-3xl font-semibold text-zinc-900">Log in</h1>
        <p className="mt-2 text-sm text-zinc-500">Welcome back! Enter your details to continue.</p>
        {location.state?.message && <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">{location.state.message}</p>}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email address</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#e23744] focus:ring-2 focus:ring-red-100"
            />
          </label>
          {!otpSent && <Link to="/forgot-password/user" className="block text-right text-sm text-[#e23744]">Forgot password?</Link>}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#e23744] focus:ring-2 focus:ring-red-100"
            />
          </label>
          {otpSent && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">SMS OTP</span>
              <input
                inputMode="numeric"
                maxLength="10"
                value={form.otp}
                onChange={(event) => setForm({ ...form, otp: event.target.value.replace(/\D/g, '') })}
                placeholder="Enter OTP"
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-center text-lg tracking-[0.35em] outline-none focus:border-[#e23744]"
              />
            </label>
          )}
          {notice && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}
          {error && <p className="text-sm text-[#e23744]" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-[#e23744] py-3 font-semibold text-white transition hover:bg-[#cf2734] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Please wait…' : otpSent ? 'Verify OTP & Log in' : 'Send login OTP'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          New to Zomato? <Link to="/sign-up" className="font-medium text-[#e23744] hover:underline">Create account</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
