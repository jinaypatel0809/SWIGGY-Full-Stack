import { useEffect, useState } from 'react'
import { Heart, Star } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { apiRequest } from '../../services/api'

function RestaurantDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [reviews, setReviews] = useState([])
  const [review, setReview] = useState({ rating: 5, comment: '' })
  useEffect(() => { apiRequest(`/content/${id}`).then((d) => setRestaurant(d.item)); apiRequest(`/content?restaurantId=${id}`).then((d) => setMenu(d.items)); apiRequest(`/reviews/restaurant/${id}`).then((d) => setReviews(d.reviews)) }, [id])
  const wishlist = async () => { if (!user) return navigate('/login'); await apiRequest(`/reviews/wishlist/${id}`, { method: 'POST' }) }
  const submitReview = async () => { if (!user) return navigate('/login'); await apiRequest(`/reviews/restaurant/${id}`, { method: 'PUT', body: JSON.stringify(review) }); const d = await apiRequest(`/reviews/restaurant/${id}`); setReviews(d.reviews) }
  if (!restaurant) return <main className="p-16 text-center">Loading restaurant…</main>
  return <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6"><img src={restaurant.imageUrl} alt={restaurant.title} className="h-72 w-full rounded-3xl object-cover" /><div className="mt-6 flex justify-between"><div><h1 className="text-4xl font-semibold">{restaurant.title}</h1><p className="mt-2 text-zinc-500">{restaurant.description}</p></div><button onClick={wishlist} className="rounded-full border p-3"><Heart /></button></div><h2 className="mt-10 text-2xl font-semibold">Menu</h2>{menu.length === 0 ? <p className="mt-5 text-zinc-500">No menu items added by admin.</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2">{menu.map((item) => <article key={item._id} className="flex justify-between rounded-xl border p-4 dark:border-zinc-800"><div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-zinc-500">{item.description}</p><p className="mt-2">₹{item.price}</p></div><button onClick={() => addItem({ id: item._id, name: item.title, price: item.price })} className="self-end text-sm font-semibold text-[#e23744]">Add</button></article>)}</div>}<h2 className="mt-10 text-2xl font-semibold">Reviews</h2><div className="mt-4 flex gap-3"><select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} className="admin-input max-w-24">{[5,4,3,2,1].map((n) => <option key={n}>{n}</option>)}</select><input value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className="admin-input" placeholder="Write a review" /><button onClick={submitReview} className="rounded-lg bg-[#e23744] px-5 text-white">Submit</button></div><div className="mt-5 space-y-3">{reviews.map((item) => <article key={item._id} className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"><p className="font-semibold">{item.user?.name} · {item.rating}<Star className="inline size-3 fill-current text-amber-400" /></p><p className="mt-1 text-sm text-zinc-500">{item.comment}</p></article>)}</div></main>
}
export default RestaurantDetails
