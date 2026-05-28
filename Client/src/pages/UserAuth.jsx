import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://swiggy-full-stack.onrender.com/api/user";

export default function UserAuth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password Match
    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Password Length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin
        ? `${API_BASE}/login`
        : `${API_BASE}/register`;

      const body = isLogin
        ? {
            email: form.email,
            password: form.password,
          }
        : {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // Save User
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Login Success
      if (isLogin) {
        setSuccess("Login successful!");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }

      // Register Success
      else {
        setSuccess("Account created successfully!");

        setTimeout(() => {
          setIsLogin(true);
          resetForm();
          setSuccess("");
        }, 1500);
      }
    } catch (err) {
      console.log(err);

      setError(
        "Server connect nathi thayu. Server chalu che ke nahi check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-8 text-center">

          {/* Logo */}
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <svg viewBox="0 0 36 36" className="w-9 h-9 fill-orange-500">
              <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-white">
            swiggy
          </h1>

          <p className="text-orange-100 text-sm mt-2">
            {isLogin
              ? "Login to continue ordering delicious food 🍔"
              : "Create your account and start exploring 🍕"}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">

          {/* Toggle Buttons */}
          <div className="flex bg-orange-50 rounded-2xl p-1 mb-7">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                isLogin
                  ? "bg-white text-orange-500 shadow-md"
                  : "text-gray-500"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                !isLogin
                  ? "bg-white text-orange-500 shadow-md"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-2xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm font-medium rounded-2xl px-4 py-3 mb-5">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>

            {/* Phone */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>

                {isLogin && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-orange-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7 1-3 5-7 10-7 1.03 0 2.02.17 2.94.48M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7 1-3 5-7 10-7 1.03 0 2.02.17 2.94.48M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-95 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98]"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Bottom Text */}
          <p className="text-center text-sm text-gray-500 mt-7">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="ml-1 font-bold text-orange-500 hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-5 flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}