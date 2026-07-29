import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'zomato-clone-cart'

function readStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const navigate = useNavigate()
  const { user } = useAuth()

  const updateItems = (updater) => {
    setItems((currentItems) => {
      const nextItems = updater(currentItems)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems))
      return nextItems
    })
  }

  const addItem = (item) => {
    if (!user || user.role !== 'user') {
      navigate('/login', {
        state: { message: 'Please log in before adding items to your cart.' },
      })
      return false
    }
    updateItems((currentItems) => {
      const existingItem = currentItems.find((current) => current.id === item.id)
      if (existingItem) {
        return currentItems.map((current) =>
          current.id === item.id ? { ...current, quantity: current.quantity + 1 } : current,
        )
      }
      return [...currentItems, { ...item, quantity: 1 }]
    })
    return true
  }

  const removeItem = (id) => updateItems((currentItems) => currentItems.filter((item) => item.id !== id))
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeItem(id)
    updateItems((currentItems) => currentItems.map((item) => (
      item.id === id ? { ...item, quantity } : item
    )))
  }
  const clearCart = () => updateItems(() => [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = { items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
