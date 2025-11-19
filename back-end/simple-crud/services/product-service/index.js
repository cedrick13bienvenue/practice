require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("../../routes/product.routes");
const logger = require("../../config/logger");
const {
  httpLogger,
  requestLogger,
  errorLogger,
} = require("../../middleware/logger.middleware");

const app = express();
const PORT = process.env.PRODUCT_SERVICE_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(requestLogger);

app.use((req, res, next) => {
  res.setHeader("X-Service-Name", "product-service");
  res.setHeader("X-Service-Version", "1.0.0");
  next();
});

// Routes
app.use("/api", productRoutes);

// Health check
app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "Product Service is healthy",
    timestamp: Date.now(),
    service: "product-service",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };
  logger.info("Health check requested", healthcheck);
  res.status(200).json(healthcheck);
});

// Service info
app.get("/", (req, res) => {
  res.json({
    service: "Product Microservice",
    version: "1.0.0",
    port: PORT,
    endpoints: [
      "GET /api/products",
      "GET /api/product/:id",
      "POST /api/products",
      "PUT /api/product/:id",
      "DELETE /api/product/:id",
      "GET /health",
    ],
  });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
    service: "product-service",
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB database successfully");
    app.listen(PORT, () => {
      logger.info(`Product Service running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
      });
    });
  })
  .catch((error) => {
    logger.error("Database connection failed", { error: error.message });
    process.exit(1);
  });

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  mongoose.connection.close(false, () => {
    logger.info("MongoDB connection closed");
    process.exit(0);
  });
});

module.exports = app;
