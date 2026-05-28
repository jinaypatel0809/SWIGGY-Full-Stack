import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ================= CATEGORIES =================

const CATEGORIES = [
  { id: 1, name: "North Indian", emoji: "🍛" },
  { id: 2, name: "South Indian", emoji: "🥘" },
  { id: 3, name: "Chinese", emoji: "🍜" },
  { id: 4, name: "Pizza", emoji: "🍕" },
  { id: 5, name: "Burger", emoji: "🍔" },
  { id: 6, name: "Biryani", emoji: "🍚" },
  { id: 7, name: "Desserts", emoji: "🍰" },
  { id: 8, name: "Rolls", emoji: "🌯" },
  { id: 9, name: "Dosa", emoji: "🫓" },
  { id: 10, name: "Pasta", emoji: "🍝" },
  { id: 11, name: "Noodles", emoji: "🍜" },
  { id: 12, name: "Shake", emoji: "🥤" },
  { id: 13, name: "Coffee", emoji: "☕" },
  { id: 14, name: "Lassi", emoji: "🥛" },
  { id: 15, name: "Ice Cream", emoji: "🍦" },
  { id: 16, name: "Salad", emoji: "🥗" },
  { id: 17, name: "Paratha", emoji: "🫓" },
  { id: 18, name: "Vadapav", emoji: "🍔" },
  { id: 19, name: "Cake", emoji: "🎂" },
  { id: 20, name: "Khichdi", emoji: "🍲" },
];

// ================= API BASE =================

