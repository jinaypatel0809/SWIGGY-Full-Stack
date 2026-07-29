import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiRequest } from '../../services/api'

function Search() {
  const [params] = useSearchParams()
  const [items, setItems] = useState([])
  const [rating, setRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const query = params.get('q')?.toLowerCase() || ''
  useEffect(() => { apiRequest('/content').then((data) => setItems(data.items)) }, [])
  const results = useMemo(() => items.filter((item) => `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query) && item.rating >= rating && item.price <= maxPrice), [items, query, rating, maxPrice])
  return <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6"><h1 className="text-3xl font-semibold">Search results for “{query}”</h1><div className="mt-5 flex gap-3"><select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="admin-input max-w-48"><option value="0">Any rating</option><option value="4">4+ rating</option></select><select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="admin-input max-w-48"><option value="1000">Any price</option><option value="200">Under ₹200</option><option value="500">Under ₹500</option></select></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((item) => <Link key={item._id} to={item.section === 'restaurant' ? `/restaurants/${item._id}` : '#'} className="rounded-2xl border p-4 dark:border-zinc-800"><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm text-zinc-500">{item.description}</p><p className="mt-3">₹{item.price} · {item.rating} ★</p></Link>)}</div></main>
}
export default Search
