import { useEffect, useState } from 'react'
import { ArrowLeft, ShoppingBag, Star, Store } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import burgerKingLogo from '../../assets/images/brands/burgerking.png'
import dominosLogo from '../../assets/images/brands/dominos.png'
import haldiramsLogo from '../../assets/images/brands/haldirams.png'
import lapinozLogo from '../../assets/images/brands/lapinoz.png'
import mcdonaldsLogo from '../../assets/images/brands/mcdonalds.png'
import subwayLogo from '../../assets/images/brands/subway.png'
import { useCart } from '../../context/CartContext'
import { apiRequest } from '../../services/api'

const brandDetails = {
  'la-pinoz': { name: 'La Pinoz', logo: lapinozLogo },
  mcdonalds: { name: 'McDonalds', logo: mcdonaldsLogo },
  'burger-king': { name: 'Burger King', logo: burgerKingLogo },
  subway: { name: 'Subway', logo: subwayLogo },
  dominos: { name: 'Dominos', logo: dominosLogo },
  haldirams: { name: 'Haldirams', logo: haldiramsLogo },
}

function Brand() {
  const { brandSlug } = useParams()
  const brand = brandDetails[brandSlug]
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    if (!brand) return
    setIsLoading(true)
    const query = new URLSearchParams({ section: 'brand', category: brandSlug })
    apiRequest(`/content?${query}`)
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false))
  }, [brand, brandSlug])

  if (!brand) return <Navigate to="/" replace />

  return (
    <main className="min-h-[calc(100vh-72px)] bg-zinc-50 pb-16 dark:bg-zinc-950">
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-[1100px] items-center gap-6 px-4 py-10 sm:px-6">
          <div className="grid size-28 shrink-0 place-items-center rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
            <img src={brand.logo} alt={`${brand.name} logo`} className="size-full object-contain" />
          </div>
          <div>
            <Link to="/" className="flex items-center gap-1 text-sm text-[#e23744]"><ArrowLeft className="size-4" /> Back to home</Link>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{brand.name}</h1>
            <p className="mt-2 text-zinc-500">Menu items added by the admin.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-semibold">{brand.name} Menu</h2>
        {isLoading ? (
          <p className="py-16 text-center text-zinc-500">Loading menu…</p>
        ) : items.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
            <Store className="mx-auto size-11 text-zinc-300" />
            <p className="mt-3 font-medium">No items available yet</p>
            <p className="mt-1 text-sm text-zinc-500">Items added by the admin will appear on this page.</p>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item._id} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-52 w-full object-cover" /> : <div className="grid h-52 place-items-center bg-zinc-100 dark:bg-zinc-800"><ShoppingBag className="size-10 text-zinc-300" /></div>}
                <div className="p-5">
                  <div className="flex justify-between gap-3"><h3 className="font-semibold">{item.title}</h3>{item.rating > 0 && <span className="flex items-center gap-1 text-sm font-medium text-green-700">{item.rating}<Star className="size-3 fill-current" /></span>}</div>
                  <p className="mt-2 min-h-10 text-sm text-zinc-500">{item.description}</p>
                  {item.badge && <span className="mt-3 inline-block rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{item.badge}</span>}
                  <div className="mt-5 flex items-center justify-between"><span className="text-lg font-semibold">₹{item.price}</span><button onClick={() => addItem({ id: item._id, name: item.title, price: item.price })} className="rounded-lg bg-[#e23744] px-4 py-2 text-sm font-semibold text-white">Add to cart</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Brand
