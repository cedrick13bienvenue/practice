require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Node API!");
});
// ----------------------------
// READ: Get all products
// Endpoint: GET /api/products
// ----------------------------
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// READ: Get a single product by ID
// Endpoint: GET /api/product/:id
// ----------------------------

app.get("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// CREATE: Add a new product
// Endpoint: POST /api/products
// ----------------------------

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// UPDATE: Update a product by ID
// Endpoint: PUT /api/product/:id
// ----------------------------

app.put("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// DELETE: Remove a product by ID
// Endpoint: DELETE /api/product/:id
// ----------------------------

app.delete("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// DATABASE CONNECTION + SERVER START
// ----------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })

  .catch(() => {
    console.log("Connection failed");
  });
