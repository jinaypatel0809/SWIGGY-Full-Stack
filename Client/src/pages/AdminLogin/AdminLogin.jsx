import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '', otp: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { sendLoginOtp, verifyLoginOtp } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter admin email and password.')
      return
    }
    try {
      setError('')
      setIsSubmitting(true)
      if (!otpSent) {
        const data = await sendLoginOtp({ email: form.email.trim(), password: form.password, role: 'admin' })
        setNotice(data.message)
        setOtpSent(true)
      } else {
        if (!form.otp.trim()) throw new Error('Please enter the OTP.')
        await verifyLoginOtp({ email: form.email.trim(), password: form.password, otp: form.otp, role: 'admin' })
        navigate('/admin/dashboard')
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
        <span className="grid size-12 place-items-center rounded-xl bg-red-50 text-[#e23744] dark:bg-red-950/40"><LayoutDashboard /></span>
        <h1 className="mt-5 text-3xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-zinc-500">Manage restaurants, menus and orders.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <input type="email" placeholder="Admin email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-[#e23744] dark:border-zinc-700" />
          <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-[#e23744] dark:border-zinc-700" />
          {!otpSent && <Link to="/forgot-password/admin" className="block text-right text-sm text-[#e23744]">Forgot password?</Link>}
          {otpSent && <input inputMode="numeric" placeholder="Enter SMS OTP" value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value.replace(/\D/g, '') })} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 text-center text-lg tracking-[0.35em] outline-none focus:border-[#e23744] dark:border-zinc-700" />}
          {notice && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">{notice}</p>}
          {error && <p className="text-sm text-[#e23744]">{error}</p>}
          <button disabled={isSubmitting} className="w-full rounded-lg bg-[#e23744] py-3 font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Please wait…' : otpSent ? 'Verify OTP & Sign in' : 'Send admin login OTP'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">New admin? <Link to="/admin/sign-up" className="font-medium text-[#e23744]">Create admin account</Link></p>
      </section>
    </main>
  )
}

export default AdminLogin
