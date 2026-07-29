import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api'

function Wishlist() {
  const [restaurants, setRestaurants] = useState([])
  useEffect(() => { apiRequest('/reviews/wishlist').then((data) => setRestaurants(data.restaurants)) }, [])
  return <main className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6"><h1 className="flex items-center gap-2 text-3xl font-semibold"><Heart className="text-[#e23744]" /> Wishlist</h1><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{restaurants.length === 0 ? <p className="text-zinc-500">No favourite restaurants yet.</p> : restaurants.map((item) => <Link key={item._id} to={`/restaurants/${item._id}`} className="overflow-hidden rounded-2xl border dark:border-zinc-800">{item.imageUrl && <img src={item.imageUrl} alt="" className="h-40 w-full object-cover" />}<div className="p-4"><h2 className="font-semibold">{item.title}</h2><p className="text-sm text-zinc-500">{item.description}</p></div></Link>)}</div></main>
}
export default Wishlist
