const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

// Auth
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Dashboard (protected)
router.get("/dashboard", protect, getDashboardStats);
router.get("/users", protect, getAllUsers);
router.delete("/users/:userId", protect, deleteUser);

module.exports = router;