const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Fix for "open is not a function"
const open = require("open");   // open is an object, so we need .default

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/products", require("./routes/productRoutes"));

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Open API in Google Chrome
  await open.default(`http://localhost:${PORT}/api/products`, {
    app: {
      name: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    }
  });
});
