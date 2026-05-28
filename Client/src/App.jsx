import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import UserAuth from "./pages/UserAuth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages WITH Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/category/:categoryName" element={<><Navbar /><CategoryPage /></>} />

        {/* Auth pages - NO Navbar (full screen) */}
        <Route path="/login" element={<UserAuth />} />
        <Route path="/admin" element={<AdminAuth />} />

        {/* Admin Dashboard - protected */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}