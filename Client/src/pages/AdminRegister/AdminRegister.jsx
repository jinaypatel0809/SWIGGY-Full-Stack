import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminRegister() {
  const [form, setForm] = useState({ name: '', email: '', phone: '+91', password: '', otp: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { sendSignupOtp, verifySignupOtp } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Complete all fields and use at least 6 password characters.')
      return
    }
    try {
      setError('')
      setIsSubmitting(true)
      if (!otpSent) {
        const data = await sendSignupOtp({ ...form, name: form.name.trim(), email: form.email.trim(), role: 'admin' })
        setNotice(data.message)
        setOtpSent(true)
      } else {
        if (!form.otp.trim()) throw new Error('Please enter the OTP.')
        await verifySignupOtp({ ...form, name: form.name.trim(), email: form.email.trim(), role: 'admin' })
        navigate('/admin/login')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold">Admin sign up</h1>
        <p className="mt-2 text-sm text-zinc-500">Create an account for restaurant management.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Admin email', 'email'],
            ['phone', 'Phone number (+919876543210)', 'tel'],
            ['password', 'Password', 'password'],
          ].map(([key, placeholder, type]) => (
            <input key={key} type={type} placeholder={placeholder} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-[#e23744] dark:border-zinc-700" />
          ))}
          {otpSent && <input inputMode="numeric" placeholder="Enter SMS OTP" value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value.replace(/\D/g, '') })} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 text-center text-lg tracking-[0.35em] outline-none focus:border-[#e23744] dark:border-zinc-700" />}
          {notice && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">{notice}</p>}
          {error && <p className="text-sm text-[#e23744]">{error}</p>}
          <button disabled={isSubmitting} className="w-full rounded-lg bg-[#e23744] py-3 font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Please wait…' : otpSent ? 'Verify OTP & Create admin' : 'Send admin registration OTP'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">Already registered? <Link to="/admin/login" className="font-medium text-[#e23744]">Admin sign in</Link></p>
      </section>
    </main>
  )
}

export default AdminRegister
