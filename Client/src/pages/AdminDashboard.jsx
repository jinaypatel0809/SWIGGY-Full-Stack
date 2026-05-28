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
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }),

          fetch(`${API_BASE}/api/admin/users`, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }),
        ]);

        const dashData = await dashRes.json();

        const usersData = await usersRes.json();

        console.log(dashData);

        console.log(usersData);

        if (dashRes.ok) {

          setStats(dashData.stats);
        }

        if (usersRes.ok) {

          setUsers(usersData.users || []);
        }

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

      console.log("Selected Category:", selectedCategory.name);

      const res = await fetch(
        `${API_BASE}/api/food/category/${encodeURIComponent(
          selectedCategory.name
        )}`
      );

      const data = await res.json();

      console.log("Foods Data:", data);

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

      console.log(data);

      if (res.ok) {

        setFormSuccess(`${formData.name} added successfully!`);

        setFormData({
          name: "",
          price: "",
          description: "",
          image: "",
          isVeg: true,
        });

        fetchFoodsByCategory();

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

    const confirmDelete = confirm(
      `"${foodName}" delete karvu che?`
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `${API_BASE}/api/food/${foodId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.ok) {

        fetchFoodsByCategory();
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

      const res = await fetch(
        `${API_BASE}/api/admin/users/${userId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.ok) {

        setUsers(users.filter((u) => u._id !== userId));

        setStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
        }));
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

  // ================= RETURN =================

  if (!adminToken) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">

        <div className="h-16 px-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <span className="text-sm font-bold text-orange-500">
              Admin Dashboard
            </span>

            <div className="flex bg-gray-100 rounded-xl p-1">

              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  activeTab === "overview"
                    ? "bg-white text-orange-500 shadow"
                    : "text-gray-500"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("food")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  activeTab === "food"
                    ? "bg-white text-orange-500 shadow"
                    : "text-gray-500"
                }`}
              >
                Food
              </button>

            </div>
          </div>

          <div className="flex items-center gap-4">

            <span className="text-sm font-semibold text-gray-700">
              {admin?.name}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>
    </div>
  );
}