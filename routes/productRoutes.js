const express = require("express");
const router = express.Router();
const Product = require("../model/product");

// -----------------------------
// GET all products
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Server error while fetching products" });
  }
});
// -----------------------------
// GET a single product by ID
// -----------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("📦 Product fetched:", product);
    res.json(product);

  } catch (err) {
    console.error("❌ Error fetching product by ID:", err.message);
    res.status(500).json({ message: "Server error while fetching product" });
  }
});
// -----------------------------
// INSERT a new product
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const { Name, Price, Stock } = req.body;

    const newProduct = new Product({
      Name,
      Price,
      Stock
    });

    const savedProduct = await newProduct.save();
    console.log("✅ Product inserted:", savedProduct);
    res.status(201).json(savedProduct);

  } catch (err) {
    console.error("❌ Error inserting product:", err.message);
    res.status(500).json({ message: "Server error while inserting product" });
  }
});

// -----------------------------
// UPDATE a product by ID
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { Name, Price, Stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { Name, Price, Stock },
      { new: true } // return updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("🔄 Product updated:", updatedProduct);
    res.json(updatedProduct);

  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({ message: "Server error while updating product" });
  }
});

// -----------------------------
// DELETE a product by ID
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("🗑️ Product deleted:", deletedProduct);
    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ message: "Server error while deleting product" });
  }
});

module.exports = router;
