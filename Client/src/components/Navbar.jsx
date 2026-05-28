import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateQtyInCart, clearCart } from "../utils/cart";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [location, setLocation] = useState("Ahmedabad");
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [cartItems, setCartItems] = useState(getCart());
  const [userDropdown, setUserDropdown] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const isUserLoggedIn = !!localStorage.getItem("token");
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  // Cart update listen karo (CategoryPage thhi add thay tyare)
  useEffect(() => {
    const onCartUpdate = () => setCartItems(getCart());
    window.addEventListener("cartUpdated", onCartUpdate);
    return () => window.removeEventListener("cartUpdated", onCartUpdate);
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
    window.location.reload();
  };

  const cities = ["Ahmedabad", "Mumbai", "Delhi", "Bangalore", "Pune", "Surat", "Vadodara", "Hyderabad", "Chennai"];
  const totalQty = cartItems.reduce((a, i) => a + i.qty, 0);
  const totalPrice = cartItems.reduce((a, i) => a + i.qty * i.price, 0);

  const handleUpdateQty = (id, delta) => {
    updateQtyInCart(id, delta);
    setCartItems(getCart());
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setShowPayment(true);
    setPaymentDone(false);
  };

  const handlePayNow = () => {
    setPaymentDone(true);
    clearCart();
    setCartItems([]);
  };

  return (
    <div className="font-sans">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center gap-1.5">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow">
                <svg viewBox="0 0 36 36" className="w-5 h-5 fill-white">
                  <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-orange-500 tracking-tight hidden sm:block">swiggy</span>
            </a>

            {/* Location */}
            <div className="relative hidden md:block">
              <button onClick={() => setLocationDropdown(!locationDropdown)}
                className="flex items-center gap-1 border-b-2 border-black pb-0.5 hover:border-orange-500 transition-colors group">
                <svg className="w-3.5 h-3.5 text-orange-500 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{location}</span>
                <svg className={`w-4 h-4 text-orange-500 transition-transform duration-200 ${locationDropdown ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {locationDropdown && (
                <div className="absolute top-9 left-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                  <p className="text-xs text-gray-400 px-4 pt-1 pb-2 uppercase tracking-wider font-semibold">Select City</p>
                  {cities.map(city => (
                    <button key={city} onClick={() => { setLocation(city); setLocationDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium ${location === city ? "text-orange-500 bg-orange-50" : "text-gray-700"}`}>
                      {location === city && "✓ "}{city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </span>
                <input type="text" placeholder="Search for restaurants, dishes..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-100 text-sm rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all placeholder-gray-400 text-gray-800" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Right Links */}
            <div className="hidden md:flex items-center gap-0.5">
              <a href="#offers" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Offers
                <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold leading-none">New</span>
              </a>
              <a href="#help" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Help
              </a>

              {isUserLoggedIn ? (
                <div className="relative">
                  <button onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-800 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-all">
                    <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span>{user?.name?.split(" ")[0]}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userDropdown ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userDropdown && (
                    <div className="absolute right-0 top-11 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                      </div>
                      <button onClick={() => { handleUserLogout(); setUserDropdown(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </Link>
              )}

              {isAdminLoggedIn ? (
                <div className="flex items-center gap-1.5 px-3 py-2 border border-orange-200 rounded-xl ml-1">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-semibold text-orange-600">{admin?.name?.split(" ")[0]}</span>
                  <button onClick={handleAdminLogout}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all ml-1">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/admin" title="Admin Dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-all border border-gray-200 hover:border-orange-300 ml-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin
                </Link>
              )}

              <button onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-100 transition-all ml-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-orange-600 text-xs font-extrabold rounded-full flex items-center justify-center border-2 border-orange-500">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile icons */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-700 hover:text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalQty > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{totalQty}</span>
                )}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl text-gray-700 hover:bg-gray-100">
                {menuOpen
                  ? <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-4 space-y-4">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input type="text" placeholder="Search for food..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-sm rounded-xl outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400" />
            </div>
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2.5">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1">
              {isUserLoggedIn ? (
                <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-800">👤 {user?.name}</span>
                  <button onClick={() => { handleUserLogout(); setMenuOpen(false); }}
                    className="text-sm font-semibold text-red-500">Logout</button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors">
                  Sign In
                </Link>
              )}
              {isAdminLoggedIn ? (
                <div className="flex items-center justify-between px-3 py-2.5 bg-orange-50 rounded-xl border border-orange-200">
                  <span className="text-sm font-semibold text-orange-600">🛡️ {admin?.name}</span>
                  <button onClick={() => { handleAdminLogout(); setMenuOpen(false); }}
                    className="text-sm font-semibold text-red-500">Logout</button>
                </div>
              ) : (
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-xl transition-colors border border-orange-200">
                  🛡️ Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* =================== CART DRAWER =================== */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Your Cart</h2>
                <p className="text-xs text-gray-400 mt-0.5">{cartItems.length > 0 ? `${totalQty} items · ₹${totalPrice}` : "No items yet"}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-700">Your cart is empty</p>
                  <p className="text-xs text-gray-400">Add some delicious food first!</p>
                  <button onClick={() => setCartOpen(false)} className="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl">Browse Restaurants</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleUpdateQty(item._id, -1)} className="w-7 h-7 rounded-full bg-white border border-orange-200 text-orange-600 font-bold flex items-center justify-center hover:bg-orange-100 text-lg">−</button>
                        <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.qty}</span>
                        <button onClick={() => handleUpdateQty(item._id, 1)} className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center hover:bg-orange-600 text-lg">+</button>
                      </div>
                      <p className="text-sm font-bold text-gray-900 w-14 text-right flex-shrink-0">₹{item.qty * item.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-3">
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-500"><span>Item Total</span><span className="font-semibold text-gray-800">₹{totalPrice}</span></div>
                  <div className="flex justify-between text-sm text-gray-500"><span>Delivery Fee</span><span className="font-semibold text-green-600">FREE</span></div>
                  <div className="border-t border-gray-200 pt-2.5 flex justify-between"><span className="font-bold text-gray-900">Grand Total</span><span className="text-lg font-extrabold text-orange-500">₹{totalPrice}</span></div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-200 text-sm flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* =================== PAYMENT PAGE =================== */}
      {showPayment && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => !paymentDone && setShowPayment(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

              {!paymentDone ? (
                <>
                  {/* Payment Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-extrabold text-white">Checkout</h2>
                        <p className="text-orange-100 text-sm mt-0.5">Complete your order</p>
                      </div>
                      <button onClick={() => setShowPayment(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</p>
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        {cartItems.map(item => (
                          <div key={item._id} className="flex justify-between text-sm">
                            <span className="text-gray-600 truncate flex-1">{item.name} <span className="text-gray-400">×{item.qty}</span></span>
                            <span className="font-semibold text-gray-800 ml-2">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-extrabold text-orange-500 text-lg">₹{totalPrice}</span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</p>
                      <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
                        <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{user?.name || "Guest"}</p>
                          <p className="text-xs text-gray-500">Ahmedabad, Gujarat • 380001</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "UPI", icon: "📱" },
                          { label: "Card", icon: "💳" },
                          { label: "COD", icon: "💵" },
                        ].map((m, i) => (
                          <div key={m.label} className={`flex flex-col items-center gap-1 px-3 py-3 rounded-2xl border-2 cursor-pointer transition-all ${i === 0 ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}>
                            <span className="text-xl">{m.icon}</span>
                            <span className="text-xs font-bold text-gray-700">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayNow}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-95 text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 text-base flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pay ₹{totalPrice}
                    </button>
                  </div>
                </>
              ) : (
                /* ===== ORDER SUCCESS ===== */
                <div className="p-8 flex flex-col items-center text-center">
                  {/* Success animation circle */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    {/* Sparkle dots */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-orange-400 rounded-full opacity-80 animate-bounce" style={{animationDelay:"0.1s"}}></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-yellow-400 rounded-full opacity-80 animate-bounce" style={{animationDelay:"0.3s"}}></div>
                    <div className="absolute top-2 left-0 w-2 h-2 bg-green-400 rounded-full opacity-80 animate-bounce" style={{animationDelay:"0.5s"}}></div>
                  </div>

                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h2>
                  <p className="text-gray-500 text-sm mb-1">Your food is being prepared</p>
                  <p className="text-gray-400 text-xs mb-6">Estimated delivery: <span className="font-bold text-orange-500">30–40 mins</span></p>

                  {/* Order ID */}
                  <div className="bg-gray-50 rounded-2xl px-6 py-4 w-full mb-6">
                    <p className="text-xs text-gray-400 font-medium mb-1">Order ID</p>
                    <p className="text-sm font-extrabold text-gray-800 font-mono">
                      #SWG{Math.floor(100000 + Math.random() * 900000)}
                    </p>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-gray-400">Amount Paid</span>
                      <span className="font-extrabold text-green-600">₹{totalPrice}</span>
                    </div>
                  </div>

                  {/* Delivery tracker */}
                  <div className="w-full mb-6">
                    <div className="flex items-center justify-between">
                      {["Order Placed", "Preparing", "On the Way", "Delivered"].map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                            {i === 0 ? "✓" : i + 1}
                          </div>
                          <p className={`text-xs font-medium text-center leading-tight ${i === 0 ? "text-green-600" : "text-gray-400"}`}>{step}</p>
                        </div>
                      ))}
                    </div>
                    <div className="relative mt-2 h-1 bg-gray-100 rounded-full mx-3">
                      <div className="absolute left-0 top-0 h-full w-[8%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowPayment(false); setPaymentDone(false); }}
                    className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-100 text-sm"
                  >
                    Continue Ordering 🍔
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}