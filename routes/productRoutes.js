const express = require("express");
const router = express.Router();
const Product = require("../model/product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message); // log error in console
    res.status(500).json({ message: "Server error while fetching products" });
  }
});
// Insert sample data
router.get("/seed", async (req, res) => {
  try {
    const sample = [
      { Name: "priti", Price: 100, Stock: 10 },
      { Name: "vasu", Price: 200, Stock: 20 },
      { Name: "priya", Price: 300, Stock: 30 },
      { Name: "balaji", Price: 400, Stock: 40 },
      { Name: "x", Price: 100, Stock: 10 }
    ];

    await Product.insertMany(sample);
    console.log("✅ Sample products inserted successfully");
    res.json({ message: "Sample data added" });
  } catch (err) {
    console.error("❌ Error inserting sample data:", err.message);
    res.status(500).json({ message: "Error inserting sample data" });
  }
});
module.exports = router;