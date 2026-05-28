import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://swiggy-full-stack.onrender.com/api/user";

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (isLogin) {
        window.location.href = "/";
      } else {
        // Register pachi login page par redirect
        setIsLogin(true);
        setForm({ name: "", email: "", phone: "", password: "" });
        setError("");
        alert("Account created! Please sign in.");
      }
    } catch (err) {
      setError("Server connect nathi thayu. Server chalu che ke nahi check karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-5 h-5 fill-white">
              <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-orange-500">swiggy</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800 text-center mb-1">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          {isLogin ? "Sign in to continue" : "Sign up to get started"}
        </p>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-white text-orange-500 shadow-sm" : "text-gray-400"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-white text-orange-500 shadow-sm" : "text-gray-400"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <input
                name="name" type="text" value={form.name} onChange={handleChange}
                required={!isLogin} placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              required placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                name="phone" type="tel" value={form.phone} onChange={handleChange}
                required={!isLogin} placeholder="Enter your phone"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-600">Password</label>
              {isLogin && (
                <button type="button" className="text-xs text-orange-500 hover:underline">Forgot password?</button>
              )}
            </div>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              required placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-all mt-2"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-orange-500 font-semibold hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-1 w-full mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}