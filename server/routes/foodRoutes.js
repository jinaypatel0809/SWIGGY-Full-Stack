const express = require("express");
const router = express.Router();
const { addFood, getAllFoods, getFoodsByCategory, updateFood, deleteFood } = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addFood);
router.get("/all", getAllFoods);
router.get("/category/:category", getFoodsByCategory);
router.put("/:id", protect, updateFood);
router.delete("/:id", protect, deleteFood);

module.exports = router;