const API_BASE = "https://swiggy-full-stack.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ================= ADMIN =================

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const adminToken = localStorage.getItem("adminToken");

  // ================= STATES =================

  const [activeTab, setActiveTab] = useState("food");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FOOD STATES =================

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [categoryFoods, setCategoryFoods] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    isVeg: true,
  });

  // ================= AUTH CHECK =================

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin");
    }
  }, [adminToken, navigate]);

  // ================= FETCH DASHBOARD =================

  useEffect(() => {
    if (!adminToken) return;

    const fetchDashboardData = async () => {
      try {
        const [dashRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/dashboard`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          fetch(`${API_BASE}/api/admin/users`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        ]);

        const dashData = await dashRes.json();
        const usersData = await usersRes.json();

        if (dashRes.ok) setStats(dashData.stats);
        if (usersRes.ok) setUsers(usersData.users || []);
      } catch (error) {
        console.log(error);
        setError("Server connect nathi thayu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminToken]);

  // ================= FETCH CATEGORY FOODS =================

  useEffect(() => {
    if (selectedCategory?.name) {
      fetchFoodsByCategory();
    }
  }, [selectedCategory]);

  // ================= FETCH FOODS =================

  const fetchFoodsByCategory = async () => {
    setFoodLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/food/category/${encodeURIComponent(selectedCategory.name)}`
      );
      const data = await res.json();
      if (res.ok) {
        setCategoryFoods(data.foods || []);
      } else {
        setCategoryFoods([]);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      setCategoryFoods([]);
    } finally {
      setFoodLoading(false);
    }
  };

  // ================= ADD FOOD =================

  const handleAddFood = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.name || !formData.price) {
      setFormError("Name and price required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/food/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          ...formData,
          category: selectedCategory.name,
          price: Number(formData.price),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormSuccess(`${formData.name} added successfully!`);
        setFormData({ name: "", price: "", description: "", image: "", isVeg: true });
        fetchFoodsByCategory();
        // Update food count in stats
        setStats((prev) => prev ? { ...prev, totalFoods: (prev.totalFoods || 0) + 1 } : prev);
      } else {
        setFormError(data.message || "Failed to add food");
      }
    } catch (error) {
      console.log(error);
      setFormError("Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE FOOD =================

  const handleDeleteFood = async (foodId, foodName) => {
    const confirmDelete = confirm(`"${foodName}" delete karvu che?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/food/${foodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.ok) {
        fetchFoodsByCategory();
        setStats((prev) => prev ? { ...prev, totalFoods: Math.max(0, (prev.totalFoods || 1) - 1) } : prev);
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  // ================= DELETE USER =================

  const handleDeleteUser = async (userId) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setStats((prev) => prev ? ({ ...prev, totalUsers: prev.totalUsers - 1 }) : prev);
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  // ================= GUARD =================

  if (!adminToken) return null;

  // ================= RETURN =================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between">

          {/* Left: Logo + Tabs */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-4 h-4 fill-white">
                  <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-orange-500 hidden sm:block">Admin Panel</span>
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "overview" ? "bg-white text-orange-500 shadow" : "text-gray-500"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("food")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "food" ? "bg-white text-orange-500 shadow" : "text-gray-500"
                }`}
              >
                🍽️ Food
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "users" ? "bg-white text-orange-500 shadow" : "text-gray-500"
                }`}
              >
                👥 Users
              </button>
            </div>
          </div>

          {/* Right: Admin name + Logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">
              👤 {admin?.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= OVERVIEW TAB ================= */}

      {activeTab === "overview" && (
        <div className="max-w-5xl mx-auto px-4 py-8">

          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Dashboard Overview</h1>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-xl">👥</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{stats?.totalUsers ?? 0}</p>
                <p className="text-sm text-gray-400 mt-1">Total Users</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-xl">🛡️</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{stats?.totalAdmins ?? 0}</p>
                <p className="text-sm text-gray-400 mt-1">Total Admins</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-xl">🍽️</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{CATEGORIES.length}</p>
                <p className="text-sm text-gray-400 mt-1">Categories</p>
              </div>

            </div>
          )}

          {/* Recent Users */}
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
                        <span className="text-sm font-bold text-orange-600">
                          {u.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FOOD TAB ================= */}

      {activeTab === "food" && (
        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Food Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT: Category Picker + Add Form */}
            <div className="lg:col-span-1 space-y-5">

              {/* Category Selector */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-700">Select Category</h2>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all ${
                        selectedCategory.id === cat.id
                          ? "bg-orange-50 text-orange-600 font-bold"
                          : "text-gray-700 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Food Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-4">
                  Add Food to <span className="text-orange-500">{selectedCategory.emoji} {selectedCategory.name}</span>
                </h2>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2 mb-4">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-xl px-3 py-2 mb-4">
                    ✅ {formSuccess}
                  </div>
                )}

                <form onSubmit={handleAddFood} className="space-y-3">

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Food Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Paneer Butter Masala"
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 250"
                      required
                      min="1"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Short description..."
                      rows={2}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  {/* Veg / Non-Veg */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isVeg: true })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          formData.isVeg
                            ? "border-green-500 bg-green-50 text-green-600"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        🟢 Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isVeg: false })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          !formData.isVeg
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        🔴 Non-Veg
                      </button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="rounded-xl overflow-hidden h-28 bg-gray-100">
                      <img
                        src={formData.image}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all"
                  >
                    {submitting ? "Adding..." : `Add to ${selectedCategory.name}`}
                  </button>

                </form>
              </div>
            </div>

            {/* RIGHT: Food List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-700">
                    {selectedCategory.emoji} {selectedCategory.name} — {categoryFoods.length} items
                  </h2>
                  <button
                    onClick={fetchFoodsByCategory}
                    className="text-xs text-orange-500 hover:underline font-semibold"
                  >
                    Refresh
                  </button>
                </div>

                {foodLoading ? (
                  <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
                ) : categoryFoods.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-4xl mb-3">🍽️</div>
                    <p className="text-gray-500 font-semibold">No items in {selectedCategory.name}</p>
                    <p className="text-gray-400 text-xs mt-1">Add your first item using the form.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {categoryFoods.map((food) => (
                      <div key={food._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all">

                        {/* Image */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {food.image ? (
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-800 truncate">{food.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                              food.isVeg
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}>
                              {food.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                            </span>
                          </div>
                          {food.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{food.description}</p>
                          )}
                          <p className="text-sm font-extrabold text-orange-500 mt-1">₹{food.price}</p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteFood(food._id, food.name)}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= USERS TAB ================= */}

      {activeTab === "users" && (
        <div className="max-w-4xl mx-auto px-4 py-8">

          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
            Users ({users.length})
          </h1>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No users registered yet.</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {users.map((u) => (
                  <div key={u._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all">

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-orange-600">
                        {u.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      {u.phone && (
                        <p className="text-xs text-gray-400">{u.phone}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                      title="Delete User"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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