require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("../config/logger");

const app = express();
const PORT = process.env.GATEWAY_PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

app.use(limiter);

// Gateway logging
app.use((req, res, next) => {
  logger.info("Gateway Request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Service Registry
const services = {
  product: {
    url: process.env.PRODUCT_SERVICE_URL || "http://localhost:3001",
    healthCheck: "/health",
  },
  user: {
    url: process.env.USER_SERVICE_URL || "http://localhost:3002",
    healthCheck: "/health",
  },
};

// Authentication middleware (simple example)
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    logger.warn("Missing API key", { ip: req.ip, url: req.url });
    return res.status(401).json({ error: "API key required" });
  }

  // In production, validate against database
  if (apiKey !== process.env.API_KEY) {
    logger.warn("Invalid API key", { ip: req.ip, url: req.url });
    return res.status(403).json({ error: "Invalid API key" });
  }

  logger.info("Authentication successful", { ip: req.ip });
  next();
};

// Product Service Routes
app.use(
  "/api/products",
  authenticate,
  createProxyMiddleware({
    target: services.product.url,
    changeOrigin: true,
    pathRewrite: {
      "^/api/products": "/api/products",
    },
    onProxyReq: (proxyReq, req) => {
      logger.info("Proxying to Product Service", {
        method: req.method,
        path: req.path,
        target: services.product.url,
      });
    },
    onProxyRes: (proxyRes, req) => {
      logger.info("Response from Product Service", {
        statusCode: proxyRes.statusCode,
        method: req.method,
        path: req.path,
      });
    },
    onError: (err, req, res) => {
      logger.error("Proxy Error - Product Service", {
        error: err.message,
        method: req.method,
        path: req.path,
      });
      res.status(503).json({
        error: "Product service unavailable",
        message: err.message,
      });
    },
  })
);

// User Service Routes (placeholder)
app.use(
  "/api/users",
  authenticate,
  createProxyMiddleware({
    target: services.user.url,
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "/api/users",
    },
    onError: (err, req, res) => {
      logger.error("Proxy Error - User Service", {
        error: err.message,
        method: req.method,
        path: req.path,
      });
      res.status(503).json({
        error: "User service unavailable",
        message: err.message,
      });
    },
  })
);

// Health check endpoint for gateway
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: Object.keys(services),
  });
});

// Gateway info
app.get("/", (req, res) => {
  res.json({
    message: "API Gateway",
    version: "1.0.0",
    services: {
      products: "/api/products",
      users: "/api/users",
    },
    documentation: "/docs",
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn("Route not found", { url: req.url, method: req.method });
  res.status(404).json({
    error: "Route not found",
    path: req.url,
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error("Gateway Error", {
    error: err.message,
    stack: err.stack,
    url: req.url,
  });

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    path: req.url,
  });
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info("Registered services:", { services: Object.keys(services) });
});

module.exports = app;
