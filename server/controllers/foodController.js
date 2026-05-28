const Food = require("../models/Food");

// ================= ADD FOOD =================
const addFood = async (req, res) => {
  try {
    const { name, category, price, description, image, isVeg } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category and price are required" });
    }

    const food = await Food.create({ name, category, price, description, image, isVeg });

    res.status(201).json({ message: "Food added successfully", food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL FOODS =================
const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.status(200).json({ foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET FOODS BY CATEGORY =================
const getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await Food.find({ category: { $regex: new RegExp(`^${category}$`, "i") } });
    res.status(200).json({ foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE FOOD =================
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    await Food.findByIdAndDelete(id);
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFood, getAllFoods, getFoodsByCategory, deleteFood };