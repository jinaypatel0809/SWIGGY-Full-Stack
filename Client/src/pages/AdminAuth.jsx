import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ================= API BASE =================

const API_BASE = "https://swiggy-full-stack.onrender.com/api/admin";

export default function AdminAuth() {

  const navigate = useNavigate();

  // ================= STATES =================

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    adminCode: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Password Match

    if (!isLogin && form.password !== form.confirmPassword) {

      setError("Passwords do not match!");

      return;
    }

    setLoading(true);

    setError("");

    try {

      // ================= ENDPOINT =================

      const endpoint = isLogin
        ? `${API_BASE}/login`
        : `${API_BASE}/register`;

      // ================= BODY =================

      const body = isLogin
        ? {
            email: form.email,
            password: form.password,
            secretCode: form.adminCode,
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            secretCode: form.adminCode,
          };

      // ================= FETCH =================

      const res = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      // ================= RESPONSE =================

      const data = await res.json();

      console.log(data);

      if (!res.ok) {

        setError(data.message || "Something went wrong");

        return;
      }

      // ================= SAVE DATA =================

      localStorage.setItem("adminToken", data.token);

      localStorage.setItem("admin", JSON.stringify(data.admin));

      // ================= LOGIN =================

      if (isLogin) {

        navigate("/admin-dashboard");

      } else {

        // Register Success

        alert("Admin account created successfully!");

        setIsLogin(true);

        setForm({
          name: "",
          email: "",
          adminCode: "",
          password: "",
          confirmPassword: "",
        });
      }

    } catch (err) {

      console.log(err);

      setError("Server connect nathi thayu. Backend check karo.");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8">

        {/* ================= LOGO ================= */}

        <div className="flex items-center justify-center gap-2 mb-2">

          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">

            <svg
              viewBox="0 0 36 36"
              className="w-5 h-5 fill-white"
            >
              <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z" />
            </svg>

          </div>

          <span className="text-2xl font-bold text-orange-500">
            swiggy
          </span>

        </div>

        {/* ================= BADGE ================= */}

        <div className="flex justify-center mb-5">

          <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
            Admin Portal
          </span>

        </div>

        {/* ================= TITLE ================= */}

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">

          {isLogin ? "Admin Sign In" : "Admin Sign Up"}

        </h1>

        <p className="text-sm text-gray-400 text-center mb-6">

          {isLogin
            ? "Access your admin dashboard"
            : "Create your admin account"}

        </p>

        {/* ================= TOGGLE ================= */}

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">

          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isLogin
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-400"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLogin
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-400"
            }`}
          >
            Sign Up
          </button>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}

          {!isLogin && (
            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />

            </div>
          )}

          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />

          </div>

          {/* SECRET CODE */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Admin Secret Code
            </label>

            <input
              type="text"
              name="adminCode"
              value={form.adminCode}
              onChange={handleChange}
              required
              placeholder="Enter admin secret code"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />

          </div>

          {/* CONFIRM PASSWORD */}

          {!isLogin && (
            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />

            </div>
          )}

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all"
          >

            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Admin Account"}

          </button>

        </form>

        {/* ================= TOGGLE TEXT ================= */}

        <p className="text-center text-sm text-gray-400 mt-6">

          {isLogin
            ? "Need an admin account?"
            : "Already have an account?"}

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="ml-1 text-orange-500 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>

        </p>

        {/* ================= BACK BUTTON ================= */}

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-5 text-xs text-gray-400 hover:text-gray-600 transition-all"
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}