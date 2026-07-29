import { useState } from 'react'
import { BadgePercent, ChevronDown, ChevronRight, MapPin, Search, Smartphone, Star, Store, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import burgerKingLogo from '../../assets/images/brands/burgerking.png'
import dominosLogo from '../../assets/images/brands/dominos.png'
import haldiramsLogo from '../../assets/images/brands/haldirams.png'
import lapinozLogo from '../../assets/images/brands/lapinoz.png'
import mcdonaldsLogo from '../../assets/images/brands/mcdonalds.png'
import subwayLogo from '../../assets/images/brands/subway.png'

const images = {
  hero: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=85',
  pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  biryani: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80',
  thali: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
  chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
  gujarati: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  southIndian: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  northIndian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
  dining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
}

const categories = [
  ['Pizza', images.pizza],
  ['Burger', images.burger],
  ['Biryani', images.biryani],
  ['Chinese', images.chinese],
  ['Gujarati', images.gujarati],
  ['South Indian', images.southIndian],
  ['North Indian', images.northIndian],
  ['Fast Food', images.hero],
  ['Dessert', images.dessert],
  ['Beverages', images.beverages],
]

const _legacyBrands = [
  ['La Pino’z', lapinozLogo],
  ['McDonald’s', mcdonaldsLogo],
  ['Burger King', burgerKingLogo],
  ['Subway', subwayLogo],
  ['Domino’s', dominosLogo],
  ['Haldiram’s', haldiramsLogo],
]

const brandLinks = [
  ['La Pinoz', lapinozLogo, 'la-pinoz'],
  ['McDonalds', mcdonaldsLogo, 'mcdonalds'],
  ['Burger King', burgerKingLogo, 'burger-king'],
  ['Subway', subwayLogo, 'subway'],
  ['Dominos', dominosLogo, 'dominos'],
  ['Haldirams', haldiramsLogo, 'haldirams'],
]

const _legacyRestaurants = [
  { id: 1, name: 'The Green House', cuisine: 'North Indian, Continental', rating: 4.5, price: 280, image: images.restaurant },
  { id: 2, name: 'Urban Tadka', cuisine: 'Punjabi, Biryani', rating: 4.3, price: 240, image: images.dining },
  { id: 3, name: 'Brew & Bites', cuisine: 'Cafe, Italian, Desserts', rating: 4.6, price: 190, image: images.cafe },
]

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">{subtitle}</p>}
      </div>
      {action && <button className="hidden shrink-0 items-center gap-1 text-sm text-[#e23744] sm:flex">{action}<ChevronRight className="size-4" /></button>}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[480px] overflow-hidden">
      <img src={images.hero} alt="A table filled with colourful dishes" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="mx-auto flex min-h-[480px] max-w-[1100px] flex-col items-center justify-center px-4 text-center text-white">
        <p className="text-5xl font-black italic tracking-[-0.08em] sm:text-7xl">zomato</p>
        <h1 className="mt-5 text-2xl font-medium sm:text-4xl">Discover the best food &amp; drinks in Ahmedabad</h1>
        <div className="mt-8 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:flex-row">
          <button className="flex items-center gap-2 px-4 py-4 text-sm text-zinc-600 sm:w-52">
            <MapPin className="size-5 text-[#e23744]" /> Ahmedabad <ChevronDown className="ml-auto size-4" />
          </button>
          <span className="hidden w-px bg-zinc-200 sm:block" />
          <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4">
            <Search className="size-5 text-zinc-500" />
            <input className="min-w-0 flex-1 text-sm text-zinc-800 outline-none" placeholder="Search for restaurant, cuisine or a dish" />
          </label>
        </div>
      </div>
    </section>
  )
}

