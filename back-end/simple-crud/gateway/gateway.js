require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("../config/logger");

const app = express();
const PORT = process.env.GATEWAY_PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", { ip: req.ip, url: req.url });
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});

app.use(limiter);

app.use((req, res, next) => {
  logger.info("Gateway Request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

const services = {
  product: {
    url: process.env.PRODUCT_SERVICE_URL || "http://localhost:3001",
    healthCheck: "/health",
  },
};

const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    logger.warn("Missing API key", { ip: req.ip });
    return res.status(401).json({ error: "API key required" });
  }
  if (apiKey !== process.env.API_KEY) {
    logger.warn("Invalid API key", { ip: req.ip });
    return res.status(403).json({ error: "Invalid API key" });
  }
  logger.info("Authentication successful", { ip: req.ip });
  next();
};

app.use(
  "/api/products",
  authenticate,
  createProxyMiddleware({
    target: services.product.url,
    changeOrigin: true,
    pathRewrite: { "^/api/products": "/api" },
    onProxyReq: (proxyReq, req) => {
      logger.info("Proxying to Product Service", {
        method: req.method,
        path: req.path,
      });
    },
    onProxyRes: (proxyRes, req) => {
      logger.info("Response from Product Service", {
        statusCode: proxyRes.statusCode,
        method: req.method,
      });
    },
    onError: (err, req, res) => {
      logger.error("Proxy Error", { error: err.message });
      res.status(503).json({ error: "Product service unavailable" });
    },
  })
);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: Object.keys(services),
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "API Gateway",
    version: "1.0.0",
    services: { products: "/api/products" },
  });
});

app.use((req, res) => {
  logger.warn("Route not found", { url: req.url });
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  logger.error("Gateway Error", { error: err.message });
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

module.exports = app;
