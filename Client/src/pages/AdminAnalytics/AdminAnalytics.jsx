import { useEffect, useState } from 'react'
import { BarChart3, IndianRupee, ShoppingBag, Store, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api'

function AdminAnalytics() {
  const [data, setData] = useState({ orders: 0, revenue: 0, users: 0, restaurants: 0, status: [] })
  useEffect(() => { apiRequest('/orders/admin/analytics', { authRole: 'admin' }).then(setData) }, [])
  const cards = [['Orders', data.orders, ShoppingBag], ['Revenue', `₹${data.revenue}`, IndianRupee], ['Users', data.users, Users], ['Restaurants', data.restaurants, Store]]
  const max = Math.max(1, ...data.status.map((item) => item.count))
  return <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6"><Link to="/admin/dashboard" className="text-sm text-[#e23744]">← Dashboard</Link><div className="mt-3 flex items-center gap-3"><BarChart3 className="text-[#e23744]" /><h1 className="text-3xl font-semibold">Admin Analytics</h1></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border p-5 dark:border-zinc-800"><Icon className="text-[#e23744]" /><p className="mt-4 text-3xl font-semibold">{value}</p><p className="text-sm text-zinc-500">{label}</p></article>)}</div><section className="mt-8 rounded-2xl border p-6 dark:border-zinc-800"><h2 className="text-xl font-semibold">Orders by status</h2><div className="mt-6 space-y-4">{data.status.map((item) => <div key={item._id}><div className="flex justify-between text-sm capitalize"><span>{item._id.replaceAll('-', ' ')}</span><span>{item.count}</span></div><div className="mt-2 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-full rounded-full bg-[#e23744]" style={{ width: `${(item.count / max) * 100}%` }} /></div></div>)}</div></section></main>
}
export default AdminAnalytics
