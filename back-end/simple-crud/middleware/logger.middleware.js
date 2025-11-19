const logger = require("../config/logger");
const morgan = require("morgan");

morgan.token("body", (req) => JSON.stringify(req.body));

const httpLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream: logger.stream }
);

const requestLogger = (req, res, next) => {
  const start = Date.now();

  logger.info("Incoming Request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    body: req.body,
  });

  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    logger.info("Outgoing Response", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
    originalSend.call(this, data);
  };

  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  next(err);
};

module.exports = { httpLogger, requestLogger, errorLogger };
