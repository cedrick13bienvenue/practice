# 🐳 Docker Setup for Blog Backend

This guide explains how to run the blog backend application using Docker and Docker Compose.

## 📋 Prerequisites

- Docker installed on your machine
- Docker Compose installed
- Git (to clone the repository)

## 🚀 Quick Start

### Development Environment

1. **Start development containers:**

   ```bash
   ./docker-scripts.sh up-dev
   ```

2. **View logs:**

   ```bash
   ./docker-scripts.sh logs-dev
   ```

3. **Stop development containers:**
   ```bash
   ./docker-scripts.sh down-dev
   ```

### Production Environment

1. **Build and start production containers:**

   ```bash
   ./docker-scripts.sh build
   ./docker-scripts.sh up
   ```

2. **View logs:**

   ```bash
   ./docker-scripts.sh logs
   ```

3. **Stop production containers:**
   ```bash
   ./docker-scripts.sh down
   ```

## 🏗️ Architecture

The Docker setup includes:

- **API Server** - Node.js Express application
- **PostgreSQL** - Database for blog data
- **Redis** - Message queue (for future email workers)
- **Email Worker** - Background email processor (future)

## 📁 File Structure

```
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── docker-scripts.sh       # Helper scripts
└── .dockerignore          # Files to exclude from build
```

## 🔧 Available Commands

### Using docker-scripts.sh

```bash
# Development
./docker-scripts.sh build-dev    # Build development images
./docker-scripts.sh up-dev       # Start development containers
./docker-scripts.sh down-dev     # Stop development containers
./docker-scripts.sh logs-dev     # View development logs

# Production
./docker-scripts.sh build        # Build production images
./docker-scripts.sh up           # Start production containers
./docker-scripts.sh down         # Stop production containers
./docker-scripts.sh logs         # View production logs

# Database
./docker-scripts.sh migrate      # Run database migrations
./docker-scripts.sh seed         # Seed database

# Maintenance
./docker-scripts.sh clean        # Clean up containers and volumes
./docker-scripts.sh shell        # Open shell in container
./docker-scripts.sh test         # Run tests in container
```

### Direct Docker Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose up -d
docker-compose logs -f
```

## 🌐 Access Points

- **API Server**: http://localhost:5500
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **API Documentation**: http://localhost:5500/api-docs

## 🔐 Environment Variables

The containers use these environment variables:

```env
NODE_ENV=production
PORT=5500
DB_HOST=postgres
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=blog_password
REDIS_HOST=redis
REDIS_PORT=6379
```

## 🗄️ Database

### First Time Setup

1. **Start containers:**

   ```bash
   ./docker-scripts.sh up-dev
   ```

2. **Run migrations:**

   ```bash
   ./docker-scripts.sh migrate
   ```

3. **Seed database (optional):**
   ```bash
   ./docker-scripts.sh seed
   ```

### Database Access

- **Host**: localhost
- **Port**: 5432
- **Database**: blog_db_dev (dev) / blog_db (prod)
- **Username**: blog_user
- **Password**: blog_password

## 🧪 Testing

Run tests in the container:

```bash
./docker-scripts.sh test
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using the port
   lsof -i :5500
   # Kill the process or change port in docker-compose
   ```

2. **Database connection issues:**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   # View PostgreSQL logs
   docker-compose logs postgres
   ```

3. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Clean Slate

If you need to start fresh:

```bash
# Stop and remove everything
./docker-scripts.sh clean

# Rebuild and start
./docker-scripts.sh build-dev
./docker-scripts.sh up-dev
```

## 🔄 Development Workflow

1. **Start development environment:**

   ```bash
   ./docker-scripts.sh up-dev
   ```

2. **Make code changes** (hot reload enabled)

3. **Run tests:**

   ```bash
   ./docker-scripts.sh test
   ```

4. **Stop when done:**
   ```bash
   ./docker-scripts.sh down-dev
   ```

## 📊 Monitoring

### Container Status

```bash
docker-compose ps
```

### Resource Usage

```bash
docker stats
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

## 🚀 Next Steps

After Docker setup is complete:

1. **Add Redis/RabbitMQ integration** for message queuing
2. **Implement email workers** for background processing
3. **Add monitoring and logging** (Prometheus, Grafana)
4. **Set up CI/CD pipeline** for automated deployments

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
