# Product Microservice with API Gateway

A production-ready Node.js application demonstrating **Microservices Architecture**, **API Gateway Pattern**, and **Comprehensive Logging** for debugging in production environments.

## Architecture Overview

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      API Gateway (Port 8000)    │
│  - Rate Limiting                │
│  - Authentication               │
│  - Request Routing              │
│  - Load Balancing               │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌─────────┐  ┌──────────┐
│Product  │  │  User    │
│Service  │  │ Service  │
│(3001)   │  │ (3002)   │
└────┬────┘  └─────┬────┘
     │             │
     └──────┬──────┘
            ▼
    ┌──────────────┐
    │   MongoDB    │
    └──────────────┘
```

## Features

### 1. **Microservices Architecture**

- Separated Product Service (independent scaling)
- Service Registry pattern
- Inter-service communication
- Health check endpoints

### 2. **API Gateway**

- Centralized entry point
- Rate limiting (100 requests per 15 minutes)
- API key authentication
- Request/response transformation
- Service discovery

### 3. **Production Logging**

- Structured JSON logging with Winston
- HTTP request/response logging with Morgan
- Log rotation (5MB per file, max 5 files)
- Separate error and combined logs
- Daily rotating logs
- Exception and rejection handling

### 4. **Security**

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- API key authentication
- Input validation

## Installation

1. **Clone the repository**

```bash
git clone <your-repo>
cd back-end/simple-crud
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create a `.env` file:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Service Ports
PRODUCT_SERVICE_PORT=3001
GATEWAY_PORT=8000

# Security
API_KEY=your-secure-api-key

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

4. **Create logs directory**

```bash
mkdir logs
```

## Usage

### Running Individual Services

**Product Service:**

```bash
npm run product-service
# or in dev mode
npm run dev:product-service
```

**API Gateway:**

```bash
npm run gateway
# or in dev mode
npm run dev:gateway
```

### Running All Services Together

```bash
npm run start:all
```

## 📡 API Endpoints

### Through API Gateway (Port 8000)

All requests require `X-API-Key` header.

**Get all products:**

```bash
curl -H "X-API-Key: your-secure-api-key" \
  http://localhost:8000/api/products
```

**Get product by ID:**

```bash
curl -H "X-API-Key: your-secure-api-key" \
  http://localhost:8000/api/products/product/{id}
```

**Create product:**

```bash
curl -X POST \
  -H "X-API-Key: your-secure-api-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"quantity":10}' \
  http://localhost:8000/api/products/products
```

**Update product:**

```bash
curl -X PUT \
  -H "X-API-Key: your-secure-api-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Laptop","price":899.99}' \
  http://localhost:8000/api/products/product/{id}
```

**Delete product:**

```bash
curl -X DELETE \
  -H "X-API-Key: your-secure-api-key" \
  http://localhost:8000/api/products/product/{id}
```

**Health Check:**

```bash
curl http://localhost:8000/health
```

## Monitoring & Debugging

### View Logs

**Real-time combined logs:**

```bash
npm run logs:view
# or
tail -f logs/combined.log
```

**Real-time error logs:**

```bash
npm run logs:error
# or
tail -f logs/error.log
```

**Search for specific errors:**

```bash
grep "ERROR" logs/combined.log
grep -i "database" logs/error.log
```

### Linux Commands for Production

**Check running services:**

```bash
ps aux | grep node
```

**Check listening ports:**

```bash
netstat -tulpn | grep LISTEN
# or
lsof -i :8000
lsof -i :3001
```

**Monitor system resources:**

```bash
top
htop  # Better alternative
```

**Test API response time:**

```bash
time curl http://localhost:8000/api/products
```

### Using PM2 (Production Process Manager)

**Install PM2:**

```bash
npm install -g pm2
```

**Start services:**

```bash
pm2 start gateway/gateway.js --name "api-gateway"
pm2 start services/product-service/index.js --name "product-service"
```

**Monitor processes:**

```bash
pm2 monit
pm2 logs
pm2 list
```

**Restart services:**

```bash
pm2 restart all
```

## Log Structure

### Log Files

```
logs/
├── combined.log        # All logs
├── error.log          # Error level logs only
├── exceptions.log     # Uncaught exceptions
├── rejections.log     # Unhandled promise rejections
└── app-2024-01-15.log # Daily rotating logs
```

### Log Format

```json
{
  "timestamp": "2024-01-15 14:30:45",
  "level": "info",
  "message": "Incoming Request",
  "service": "product-service",
  "method": "GET",
  "url": "/api/products",
  "ip": "127.0.0.1",
  "duration": "45ms"
}
```

## Security Best Practices

1. **Never commit `.env` file**
2. **Use strong API keys in production**
3. **Enable HTTPS in production**
4. **Regularly update dependencies**
5. **Monitor rate limits and adjust as needed**
6. **Review logs for suspicious activity**

## Project Structure

```
simple-crud/
├── config/
│   └── logger.js              # Winston logger configuration
├── controllers/
│   └── product.controller.js  # Product business logic
├── gateway/
│   └── gateway.js             # API Gateway service
├── middleware/
│   ├── logger.middleware.js   # Logging middleware
│   └── validateProduct.js     # Validation middleware
├── models/
│   └── product.model.js       # Mongoose schema
├── routes/
│   └── product.routes.js      # Express routes
├── services/
│   └── product-service/
│       └── index.js           # Product microservice
├── logs/                      # Log files directory
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Troubleshooting

### Service won't start

```bash
# Check if port is already in use
lsof -i :8000
lsof -i :3001

# Kill process using port
kill -9 <PID>
```

### Database connection fails

```bash
# Check MongoDB connection
mongo "your_connection_string"

# Verify environment variables
echo $MONGO_URI
```

### Logs not appearing

```bash
# Check logs directory exists
ls -la logs/

# Create if missing
mkdir logs

# Check permissions
chmod 755 logs/
```

## 📈 Performance Tips

1. **Use PM2 cluster mode** for load balancing
2. **Enable caching** for frequently accessed data
3. **Use MongoDB indexes** for faster queries
4. **Implement Redis** for session management
5. **Use CDN** for static assets

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Commit Message Guidelines

Each file should have a descriptive commit message:

- `feat: Add Winston logger configuration`
- `feat: Implement logging middleware with Morgan`
- `feat: Create API Gateway with rate limiting`
- `feat: Convert to microservice architecture`
- `docs: Add comprehensive README`
- `chore: Update dependencies and scripts`

## License

ISC

## Author

Cedrick Bienvenue

---

**Made with ❤️ for production-ready microservices**
