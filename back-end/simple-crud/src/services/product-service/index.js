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

// Logging middleware
app.use(httpLogger);
app.use(requestLogger);

// Service identification
app.use((req, res, next) => {
  res.setHeader("X-Service-Name", "product-service");
  res.setHeader("X-Service-Version", "1.0.0");
  next();
});

// Routes
app.use("/api", productRoutes);

// Health check endpoint
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

// Service info endpoint
app.get("/", (req, res) => {
  res.json({
    service: "Product Microservice",
    version: "1.0.0",
    endpoints: [
      "GET /api/products - Get all products",
      "GET /api/product/:id - Get product by ID",
      "POST /api/products - Create new product",
      "PUT /api/product/:id - Update product",
      "DELETE /api/product/:id - Delete product",
    ],
  });
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error",
    service: "product-service",
  });
});

// Database Connection and Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB database successfully", {
      database: "Node-API",
      host: "backend-db.bihfz7h.mongodb.net",
    });

    app.listen(PORT, () => {
      logger.info(`Product Service is running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
      });
    });
  })
  .catch((error) => {
    logger.error("Database connection failed", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  app.close(() => {
    logger.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app;
