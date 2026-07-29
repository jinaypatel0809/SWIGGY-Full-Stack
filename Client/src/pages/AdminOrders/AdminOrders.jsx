import { useEffect, useState } from 'react'
import { ArrowLeft, PackageCheck, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadOrders = async () => {
    try {
      const data = await apiRequest('/orders/admin', { authRole: 'admin' })
      setOrders(data.orders)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), authRole: 'admin' })
      setMessage('Order status updated.')
      loadOrders()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const confirmDelivery = async (order) => {
    try {
      const sent = await apiRequest(`/orders/${order._id}/delivery/send-otp`, { method: 'POST', authRole: 'admin' })
      const otp = window.prompt(`${sent.message}. Ask customer for the delivery OTP:`)
      if (!otp) return
      const data = await apiRequest(`/orders/${order._id}/delivery/confirm`, { method: 'POST', body: JSON.stringify({ otp }), authRole: 'admin' })
      setMessage(data.message)
      loadOrders()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-[1100px] px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><Link to="/admin/dashboard" className="flex items-center gap-1 text-sm text-[#e23744]"><ArrowLeft className="size-4" /> Dashboard</Link><h1 className="mt-2 text-3xl font-semibold">Orders &amp; Delivery</h1></div>
        <button onClick={loadOrders} className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700"><RefreshCw className="size-4" /> Refresh</button>
      </div>
      {message && <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-7 space-y-4">
        {orders.length === 0 ? <p className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500 dark:border-zinc-700">No orders yet</p> : orders.map((order) => (
          <article key={order._id} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex flex-wrap justify-between gap-4"><div><p className="font-semibold">{order.user?.name}</p><p className="text-sm text-zinc-500">{order.user?.email} · {order.user?.phone}</p><p className="mt-1 text-xs text-zinc-400">#{order._id}</p></div><div className="text-right"><p className="text-lg font-semibold">₹{order.total}</p><p className="text-sm capitalize text-[#e23744]">{order.status.replaceAll('-', ' ')}</p></div></div>
            <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">{order.items.map((item) => <p key={item.itemId} className="text-sm text-zinc-600 dark:text-zinc-300">{item.quantity}× {item.name}</p>)}</div>
            {order.status !== 'delivered' && order.status !== 'cancelled' && <div className="mt-5 flex flex-wrap gap-2"><select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option><option value="out-for-delivery">Out for delivery</option><option value="cancelled">Cancelled</option></select>{order.status === 'out-for-delivery' && <button onClick={() => confirmDelivery(order)} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"><PackageCheck className="size-4" /> Confirm delivery OTP</button>}</div>}
          </article>
        ))}
      </div>
    </main>
  )
}

export default AdminOrders