export function FoodCategories({ selectedCategory, onSelectCategory }) {
  return (
    <section className="section-wrap">
      <SectionTitle title="Food Categories" subtitle="What are you craving today?" action="View all" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-5">
        {categories.map(([name, image]) => (
          <button
            key={name}
            onClick={() => onSelectCategory(name.toLowerCase().replaceAll(' ', '-'))}
            className={`group rounded-2xl p-2 text-center transition ${selectedCategory === name.toLowerCase().replaceAll(' ', '-') ? 'bg-red-50 ring-2 ring-[#e23744] dark:bg-red-950/30' : ''}`}
          >
            <img src={image} alt="" className="aspect-square w-full rounded-full object-cover shadow-md transition group-hover:scale-105" />
            <span className="mt-3 block text-sm font-medium text-zinc-700 dark:text-zinc-200">{name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function TopBrands() {
  const [selectedBrand] = useState(null)
  return (
    <section className="section-wrap">
      <SectionTitle title="Top Brands" subtitle="Popular brands that deliver to your doorstep" />
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {brandLinks.map(([name, logo, slug]) => (
          <Link key={name} to={`/brands/${slug}`} className="text-center">
            <div className="mx-auto grid aspect-square w-full place-items-center rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800">
              <img src={logo} alt={`${name} logo`} className="size-full object-contain" />
            </div>
            <p className="mt-3 text-sm font-medium">{name}</p>
          </Link>
        ))}
      </div>
      {selectedBrand && (
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-950 dark:bg-red-950/20">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-[#e23744]">Selected brand</p><p className="mt-1 text-lg font-semibold">{selectedBrand}</p><p className="text-sm text-zinc-500">Browse this brand’s menu, offers and nearby outlets.</p></div>
          <button onClick={() => document.getElementById('popular-restaurants')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-lg bg-[#e23744] px-4 py-2.5 text-sm font-semibold text-white">Explore restaurants</button>
        </div>
      )}
    </section>
  )
}

export function FirstOrderInspiration() {
  return (
    <section className="bg-zinc-50 py-14 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <SectionTitle title="Inspiration for your first order" subtitle="Handpicked favourites to get you started" />
        <div className="grid gap-5 sm:grid-cols-3">
          {categories.slice(0, 3).map(([name, image], index) => (
            <article key={name} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img src={image} alt={name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="text-lg font-semibold">{name} favourites</p><p className="mt-1 text-sm text-white/75">{18 + index * 9} places</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PopularRestaurants({ dynamicItems = [], location = '' }) {
  const { addItem } = useCart()
  const visibleRestaurants = [
    ...dynamicItems.map((item) => ({
      id: item._id,
      name: item.title,
      cuisine: item.description || 'Restaurant',
      rating: item.rating || 4,
      price: item.price || 0,
      image: item.imageUrl || images.restaurant,
      badge: item.badge,
    })),
  ]
  return (
    <section id="popular-restaurants" className="section-wrap">
      <SectionTitle title={`Popular Restaurants in ${location}`} subtitle="Restaurants available for your selected location" />
      {visibleRestaurants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
          <Store className="mx-auto size-10 text-zinc-300" />
          <p className="mt-3 font-medium">No restaurants available</p>
          <p className="mt-1 text-sm text-zinc-500">Restaurants added by the admin will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {visibleRestaurants.map((restaurant) => (
          <article key={restaurant.id} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <Link to={`/restaurants/${restaurant.id}`}><img src={restaurant.image} alt={restaurant.name} className="h-48 w-full object-cover" /></Link>
            <div className="p-4">
              <div className="flex justify-between gap-3"><Link to={`/restaurants/${restaurant.id}`} className="font-semibold">{restaurant.name}</Link><span className="flex items-center gap-1 rounded-md bg-green-700 px-1.5 py-0.5 text-xs font-semibold text-white">{restaurant.rating}<Star className="size-3 fill-white" /></span></div>
              <p className="mt-1 truncate text-sm text-zinc-500">{restaurant.cuisine}</p>
              {restaurant.badge && <p className="mt-2 inline-block rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{restaurant.badge}</p>}
              <div className="mt-4 flex items-center justify-between"><span className="text-sm font-medium">₹{restaurant.price} for one</span><button onClick={() => addItem({ id: restaurant.id, name: `${restaurant.name} Special`, price: restaurant.price })} className="rounded-lg border border-[#e23744] px-3 py-1.5 text-xs font-semibold text-[#e23744] hover:bg-red-50 dark:hover:bg-red-950/30">Add to cart</button></div>
            </div>
          </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function OffersNearYou({ dynamicItems = [], location = '' }) {
  const _legacyOffers = [
    ...dynamicItems.map((item) => [item.badge || item.title, item.description, item.imageUrl || images.pizza]),
    ['50% OFF', 'Up to ₹100', images.pizza],
    ['FREE DELIVERY', 'Above ₹199', images.burger],
    ['FLAT ₹125 OFF', 'Use code TASTY', images.biryani],
  ]
  const offers = dynamicItems.map((item) => ({
    id: item._id,
    title: item.badge || item.title,
    code: item.title,
    detail: item.description,
    restaurantName: item.restaurantName,
  }))

  return (
    <section className="section-wrap">
      <SectionTitle title={`Offers in ${location}`} subtitle="Offers available for your selected location" />
      {offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
          <BadgePercent className="mx-auto size-10 text-zinc-300" />
          <p className="mt-3 font-medium">No offers available</p>
          <p className="mt-1 text-sm text-zinc-500">Offers added by the admin will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer.id} className="relative overflow-hidden rounded-2xl border border-dashed border-[#e23744] bg-white shadow-sm dark:bg-zinc-900">
              <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-white ring-1 ring-[#e23744] dark:bg-zinc-950" />
              <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-white ring-1 ring-[#e23744] dark:bg-zinc-950" />
              <div className="bg-[#e23744] px-5 py-4 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Exclusive Coupon</p>
                <p className="mt-1 text-2xl font-black">{offer.title}</p>
              </div>
              <div className="px-6 py-5 text-center">
                <p className="text-sm text-zinc-500">{offer.detail}</p>
                <div className="my-4 border-t border-dashed border-zinc-300 dark:border-zinc-700" />
                <p className="text-xs uppercase tracking-wider text-zinc-400">Restaurant</p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-white">{offer.restaurantName}</p>
                <p className="mt-3 text-xs text-zinc-400">Use code: <span className="font-bold text-[#e23744]">{offer.code}</span></p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function CategoryResults({ category, items, onClear }) {
  const { addItem } = useCart()
  if (!category) return null
  const title = category.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')

  return (
    <section className="bg-zinc-50 py-14 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div><p className="text-sm text-[#e23744]">Category results</p><h2 className="mt-1 text-3xl font-semibold">{title}</h2></div>
          <button onClick={onClear} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700">Show all sections</button>
        </div>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700"><Utensils className="mx-auto size-10 text-zinc-300" /><p className="mt-3 font-medium">No {title} items added yet</p><p className="mt-1 text-sm text-zinc-500">Admin can add items from the dashboard.</p></div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item._id} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <img src={item.imageUrl || images.hero} alt={item.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <div className="flex justify-between gap-3"><h3 className="font-semibold">{item.title}</h3>{item.rating > 0 && <span className="text-sm font-medium text-green-700">{item.rating} ★</span>}</div>
                  <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between"><span className="font-semibold">₹{item.price}</span><button onClick={() => addItem({ id: item._id, name: item.title, price: item.price })} className="rounded-lg border border-[#e23744] px-3 py-1.5 text-xs font-semibold text-[#e23744]">Add to cart</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function ExploreCuisine() {
  const cuisines = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican', 'Gujarati', 'Street Food', 'Desserts']
  return (
    <section className="bg-zinc-50 py-14 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <SectionTitle title="Explore by Cuisine" subtitle="Discover your favourite flavours" />
        <div className="flex flex-wrap gap-3">{cuisines.map((cuisine) => <button key={cuisine} className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm text-zinc-700 transition hover:border-[#e23744] hover:text-[#e23744] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{cuisine}</button>)}</div>
      </div>
    </section>
  )
}

export function GetTheApp() {
  return (
    <section className="section-wrap">
      <div className="overflow-hidden rounded-3xl bg-[#fff5f6] px-6 py-10 dark:bg-red-950/20 sm:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 md:flex-row">
          <div className="grid size-40 shrink-0 place-items-center rounded-[2rem] bg-white text-[#e23744] shadow-xl dark:bg-zinc-900"><Smartphone className="size-20" /></div>
          <div><h2 className="text-3xl font-semibold">Get the Zomato app</h2><p className="mt-3 text-zinc-500 dark:text-zinc-400">Order faster, track every delivery and unlock app-only offers.</p><div className="mt-6 flex gap-3"><button className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">App Store</button><button className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">Google Play</button></div></div>
        </div>
      </div>
    </section>
  )
}

export function CustomerReviews() {
  const reviews = [['Priya Shah', '“Fast delivery and the food arrived hot. The restaurant suggestions are always spot on.”'], ['Rohan Mehta', '“Finding great places nearby has never been easier. Love the simple ordering flow.”'], ['Aarav Patel', '“Excellent offers and plenty of cuisine options for the whole family.”']]
  return (
    <section className="section-wrap">
      <SectionTitle title="Loved by foodies" subtitle="What our customers say" />
      <div className="grid gap-5 md:grid-cols-3">{reviews.map(([name, text]) => <blockquote key={name} className="rounded-2xl border border-zinc-100 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div className="flex text-amber-400">{[1,2,3,4,5].map((star) => <Star key={star} className="size-4 fill-current" />)}</div><p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p><footer className="mt-5 font-semibold">{name}</footer></blockquote>)}</div>
    </section>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const questions = [
    ['How can I place an order?', 'Choose a restaurant, add dishes to your cart and continue to checkout.'],
    ['Can I change my delivery location?', 'Yes. Use the location selector in the navigation bar at any time.'],
    ['How do I track an order?', 'After checkout, live order status will be available from your Orders page.'],
    ['What payment methods are accepted?', 'Cards, UPI, wallets and cash on delivery can be supported during backend integration.'],
  ]
  return (
    <section className="section-wrap">
      <SectionTitle title="Frequently Asked Questions" />
      <div className="space-y-3">{questions.map(([question, answer], index) => <article key={question} className="rounded-xl border border-zinc-200 dark:border-zinc-800"><button onClick={() => setOpenIndex(openIndex === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium">{question}<ChevronDown className={`size-5 transition ${openIndex === index ? 'rotate-180' : ''}`} /></button>{openIndex === index && <p className="px-5 pb-5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{answer}</p>}</article>)}</div>
    </section>
  )
}

export function ExploreOptions() {
  const options = ['Popular cuisines near me', 'Popular restaurant types near me', 'Top restaurant chains', 'Cities we deliver to']
  return (
    <section className="bg-zinc-50 py-14 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6"><SectionTitle title="Explore Options Near Me" /><div className="space-y-3">{options.map((option) => <button key={option} className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 text-left text-lg dark:border-zinc-800 dark:bg-zinc-900">{option}<ChevronRight className="size-5 text-zinc-400" /></button>)}</div></div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-zinc-100 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <p className="text-4xl font-black italic tracking-[-0.07em]">zomato</p>
        <div className="mt-8 grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
          {[
            ['About Zomato', 'Who we are', 'Blog', 'Careers'],
            ['For Restaurants', 'Partner with us', 'Apps for you', 'Business'],
            ['Learn More', 'Privacy', 'Security', 'Terms'],
            ['Social Links', 'Instagram', 'Facebook', 'LinkedIn'],
          ].map(([heading, ...links]) => <div key={heading}><h3 className="font-semibold uppercase tracking-wider">{heading}</h3><div className="mt-4 space-y-2 text-zinc-500 dark:text-zinc-400">{links.map((link) => <a href="/" className="block hover:text-[#e23744]" key={link}>{link}</a>)}</div></div>)}
        </div>
        <p className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">© 2026 Zomato Clone. Built for learning purposes.</p>
      </div>
    </footer>
  )
}
