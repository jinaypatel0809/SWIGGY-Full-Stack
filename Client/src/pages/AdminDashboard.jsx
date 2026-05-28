import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ================= CATEGORIES =================

const CATEGORIES = [
  { id: 1,  name: "North Indian", emoji: "🍛" },
  { id: 2,  name: "South Indian", emoji: "🥘" },
  { id: 3,  name: "Chinese",      emoji: "🍜" },
  { id: 4,  name: "Pizza",        emoji: "🍕" },
  { id: 5,  name: "Burger",       emoji: "🍔" },
  { id: 6,  name: "Biryani",      emoji: "🍚" },
  { id: 7,  name: "Desserts",     emoji: "🍰" },
  { id: 8,  name: "Rolls",        emoji: "🌯" },
  { id: 9,  name: "Dosa",         emoji: "🫓" },
  { id: 10, name: "Pasta",        emoji: "🍝" },
  { id: 11, name: "Noodles",      emoji: "🍜" },
  { id: 12, name: "Shake",        emoji: "🥤" },
  { id: 13, name: "Coffee",       emoji: "☕" },
  { id: 14, name: "Lassi",        emoji: "🥛" },
  { id: 15, name: "Ice Cream",    emoji: "🍦" },
  { id: 16, name: "Salad",        emoji: "🥗" },
  { id: 17, name: "Paratha",      emoji: "🫓" },
  { id: 18, name: "Vadapav",      emoji: "🍔" },
  { id: 19, name: "Cake",         emoji: "🎂" },
  { id: 20, name: "Khichdi",      emoji: "🍲" },
];

