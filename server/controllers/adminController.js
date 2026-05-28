// controllers/adminController.js

const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER ADMIN =================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    // Validation
    if (!name || !email || !password || !secretCode) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Secret Code Check
    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(401).json({
        message: "Invalid Admin Secret Code",
      });
    }

    // Existing Admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    // Token
    const token = generateToken(admin._id);

    // Response
    res.status(201).json({
      message: "Admin Registered Successfully",
      token,
      admin,
    });

  } catch (error) {
    console.log("Admin Register Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN ADMIN =================
const loginAdmin = async (req, res) => {
  try {
    const { email, password, secretCode } = req.body;

    // Secret Code Check
    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(401).json({
        message: "Invalid Admin Secret Code",
      });
    }

    // Check Admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    // Password Check
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // Generate Token
    const token = generateToken(admin._id);

    // Response
    res.status(200).json({
      message: "Admin Login Successful",
      token,
      admin,
    });

  } catch (error) {
    console.log("Admin Login Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DASHBOARD STATS =================
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalAdmins] = await Promise.all([
      User.countDocuments(),
      Admin.countDocuments(),
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        totalAdmins,
      },
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.log("Get Users Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Delete User Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
};