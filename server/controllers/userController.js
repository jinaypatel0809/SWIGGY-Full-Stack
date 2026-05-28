// controllers/userController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    // Generate Token
    const token = generateToken(user._id);

    // Response
    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user,
    });

  } catch (error) {
    console.log("Register Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // Check Password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // Generate Token
    const token = generateToken(user._id);

    // Response
    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};