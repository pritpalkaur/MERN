const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const generateToken = require('../config/jwt');
const protect = require('../middleware/authMiddleware');

// -----------------------------
// INSERT a new user into the database
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    //console.log("✅ User inserted:", savedUser);
    res.status(201).json(savedUser);

  } catch (err) {
    console.error("❌ Error inserting user:", err.message);
    res.status(500).json({ message: "Server error while inserting user" });
  }
});
// -----------------------------
// GET all users from the database
// -----------------------------
router.get("/", async (req, res) => {
  try {
    //console.log("📦 Fetching all users...");
    const users = await User.find();
     //console.log(users);
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = new User({ name, email, password });
  await user.save(); // <-- triggers pre('save') hook

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});
// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //console.log("🔑 User login attempt:", user);
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected route// GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("name email");
 // console.log("👤 User profile accessed:", user);
  res.json(user);
});
// -----------------------------
// DELETE a user by ID
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🗑️ User deleted:", deletedUser);
    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("❌ Error deleting user:", err.message);
    res.status(500).json({ message: "Server error while deleting user  " });
  }
});
// -----------------------------
// UPDATE a user by ID
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //console.log("✏️ Update request for user ID: this is test", req.body);
    // Find user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // will be hashed by pre('save') hook

    // Save updated user
    const updatedUser = await user.save();

    //console.log("✏️ User updated:", updatedUser);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ message: "Server error while updating user" });
  }
});


module.exports = router;