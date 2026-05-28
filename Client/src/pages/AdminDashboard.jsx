import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const adminToken = localStorage.getItem("adminToken");

  const [activeTab, setActiveTab] = useState("food");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [categoryFoods, setCategoryFoods] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", description: "", image: "", isVeg: true });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!adminToken) navigate("/admin");
  }, [adminToken, navigate]);

  useEffect(() => {
    if (!adminToken) return;
    const fetchData = async () => {
      try {
        const [dashRes, usersRes] = await Promise.all([
          fetch("https://swiggy-full-stack.onrender.com/api/admin/dashboard", { headers: { Authorization: `Bearer ${adminToken}` } }),
          fetch("https://swiggy-full-stack.onrender.com/api/admin/users", { headers: { Authorization: `Bearer ${adminToken}` } }),
        ]);
        const dashData = await dashRes.json();
        const usersData = await usersRes.json();
        if (dashRes.ok) setStats(dashData.stats);
        if (usersRes.ok) setUsers(usersData.users);
      } catch {
        setError("Server connect nathi thayu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [adminToken]);

  useEffect(() => {
    fetchFoodsByCategory(selectedCategory.name);
  }, [selectedCategory]);

  const fetchFoodsByCategory = async (categoryName) => {
    setFoodLoading(true);
    try {
      const res = await fetch(`https://swiggy-full-stack.onrender.com/api/food/category/${encodeURIComponent(categoryName)}`);
      const data = await res.json();
      setCategoryFoods(data.foods || []);
    } catch {
      setCategoryFoods([]);
    } finally {
      setFoodLoading(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    setFormError(""); setFormSuccess("");
    if (!formData.name || !formData.price) { setFormError("Name and price are required."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("https://swiggy-full-stack.onrender.com/api/food/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ ...formData, category: selectedCategory.name, price: Number(formData.price) }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(`"${formData.name}" added successfully!`);
        setFormData({ name: "", price: "", description: "", image: "", isVeg: true });
        fetchFoodsByCategory(selectedCategory.name);
      } else {
        setFormError(data.message || "Failed to add food.");
      }
    } catch { setFormError("Server error. Try again."); }
    finally { setSubmitting(false); }
  };

  const handleDeleteFood = async (foodId, foodName) => {
    if (!confirm(`"${foodName}" delete karvu che?`)) return;
    try {
      const res = await fetch(`https://swiggy-full-stack.onrender.com/api/food/${foodId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) fetchFoodsByCategory(selectedCategory.name);
    } catch { alert("Delete failed."); }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); localStorage.removeItem("admin"); navigate("/admin");
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://swiggy-full-stack.onrender.com/api/admin/users/${userId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) { setUsers(users.filter((u) => u._id !== userId)); setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 })); }
    } catch { alert("Delete failed."); }
  };

  if (!adminToken) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">Admin Dashboard</span>
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1 ml-2">
              <button onClick={() => setActiveTab("overview")} className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "overview" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Overview</button>
              <button onClick={() => setActiveTab("food")} className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "food" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Food Management</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-orange-600">{admin?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{admin?.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* FOOD MANAGEMENT */}
      {activeTab === "food" && (
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar */}
          <div className="w-56 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
            <div className="px-4 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
            </div>
            <div className="py-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat); setFormError(""); setFormSuccess(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${selectedCategory.id === cat.id ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{selectedCategory.emoji}</span>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">{selectedCategory.name}</h2>
                <p className="text-xs text-gray-400">{categoryFoods.length} items added</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* ADD FORM */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  Add {selectedCategory.name} Food
                </h3>
                {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{formError}</div>}
                {formSuccess && <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-4">✅ {formSuccess}</div>}
                <form onSubmit={handleAddFood} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Food Name *</label>
                    <input type="text" placeholder="e.g. Butter Chicken" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Price (₹) *</label>
                    <input type="number" placeholder="e.g. 280" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
                    <textarea placeholder="Short description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Image URL</label>
                    <input type="text" placeholder="https://example.com/food.jpg" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Type</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setFormData({ ...formData, isVeg: true })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.isVeg ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}>
                        <span className="w-3 h-3 rounded-sm border-2 border-green-600 flex items-center justify-center bg-white"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span></span>Veg
                      </button>
                      <button type="button" onClick={() => setFormData({ ...formData, isVeg: false })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${!formData.isVeg ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500"}`}>
                        <span className="w-3 h-3 rounded-sm border-2 border-red-600 flex items-center justify-center bg-white"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span></span>Non-Veg
                      </button>
                    </div>
                  </div>
                  {formData.image && (
                    <div className="rounded-xl overflow-hidden border border-gray-100">
                      <img src={formData.image} alt="preview" className="w-full h-32 object-cover" onError={(e) => e.target.style.display = "none"} />
                    </div>
                  )}
                  <button type="submit" disabled={submitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                    {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Adding...</> : <>+ Add Food</>}
                  </button>
                </form>
              </div>

              {/* FOOD LIST */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-extrabold text-gray-900">{selectedCategory.name} Items</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{categoryFoods.length} food items</p>
                </div>
                {foodLoading ? (
                  <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>)}</div>
                ) : categoryFoods.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="text-5xl mb-3">{selectedCategory.emoji}</span>
                    <p className="text-sm font-semibold text-gray-500">No {selectedCategory.name} items yet</p>
                    <p className="text-xs text-gray-400 mt-1">Add your first item using the form</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {categoryFoods.map((food) => (
                      <div key={food._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {food.image ? <img src={food.image} alt={food.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">{selectedCategory.emoji}</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900 truncate">{food.name}</p>
                            <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${food.isVeg ? "border-green-600" : "border-red-600"} flex items-center justify-center`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? "bg-green-600" : "bg-red-600"}`}></span>
                            </span>
                          </div>
                          {food.description && <p className="text-xs text-gray-400 truncate mt-0.5">{food.description}</p>}
                          <p className="text-sm font-extrabold text-orange-500 mt-1">₹{food.price}</p>
                        </div>
                        <button onClick={() => handleDeleteFood(food._id, food.name)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back, {admin?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-sm text-gray-400 mt-1">Here's what's happening on your platform.</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse"><div className="h-4 bg-gray-100 rounded w-1/2 mb-3"></div><div className="h-8 bg-gray-100 rounded w-1/3"></div></div>)}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 mb-4">Total Users</p>
                <p className="text-3xl font-extrabold text-gray-900">{stats?.totalUsers ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Registered users</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 mb-4">Total Admins</p>
                <p className="text-3xl font-extrabold text-gray-900">{stats?.totalAdmins ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Admin accounts</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 mb-4">Admin Email</p>
                <p className="text-sm font-bold text-gray-900 truncate">{admin?.email}</p>
                <p className="text-xs text-gray-400 mt-1">Your account</p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-extrabold text-gray-900">All Users</h2>
              <p className="text-xs text-gray-400 mt-0.5">{users.length} total users</p>
            </div>
            {users.length === 0 ? <div className="py-16 text-center text-sm text-gray-400">No users yet</div> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="bg-gray-50">{["#","Name","Email","Phone","Joined","Action"].map(h => <th key={h} className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-left">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u, i) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-400">{i+1}</td>
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-orange-600">{u.name?.charAt(0).toUpperCase()}</span></div><span className="text-sm font-semibold text-gray-800">{u.name}</span></div></td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.phone || "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
                        <td className="px-6 py-4"><button onClick={() => handleDeleteUser(u._id)} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}