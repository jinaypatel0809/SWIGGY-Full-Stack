const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://swiggy-full-stack.onrender.com/api' : '/api')

export async function apiRequest(path, options = {}) {
  const tokenKey = options.authRole === 'admin'
    ? 'zomato-clone-admin-token'
    : 'zomato-clone-user-token'
  const token = localStorage.getItem(tokenKey)
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const { authRole: _authRole, ...fetchOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }

  return data
}
