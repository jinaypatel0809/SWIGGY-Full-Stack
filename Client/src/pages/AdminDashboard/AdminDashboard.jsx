import { useCallback, useEffect, useState } from 'react'
import {
  BadgePercent,
  LayoutDashboard,
  Pencil,
  Plus,
  Save,
  ShoppingBag,
  Store,
  Trash2,
  Utensils,
  X,
  LogOut,
} from 'lucide-react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { availableLocations, locationSlug } from '../../context/LocationContext'
import { apiRequest } from '../../services/api'

const menuItems = [
  { slug: 'restaurants', label: 'Popular Restaurants', section: 'restaurant', icon: Store },
  { slug: 'offers', label: 'Offers Near You', section: 'offer', icon: BadgePercent },
  ...[
    ['La Pino’z', 'la-pinoz'],
    ['McDonald’s', 'mcdonalds'],
    ['Burger King', 'burger-king'],
    ['Subway', 'subway'],
    ['Domino’s', 'dominos'],
    ['Haldiram’s', 'haldirams'],
  ].map(([label, category]) => ({
    slug: `brand-${category}`,
    label,
    section: 'brand',
    category,
    icon: Store,
  })),
  ...[
    'Pizza', 'Burger', 'Biryani', 'Chinese', 'Gujarati', 'South Indian',
    'North Indian', 'Fast Food', 'Dessert', 'Beverages',
  ].map((label) => ({
    slug: label.toLowerCase().replaceAll(' ', '-'),
    label,
    section: 'food',
    category: label.toLowerCase().replaceAll(' ', '-'),
    icon: Utensils,
  })),
]

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  price: '',
  rating: '',
  badge: '',
  location: '',
  restaurantName: '',
  restaurantId: '',
}

