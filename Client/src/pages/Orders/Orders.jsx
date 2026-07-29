import { useCallback, useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { apiRequest } from '../../services/api'

const steps = ['confirmed', 'preparing', 'out-for-delivery', 'delivered']

function Orders() {
  const [orders, setOrders] = useState([])
  const load = useCallback(async () => {
    const data = await apiRequest('/orders/mine')
    setOrders(data.orders)
  }, [])

  useEffect(() => {
    load()
  }, [load])
  const cancel = async (id) => { await apiRequest(`/orders/${id}/cancel`, { method: 'PATCH' }); load() }
  return <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6"><h1 className="text-3xl font-semibold">My Orders</h1><div className="mt-7 space-y-5">{orders.length === 0 ? <div className="rounded-2xl border border-dashed py-16 text-center"><Package className="mx-auto text-zinc-300" /><p className="mt-3">No orders yet</p></div> : orders.map((order) => <article key={order._id} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"><div className="flex justify-between"><div><p className="font-semibold">Order #{order._id.slice(-8)}</p><p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p></div><p className="font-semibold">₹{order.total}</p></div><div className="mt-5 flex">{steps.map((step, index) => { const active = steps.indexOf(order.status) >= index; return <div key={step} className="flex flex-1 items-center"><span className={`size-3 rounded-full ${active ? 'bg-green-500' : 'bg-zinc-300'}`} /><span className={`h-1 flex-1 ${active ? 'bg-green-500' : 'bg-zinc-200'}`} /></div> })}</div><div className="mt-2 flex justify-between text-[10px] capitalize text-zinc-500">{steps.map((step) => <span key={step}>{step.replaceAll('-', ' ')}</span>)}</div><div className="mt-4 text-sm">{order.items.map((item) => <p key={item.itemId}>{item.quantity}× {item.name}</p>)}</div>{['confirmed', 'preparing'].includes(order.status) && <button onClick={() => cancel(order._id)} className="mt-4 text-sm font-medium text-[#e23744]">Cancel order</button>}</article>)}</div></main>
}
export default Orders
