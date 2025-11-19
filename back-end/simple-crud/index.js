require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./src/routes/product.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Adding  this for urlencoded forms

// Routes
app.use("/api", productRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Hello from Node API!");
});

// Database Connection and Server Start
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
