import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useLocationSelection } from '../../context/LocationContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const navRef = useRef(null)
  const navigate = useNavigate()
  const { user, admin, isAuthenticated, logout } = useAuth()
  const { items, itemCount, total } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { location, setLocation, locations } = useLocationSelection()

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setOpenDropdown(null)
      }
      if (event.type === 'mousedown' && !navRef.current?.contains(event.target)) {
        setOpenDropdown(null)
      }
    }

    window.addEventListener('keydown', closeMenus)
    window.addEventListener('mousedown', closeMenus)
    return () => {
      window.removeEventListener('keydown', closeMenus)
      window.removeEventListener('mousedown', closeMenus)
    }
  }, [])

  const toggleDropdown = (name) => {
    setOpenDropdown((current) => (current === name ? null : name))
  }

  const chooseLocation = (nextLocation) => {
    setLocation(nextLocation)
    setOpenDropdown(null)
  }

  const handleLogout = () => {
    const loginPath = user?.role === 'admin' ? '/admin/login' : '/login'
    logout()
    setOpenDropdown(null)
    setIsMenuOpen(false)
    navigate(loginPath)
  }

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <nav className="mx-auto flex h-[72px] max-w-[1100px] items-center gap-5 px-4 sm:px-6" aria-label="Main navigation">
        <Link to="/" className="shrink-0 text-[2rem] font-black italic leading-none tracking-[-0.07em] text-zinc-950" aria-label="Zomato home">
          zomato
        </Link>

        <div className="hidden min-w-0 flex-1 items-center rounded-lg border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(28,28,28,0.08)] md:flex">
          <div className="relative min-w-0 basis-[36%]">
            <button
              type="button"
              className="flex h-[52px] w-full items-center gap-2 px-3 text-left text-sm text-zinc-500"
              onClick={() => toggleDropdown('location')}
              aria-expanded={openDropdown === 'location'}
            >
              <MapPin className="size-5 shrink-0 text-[#ff7e8b]" strokeWidth={2.2} />
              <span className="truncate">{location}</span>
              <ChevronDown className="ml-auto size-4 shrink-0 text-zinc-600" />
            </button>

            {openDropdown === 'location' && (
              <div className="absolute left-0 top-[58px] w-60 overflow-hidden rounded-xl border border-zinc-100 bg-white py-2 shadow-xl">
                <p className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Choose location</p>
                {locations.map((city) => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => chooseLocation(city)}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-zinc-50 ${city === location ? 'font-medium text-[#e23744]' : 'text-zinc-700'}`}
                  >
                    <MapPin className="size-4" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="h-5 w-px bg-zinc-300" />
          <label className="flex h-[52px] min-w-0 flex-1 items-center gap-3 px-4">
            <Search className="size-5 shrink-0 text-zinc-500" />
            <span className="sr-only">Search restaurants, cuisines or dishes</span>
            <input type="search" onKeyDown={(event) => { if (event.key === 'Enter' && event.currentTarget.value.trim()) navigate(`/search?q=${encodeURIComponent(event.currentTarget.value.trim())}`) }} placeholder="Search for restaurant, cuisine or a dish" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400" />
          </label>
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-5 md:flex">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-[1.02rem] font-light text-zinc-600 hover:text-zinc-900">Log in</Link>
              <Link to="/sign-up" className="text-[1.02rem] font-light text-zinc-600 hover:text-zinc-900">Sign up</Link>
            </>
          )}
          {isAuthenticated && user.role === 'user' && (
            <div className="relative">
              <button type="button" onClick={() => toggleDropdown('profile')} className="flex items-center gap-2 text-zinc-700" aria-expanded={openDropdown === 'profile'}>
                <span className="grid size-9 place-items-center rounded-full bg-[#e23744] text-white"><UserRound className="size-5" /></span>
                <span className="max-w-24 truncate text-sm font-medium">{user.name}</span>
                <ChevronDown className="size-4" />
              </button>
              {openDropdown === 'profile' && (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-zinc-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-zinc-800">{user.name}</p>
                    <p className="truncate text-xs text-zinc-400">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setOpenDropdown(null)} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <UserRound className="size-4" /> Profile &amp; phone
                  </Link>
                  <Link to="/orders" onClick={() => setOpenDropdown(null)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <ShoppingBag className="size-4" /> My orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setOpenDropdown(null)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <UserRound className="size-4" /> Wishlist
                  </Link>
                  <button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#e23744] hover:bg-red-50">
                    <LogOut className="size-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link to={admin ? '/admin/dashboard' : '/admin/login'} className="rounded-lg p-2 text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800" aria-label="Admin dashboard sign in">
            <LayoutDashboard className="size-6" />
          </Link>

          <button type="button" onClick={toggleTheme} className="rounded-lg p-2 text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? <Moon className="size-6" /> : <Sun className="size-6" />}
          </button>

          <div className="relative">
            <button type="button" onClick={() => toggleDropdown('cart')} className="relative rounded-lg p-2 text-zinc-700 hover:bg-zinc-50" aria-label={`Cart with ${itemCount} items`} aria-expanded={openDropdown === 'cart'}>
              <ShoppingBag className="size-6" />
              {itemCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#e23744] text-[10px] font-bold text-white">{itemCount}</span>}
            </button>
            {openDropdown === 'cart' && (
              <div className="absolute right-0 top-12 w-80 rounded-xl border border-zinc-100 bg-white p-4 shadow-xl">
                <p className="font-semibold text-zinc-800">Your cart</p>
                {items.length === 0 ? (
                  <div className="py-7 text-center">
                    <ShoppingBag className="mx-auto size-9 text-zinc-300" />
                    <p className="mt-2 text-sm text-zinc-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between gap-3 text-sm">
                        <span className="truncate text-zinc-700">{item.quantity}× {item.name}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-zinc-100 pt-3 font-semibold"><span>Total</span><span>₹{total}</span></div>
                  </div>
                )}
                <Link to="/cart" onClick={() => setOpenDropdown(null)} className="mt-2 block rounded-lg bg-[#e23744] py-2.5 text-center text-sm font-semibold text-white">View cart</Link>
              </div>
            )}
          </div>
        </div>

        <button type="button" className="ml-auto rounded-md p-2 text-zinc-700 md:hidden" onClick={() => setIsMenuOpen((current) => !current)} aria-expanded={isMenuOpen} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 py-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-3">
            <Search className="size-5 text-zinc-500" />
            <input type="search" onKeyDown={(event) => { if (event.key === 'Enter' && event.currentTarget.value.trim()) { navigate(`/search?q=${encodeURIComponent(event.currentTarget.value.trim())}`); setIsMenuOpen(false) } }} placeholder="Search restaurant, cuisine or dish" className="min-w-0 flex-1 text-sm outline-none" />
          </label>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Select location</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {locations.map((city) => (
              <button type="button" key={city} onClick={() => chooseLocation(city)} className={`rounded-full border px-3 py-1.5 text-xs ${city === location ? 'border-[#e23744] bg-red-50 text-[#e23744]' : 'border-zinc-200 text-zinc-600'}`}>{city}</button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {isAuthenticated && user.role === 'user' ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm"><UserRound className="size-4" /><span className="truncate">{user.name}</span></div>
                <button type="button" onClick={handleLogout} className="rounded-lg border border-red-200 py-2.5 text-sm text-[#e23744]">Logout</button>
              </>
            ) : !isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-lg border border-zinc-200 py-2.5 text-center text-sm">Log in</Link>
                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)} className="rounded-lg bg-[#e23744] py-2.5 text-center text-sm text-white">Sign up</Link>
              </>
            ) : (
              <button type="button" onClick={handleLogout} className="col-span-2 rounded-lg border border-red-200 py-2.5 text-sm text-[#e23744]">Admin logout</button>
            )}
          </div>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2.5 text-sm">
            <ShoppingBag className="size-4" /> Cart ({itemCount})
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link to={admin ? '/admin/dashboard' : '/admin/login'} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2.5 text-sm dark:border-zinc-700">
              <LayoutDashboard className="size-4" /> Admin
            </Link>
            <button type="button" onClick={toggleTheme} className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2.5 text-sm dark:border-zinc-700">
              {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
