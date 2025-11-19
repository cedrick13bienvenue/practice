const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const validateProduct = require("../middleware/validateProduct");

// Routes
router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);
router.post("/products", validateProduct, createProduct); // validation added here
router.put("/product/:id", validateProduct, updateProduct); // validation added here
router.delete("/product/:id", deleteProduct);

module.exports = router;
