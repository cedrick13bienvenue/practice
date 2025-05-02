const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// READ all
router.get("/products", getAllProducts);

// READ one
router.get("/product/:id", getProductById);

// CREATE
router.post("/products", createProduct);

// UPDATE
router.put("/product/:id", updateProduct);

// DELETE
router.delete("/product/:id", deleteProduct);

module.exports = router;
