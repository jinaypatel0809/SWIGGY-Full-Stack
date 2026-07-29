import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLogin from './pages/AdminLogin/AdminLogin'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import AdminRegister from './pages/AdminRegister/AdminRegister'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Brand from './pages/Brand/Brand'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import OrderConfirmed from './pages/OrderConfirmed/OrderConfirmed'
import Profile from './pages/Profile/Profile'
import AdminOrders from './pages/AdminOrders/AdminOrders'
import Checkout from './pages/Checkout/Checkout'
import Orders from './pages/Orders/Orders'
import RestaurantDetails from './pages/RestaurantDetails/RestaurantDetails'
import Search from './pages/Search/Search'
import AdminAnalytics from './pages/AdminAnalytics/AdminAnalytics'
import Wishlist from './pages/Wishlist/Wishlist'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/brands/:brandSlug" element={<Brand />} />
        <Route path="/forgot-password/:role" element={<ForgotPassword />} />
        <Route path="/order-confirmed/:orderId" element={<OrderConfirmed />} />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          )}
        />
        <Route path="/checkout" element={<ProtectedRoute role="user"><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="user"><Orders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute role="user"><Wishlist /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/sign-up" element={<AdminRegister />} />
        <Route
          path="/admin/dashboard"
          element={(
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/dashboard/:contentType"
          element={(
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/orders"
          element={(
            <ProtectedRoute role="admin">
              <AdminOrders />
            </ProtectedRoute>
          )}
        />
        <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
