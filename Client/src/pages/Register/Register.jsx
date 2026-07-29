import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '+91', password: '', otp: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { sendSignupOtp, verifySignupOtp, isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Enter all details and use a password of at least 6 characters.')
      return
    }
    try {
      setError('')
      setIsSubmitting(true)
      if (!otpSent) {
        const data = await sendSignupOtp({ ...form, name: form.name.trim(), email: form.email.trim(), role: 'user' })
        setNotice(data.message)
        setOtpSent(true)
      } else {
        if (!form.otp.trim()) throw new Error('Please enter the OTP.')
        await verifySignupOtp({ ...form, name: form.name.trim(), email: form.email.trim(), role: 'user' })
        navigate('/login', { state: { message: 'Registration complete. Log in with OTP.' } })
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
        <h1 className="text-3xl font-semibold text-zinc-900">Create account</h1>
        <p className="mt-2 text-sm text-zinc-500">Sign up to order food from restaurants near you.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {[
            { key: 'name', label: 'Full name', type: 'text', placeholder: 'Your full name' },
            { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
            { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '+919876543210' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Minimum 6 characters' },
          ].map((field) => (
            <label className="block" key={field.key}>
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">{field.label}</span>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#e23744] focus:ring-2 focus:ring-red-100"
              />
            </label>
          ))}
          {otpSent && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">SMS OTP</span>
              <input inputMode="numeric" value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value.replace(/\D/g, '') })} placeholder="Enter OTP" className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-center text-lg tracking-[0.35em] outline-none focus:border-[#e23744]" />
            </label>
          )}
          {notice && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}
          {error && <p className="text-sm text-[#e23744]" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-[#e23744] py-3 font-semibold text-white transition hover:bg-[#cf2734] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Please wait…' : otpSent ? 'Verify OTP & Create account' : 'Send registration OTP'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="font-medium text-[#e23744] hover:underline">Log in</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