const API_BASE = "https://swiggy-full-stack.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const admin      = JSON.parse(localStorage.getItem("admin") || "null");
  const adminToken = localStorage.getItem("adminToken");

  // tabs
  const [activeTab, setActiveTab] = useState("food");

  // overview
  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // food tab
  const [selectedCategory, setSelectedCategory] = useState(null);   // null = no panel open
  const [categoryFoods,    setCategoryFoods]    = useState([]);
  const [foodLoading,      setFoodLoading]      = useState(false);
  const [submitting,       setSubmitting]       = useState(false);
  const [formError,        setFormError]        = useState("");
  const [formSuccess,      setFormSuccess]      = useState("");
  const [formData, setFormData] = useState({
    name: "", price: "", description: "", image: "", isVeg: true,
  });

  // ── auth guard ──
  useEffect(() => { if (!adminToken) navigate("/admin"); }, [adminToken, navigate]);

  // ── fetch overview ──
  useEffect(() => {
    if (!adminToken) return;
    (async () => {
      try {
        const [dR, uR] = await Promise.all([
          fetch(`${API_BASE}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${adminToken}` } }),
          fetch(`${API_BASE}/api/admin/users`,     { headers: { Authorization: `Bearer ${adminToken}` } }),
        ]);
        const dD = await dR.json();
        const uD = await uR.json();
        if (dR.ok) setStats(dD.stats);
        if (uR.ok) setUsers(uD.users || []);
      } catch { setError("Server connect nathi thayu."); }
      finally  { setLoading(false); }
    })();
  }, [adminToken]);

  // ── fetch foods when category changes ──
  useEffect(() => {
    if (selectedCategory) fetchFoodsByCategory(selectedCategory);
  }, [selectedCategory]);

  const fetchFoodsByCategory = async (cat) => {
    setFoodLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/food/category/${encodeURIComponent(cat.name)}`);
      const data = await res.json();
      setCategoryFoods(res.ok ? (data.foods || []) : []);
    } catch { setCategoryFoods([]); }
    finally  { setFoodLoading(false); }
  };

  // ── open panel ──
  const openPanel = (cat) => {
    setFormError(""); setFormSuccess("");
    setFormData({ name: "", price: "", description: "", image: "", isVeg: true });
    setSelectedCategory(cat);
  };

  const closePanel = () => setSelectedCategory(null);

  // ── add food ──
  const handleAddFood = async (e) => {
    e.preventDefault();
    setFormError(""); setFormSuccess("");
    if (!formData.name || !formData.price) { setFormError("Name and price required."); return; }
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/api/food/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ ...formData, category: selectedCategory.name, price: Number(formData.price) }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(`✅ ${formData.name} added!`);
        setFormData({ name: "", price: "", description: "", image: "", isVeg: true });
        fetchFoodsByCategory(selectedCategory);
      } else { setFormError(data.message || "Failed to add food"); }
    } catch { setFormError("Server Error"); }
    finally  { setSubmitting(false); }
  };

  // ── delete food ──
  const handleDeleteFood = async (foodId, foodName) => {
    if (!confirm(`"${foodName}" delete karvu che?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/food/${foodId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) fetchFoodsByCategory(selectedCategory);
    } catch { alert("Delete failed"); }
  };

  // ── delete user ──
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setStats((p) => p ? { ...p, totalUsers: p.totalUsers - 1 } : p);
      }
    } catch { alert("Delete failed"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin"); localStorage.removeItem("adminToken"); navigate("/admin");
  };

  if (!adminToken) return null;

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-4 h-4 fill-white">
                  <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-orange-500 hidden sm:block">Admin Panel</span>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {["overview","food","users"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all capitalize ${
                    activeTab === tab ? "bg-white text-orange-500 shadow" : "text-gray-500"
                  }`}>
                  {tab === "overview" ? "📊 Overview" : tab === "food" ? "🍽️ Food" : "👥 Users"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">👤 {admin?.name}</span>
            <button onClick={handleLogout}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Dashboard Overview</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-6">{error}</div>}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "👥", val: stats?.totalUsers  ?? 0, label: "Total Users",    bg: "bg-blue-100"   },
                { icon: "🛡️", val: stats?.totalAdmins ?? 0, label: "Total Admins",   bg: "bg-orange-100" },
                { icon: "🍽️", val: CATEGORIES.length,       label: "Categories",     bg: "bg-green-100"  },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{s.val}</p>
                  <p className="text-sm text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Recent Users</h2>
            </div>
            {users.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No users found.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {users.slice(0, 5).map((u) => (
                  <div key={u._id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600">{u.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOOD TAB ── */}
      {activeTab === "food" && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Food Management</h1>
          <p className="text-sm text-gray-400 mb-6">Category ઉપર click કરો — add form ખૂલશે</p>

          {/* ── Two-column layout ── */}
          <div className="flex gap-6 items-start">

            {/* LEFT: Category grid */}
            <div className={`transition-all duration-300 ${selectedCategory ? "w-1/2" : "w-full"}`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => isSelected ? closePanel() : openPanel(cat)}
                      className={`relative flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl border-2 transition-all duration-200 group
                        ${isSelected
                          ? "border-orange-400 bg-orange-50 shadow-md scale-[1.02]"
                          : "border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-sm"
                        }`}
                    >
                      <span className="text-3xl">{cat.emoji}</span>
                      <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? "text-orange-600" : "text-gray-700"}`}>
                        {cat.name}
                      </span>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-400"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Slide-in Panel */}
            {selectedCategory && (
              <div className="w-1/2 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-orange-50">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedCategory.emoji}</span>
                      <div>
                        <p className="text-sm font-extrabold text-gray-900">{selectedCategory.name}</p>
                        <p className="text-xs text-gray-400">
                          {foodLoading ? "Loading..." : `${categoryFoods.length} items`}
                        </p>
                      </div>
                    </div>
                    <button onClick={closePanel}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-lg font-bold">
                      ×
                    </button>
                  </div>

                  {/* Add Form */}
                  <div className="p-5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">New Item Add Karo</p>

                    {formError   && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2 mb-3">{formError}</div>}
                    {formSuccess && <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-xl px-3 py-2 mb-3">{formSuccess}</div>}

                    <form onSubmit={handleAddFood} className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Food Name *</label>
                          <input type="text" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Paneer Masala" required
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"/>
                        </div>
                        <div className="w-28">
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Price ₹ *</label>
                          <input type="number" value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="250" required min="1"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"/>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                        <textarea value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Short description..." rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"/>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Image URL</label>
                        <input type="url" value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"/>
                      </div>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFormData({ ...formData, isVeg: true })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                            formData.isVeg ? "border-green-500 bg-green-50 text-green-600" : "border-gray-200 text-gray-400"}`}>
                          🟢 Veg
                        </button>
                        <button type="button" onClick={() => setFormData({ ...formData, isVeg: false })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                            !formData.isVeg ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-400"}`}>
                          🔴 Non-Veg
                        </button>
                      </div>

                      {formData.image && (
                        <div className="rounded-xl overflow-hidden h-24 bg-gray-100">
                          <img src={formData.image} alt="preview" className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}/>
                        </div>
                      )}

                      <button type="submit" disabled={submitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                        {submitting ? "Adding..." : `+ Add to ${selectedCategory.name}`}
                      </button>
                    </form>
                  </div>

                  {/* Food List in this category */}
                  <div className="max-h-72 overflow-y-auto">
                    {foodLoading ? (
                      <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
                    ) : categoryFoods.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        <div className="text-3xl mb-2">🍽️</div>
                        No items yet
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {categoryFoods.map((food) => (
                          <div key={food._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-all">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              {food.image
                                ? <img src={food.image} alt={food.name} className="w-full h-full object-cover"/>
                                : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">{food.name}</p>
                              <p className="text-xs font-bold text-orange-500">₹{food.price}
                                <span className={`ml-2 font-semibold ${food.isVeg ? "text-green-500" : "text-red-500"}`}>
                                  {food.isVeg ? "● Veg" : "● Non-Veg"}
                                </span>
                              </p>
                            </div>
                            <button onClick={() => handleDeleteFood(food._id, food.name)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-all flex-shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === "users" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Users ({users.length})</h1>
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No users registered yet.</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {users.map((u) => (
                  <div key={u._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-orange-600">{u.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      {u.phone && <p className="text-xs text-gray-400">{u.phone}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteUser(u._id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}