function AdminDashboard() {
  const { contentType = 'restaurants' } = useParams()
  const activeMenu = menuItems.find((item) => item.slug === contentType) || menuItems[0]
  const { admin, logoutAdmin } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const query = new URLSearchParams({ section: activeMenu.section })
      if (activeMenu.category) query.set('category', activeMenu.category)
      const data = await apiRequest(`/content?${query}`, { authRole: 'admin' })
      setItems(data.items)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }, [activeMenu.category, activeMenu.section])

  useEffect(() => {
    setForm(emptyForm)
    setEditingId(null)
    setIsFormOpen(false)
    setMessage('')
    setError('')
    loadItems()
  }, [contentType, loadItems])

  const openCreateForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setIsFormOpen(true)
    setMessage('')
    setError('')
  }

  const openEditForm = (item) => {
    setForm({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      price: item.price || '',
      rating: item.rating || '',
      badge: item.badge || '',
      location: item.location || '',
      restaurantName: item.restaurantName || '',
      restaurantId: item.restaurantId || '',
    })
    setEditingId(item._id)
    setIsFormOpen(true)
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        section: activeMenu.section,
        category: activeMenu.category || '',
      }
      if (editingId) {
        await apiRequest(`/content/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          authRole: 'admin',
        })
        setMessage('Item updated successfully.')
      } else {
        await apiRequest('/content', {
          method: 'POST',
          body: JSON.stringify(payload),
          authRole: 'admin',
        })
        setMessage('Item added successfully.')
      }
      setForm(emptyForm)
      setEditingId(null)
      setIsFormOpen(false)
      await loadItems()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return
    try {
      const sent = await apiRequest('/auth/admin/sensitive/send-otp', {
        method: 'POST',
        authRole: 'admin',
      })
      const otp = window.prompt(`${sent.message}. Enter OTP to delete:`)
      if (!otp) return
      const verified = await apiRequest('/auth/admin/sensitive/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ otp }),
        authRole: 'admin',
      })
      await apiRequest(`/content/${item._id}`, {
        method: 'DELETE',
        authRole: 'admin',
        headers: { 'x-action-token': verified.actionToken },
      })
      setMessage('Item deleted successfully.')
      await loadItems()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:min-h-[calc(100vh-72px)] lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-6 flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-xl bg-red-50 text-[#e23744] dark:bg-red-950/30"><LayoutDashboard className="size-5" /></span>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">Administrator</p>
              <p className="truncate font-semibold">{admin.name}</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1" aria-label="Content manager">
            <Link to="/admin/analytics" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#e23744] hover:bg-red-50 dark:hover:bg-red-950/20">
              <BadgePercent className="size-4" /> Analytics
            </Link>
            <Link to="/admin/orders" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#e23744] hover:bg-red-50 dark:hover:bg-red-950/20">
              <ShoppingBag className="size-4" /> Orders &amp; Delivery
            </Link>
            {menuItems.map(({ slug, label, icon: Icon }) => (
              <NavLink
                key={slug}
                to={`/admin/dashboard/${slug}`}
                className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive || contentType === slug ? 'bg-[#e23744] font-medium text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
              >
                <Icon className="size-4" /> {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              logoutAdmin()
              navigate('/admin/login')
            }}
            className="mt-6 hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#e23744] hover:bg-red-50 dark:hover:bg-red-950/20 lg:flex"
          >
            <LogOut className="size-4" /> Admin logout
          </button>
        </aside>

        <section className="min-w-0 flex-1 p-4 sm:p-7 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#e23744]">Content management</p>
              <h1 className="mt-1 text-3xl font-semibold">{activeMenu.label}</h1>
              <p className="mt-1 text-sm text-zinc-500">Add, edit or remove content shown on the customer website.</p>
            </div>
            <button onClick={openCreateForm} className="flex items-center gap-2 rounded-lg bg-[#e23744] px-4 py-2.5 text-sm font-semibold text-white">
              <Plus className="size-4" /> Add new
            </button>
          </div>

          {message && <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">{message}</p>}
          {error && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

          {isFormOpen && (
            <form onSubmit={handleSubmit} className="mt-7 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingId ? 'Edit item' : `Add ${activeMenu.label}`}</h2>
                <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="size-5" /></button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="form-label">Name / Title *</span>
                  <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="admin-input" placeholder="Enter item name" />
                </label>
                {activeMenu.section !== 'offer' && (
                  <label className="block">
                    <span className="form-label">Image URL</span>
                    <input type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="admin-input" placeholder="https://example.com/image.jpg" />
                  </label>
                )}
                {activeMenu.section === 'offer' && (
                  <label className="block">
                    <span className="form-label">Restaurant name *</span>
                    <input required value={form.restaurantName} onChange={(event) => setForm({ ...form, restaurantName: event.target.value })} className="admin-input" placeholder="e.g. La Pinoz Pizza" />
                  </label>
                )}
                {['food', 'brand'].includes(activeMenu.section) && (
                  <label className="block md:col-span-2">
                    <span className="form-label">Restaurant MongoDB ID</span>
                    <input value={form.restaurantId} onChange={(event) => setForm({ ...form, restaurantId: event.target.value })} className="admin-input" placeholder="Paste restaurant item ID to show this item on its menu" />
                  </label>
                )}
                {['restaurant', 'offer'].includes(activeMenu.section) && (
                  <label className="block md:col-span-2">
                    <span className="form-label">{activeMenu.section === 'restaurant' ? 'Restaurant' : 'Offer'} location *</span>
                    <select required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="admin-input">
                      <option value="">Select a city</option>
                      {availableLocations.map((city) => <option key={city} value={locationSlug(city)}>{city}</option>)}
                    </select>
                  </label>
                )}
                <label className="block md:col-span-2">
                  <span className="form-label">Description</span>
                  <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input min-h-24 resize-y" placeholder="Short description" />
                </label>
                <label className="block">
                  <span className="form-label">Price (₹)</span>
                  <input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="admin-input" />
                </label>
                <label className="block">
                  <span className="form-label">Rating (0–5)</span>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} className="admin-input" />
                </label>
                <label className="block md:col-span-2">
                  <span className="form-label">Offer / Badge text</span>
                  <input value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} className="admin-input" placeholder="e.g. 50% OFF" />
                </label>
              </div>
              <button className="mt-5 flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                <Save className="size-4" /> {editingId ? 'Update item' : 'Save item'}
              </button>
            </form>
          )}

          <div className="mt-7">
            {isLoading ? (
              <p className="py-12 text-center text-zinc-500">Loading content…</p>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
                <Utensils className="mx-auto size-10 text-zinc-300" />
                <p className="mt-3 font-medium">No items added yet</p>
                <button onClick={openCreateForm} className="mt-3 text-sm font-medium text-[#e23744]">Add your first item</button>
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {items.map((item) => (
                  <article key={item._id} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="size-24 shrink-0 rounded-xl object-cover" /> : <div className="grid size-24 shrink-0 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800"><Utensils className="text-zinc-400" /></div>}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2"><h3 className="truncate font-semibold">{item.title}</h3>{item.price > 0 && <span className="text-sm font-medium">₹{item.price}</span>}</div>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{item.description || 'No description'}</p>
                      {item.restaurantName && <p className="mt-1 text-sm font-semibold">{item.restaurantName}</p>}
                      {item.location && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#e23744]">{item.location.replaceAll('-', ' ')}</p>}
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => openEditForm(item)} className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs dark:border-zinc-700"><Pencil className="size-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(item)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-[#e23744]"><Trash2 className="size-3.5" /> Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard
