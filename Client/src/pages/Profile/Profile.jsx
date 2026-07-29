import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

function Profile() {
  const { user, refreshAccount } = useAuth()
  const [phone, setPhone] = useState('+91')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const sendOtp = async () => {
    try {
      setError('')
      const data = await apiRequest('/auth/phone-change/send-otp', { method: 'POST', body: JSON.stringify({ phone }) })
      setMessage(data.message)
      setOtpSent(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const confirmChange = async () => {
    try {
      setError('')
      const data = await apiRequest('/auth/phone-change/confirm', { method: 'POST', body: JSON.stringify({ phone, otp }) })
      await refreshAccount('user')
      setMessage(data.message)
      setOtpSent(false)
      setOtp('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Your profile</h1>
      <section className="mt-7 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <p className="font-semibold">{user?.name}</p><p className="text-sm text-zinc-500">{user?.email}</p><p className="mt-1 text-sm text-zinc-500">Current phone: {user?.phone}</p>
        <h2 className="mt-7 text-lg font-semibold">Change phone number</h2>
        <div className="mt-4 space-y-3"><input value={phone} onChange={(event) => setPhone(event.target.value)} className="admin-input" placeholder="+919876543210" />{otpSent && <input inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} className="admin-input" placeholder="Enter OTP sent to new phone" />}<button onClick={otpSent ? confirmChange : sendOtp} className="rounded-lg bg-[#e23744] px-5 py-3 font-semibold text-white">{otpSent ? 'Verify & Change Phone' : 'Send OTP'}</button></div>
        {message && <p className="mt-4 text-sm text-green-700">{message}</p>}{error && <p className="mt-4 text-sm text-[#e23744]">{error}</p>}
      </section>
    </main>
  )
}

export default Profile
