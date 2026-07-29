import { useCallback, useEffect, useState } from 'react'
import { Banknote, CreditCard, MapPin, Plus } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLocationSelection } from '../../context/LocationContext'
import { apiRequest } from '../../services/api'

const emptyAddress = { label: 'Home', recipientName: '', phone: '+91', line1: '', line2: '', city: '', pincode: '', isDefault: true }

function Checkout() {
  const { items, clearCart } = useCart()
  const { location } = useLocationSelection()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [form, setForm] = useState(emptyAddress)
  const [showForm, setShowForm] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [onlinePaymentLoading, setOnlinePaymentLoading] = useState(false)

  const loadAddresses = useCallback(async () => {
    try {
      const data = await apiRequest('/addresses')
      setAddresses(data.addresses)
      setSelectedAddress((currentAddress) =>
        currentAddress || data.addresses.find((item) => item.isDefault)?._id || data.addresses[0]?._id || '',
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])
  if (!items.length) return <Navigate to="/cart" replace />

  const saveAddress = async (event) => {
    event.preventDefault()
    try { await apiRequest('/addresses', { method: 'POST', body: JSON.stringify(form) }); setShowForm(false); setForm(emptyAddress); loadAddresses() } catch (requestError) { setError(requestError.message) }
  }
  const sendCodOtp = async () => {
    if (!selectedAddress) return setError('Select a delivery address.')
    try { const data = await apiRequest('/orders/cod/send-otp', { method: 'POST' }); setMessage(data.message); setOtpSent(true) } catch (requestError) { setError(requestError.message) }
  }
  const confirmOrder = async () => {
    try {
      const data = await apiRequest('/orders/cod/confirm', { method: 'POST', body: JSON.stringify({ items, location, addressId: selectedAddress, otp }) })
      clearCart()
      navigate(`/order-confirmed/${data.order._id}`, { state: { order: data.order } })
    } catch (requestError) { setError(requestError.message) }
  }

  const startOnlinePayment = async () => {
    if (!selectedAddress) return setError('Select a delivery address.')
    setError('')
    setMessage('')
    setOnlinePaymentLoading(true)

    try {
      if (!window.Razorpay) {
        const loaded = await new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
        if (!loaded) throw new Error('Unable to load Razorpay Checkout. Check your internet connection.')
      }

      const paymentOrder = await apiRequest('/orders/online/create', {
        method: 'POST',
        body: JSON.stringify({ items, location, addressId: selectedAddress }),
      })
      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Zomato Clone',
        description: 'Food order payment',
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: paymentOrder.customer?.name || '',
          email: paymentOrder.customer?.email || '',
          contact: paymentOrder.customer?.phone || '',
        },
        theme: { color: '#e23744' },
        handler: async (response) => {
          try {
            const verified = await apiRequest('/orders/online/verify', {
              method: 'POST',
              body: JSON.stringify({
                internalOrderId: paymentOrder.internalOrderId,
                ...response,
              }),
            })
            clearCart()
            navigate(`/order-confirmed/${verified.order._id}`, { state: { order: verified.order } })
          } catch (requestError) {
            setError(requestError.message)
            setOnlinePaymentLoading(false)
          }
        },
        modal: { ondismiss: () => setOnlinePaymentLoading(false) },
      })
      checkout.on('payment.failed', (response) => {
        setError(response.error?.description || 'Online payment failed. Please try again.')
        setOnlinePaymentLoading(false)
      })
      checkout.open()
    } catch (requestError) {
      setError(requestError.message)
      setOnlinePaymentLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6"><h1 className="text-3xl font-semibold">Checkout</h1>
      <section className="mt-7 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"><div className="flex justify-between"><h2 className="text-xl font-semibold">Delivery address</h2><button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-sm text-[#e23744]"><Plus className="size-4" /> Add address</button></div>
        {showForm && <form onSubmit={saveAddress} className="mt-5 grid gap-3 sm:grid-cols-2">{Object.entries(form).filter(([key]) => key !== 'isDefault').map(([key, value]) => key === 'label' ? <select key={key} value={value} onChange={(e) => setForm({ ...form, label: e.target.value })} className="admin-input"><option>Home</option><option>Work</option><option>Other</option></select> : <input key={key} required={!['line2'].includes(key)} value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="admin-input" placeholder={key.replace(/([A-Z])/g, ' $1')} />)}<button className="rounded-lg bg-zinc-900 py-3 text-white dark:bg-white dark:text-zinc-900">Save address</button></form>}
        <div className="mt-5 grid gap-3">{addresses.map((address) => <label key={address._id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${selectedAddress === address._id ? 'border-[#e23744] bg-red-50 dark:bg-red-950/20' : 'border-zinc-200 dark:border-zinc-700'}`}><input type="radio" checked={selectedAddress === address._id} onChange={() => setSelectedAddress(address._id)} /><MapPin className="size-5 text-[#e23744]" /><span><b>{address.label}</b> — {address.recipientName}<br /><span className="text-sm text-zinc-500">{address.line1}, {address.city} - {address.pincode}</span></span></label>)}</div>
      </section>
      <section className="mt-6 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"><h2 className="text-xl font-semibold">Payment</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><button onClick={startOnlinePayment} disabled={onlinePaymentLoading} className="flex justify-center gap-2 rounded-xl border py-4 disabled:cursor-not-allowed disabled:opacity-60"><CreditCard /> {onlinePaymentLoading ? 'Opening Razorpay...' : 'Online Payment'}</button><button onClick={sendCodOtp} disabled={onlinePaymentLoading} className="flex justify-center gap-2 rounded-xl bg-[#e23744] py-4 font-semibold text-white disabled:opacity-60"><Banknote /> Cash on Delivery</button></div>{otpSent && <div className="mt-4 flex gap-3"><input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="admin-input" placeholder="COD OTP" /><button onClick={confirmOrder} className="shrink-0 rounded-lg bg-green-600 px-5 font-semibold text-white">Confirm order</button></div>}{message && <p className="mt-3 text-sm text-green-700">{message}</p>}{error && <p className="mt-3 text-sm text-[#e23744]">{error}</p>}</section>
    </main>
  )
}
export default Checkout
