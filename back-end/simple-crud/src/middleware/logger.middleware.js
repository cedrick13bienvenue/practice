const logger = require("../config/logger");
const morgan = require("morgan");

// Create custom Morgan token for request body
morgan.token("body", (req) => JSON.stringify(req.body));

// Create custom Morgan token for response body
morgan.token("res-body", (req, res) => {
  return res.locals.body ? JSON.stringify(res.locals.body) : "";
});

// HTTP request logger using Morgan
const httpLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms - :body",
  {
    stream: logger.stream,
    skip: (req, res) => res.statusCode < 400, // Only log errors
  }
);

// Detailed request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  logger.info("Incoming Request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    res.locals.body = data;

    const duration = Date.now() - start;
    logger.info("Outgoing Response", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: data ? data.length : 0,
    });

    originalSend.call(this, data);
  };

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
  });

  next(err);
};

module.exports = {
  httpLogger,
  requestLogger,
  errorLogger,
};
