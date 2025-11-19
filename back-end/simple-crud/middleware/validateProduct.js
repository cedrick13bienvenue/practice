// middleware/validateProduct.js

module.exports = (req, res, next) => {
  const { name, price, quantity } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .json({
        message: "Product name is required and must be a non-empty string.",
      });
  }

  if (isNaN(price) || price < 0) {
    return res
      .status(400)
      .json({ message: "Product price must be a non-negative number." });
  }

  if (!Number.isInteger(Number(quantity)) || quantity < 0) {
    return res
      .status(400)
      .json({ message: "Product quantity must be a non-negative integer." });
  }

  next(); // Continue to controller
};
