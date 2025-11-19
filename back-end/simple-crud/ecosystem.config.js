module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./gateway/gateway.js",
      instances: 2, // Run 2 instances for load balancing
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        GATEWAY_PORT: 8000,
      },
      env_development: {
        NODE_ENV: "development",
        GATEWAY_PORT: 8000,
      },
      error_file: "./logs/pm2-gateway-error.log",
      out_file: "./logs/pm2-gateway-out.log",
      log_file: "./logs/pm2-gateway-combined.log",
      time: true,
      max_memory_restart: "500M",
      restart_delay: 4000,
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      max_restarts: 10,
      min_uptime: "10s",
    },
    {
      name: "product-service",
      script: "./services/product-service/index.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PRODUCT_SERVICE_PORT: 3001,
      },
      env_development: {
        NODE_ENV: "development",
        PRODUCT_SERVICE_PORT: 3001,
      },
      error_file: "./logs/pm2-product-error.log",
      out_file: "./logs/pm2-product-out.log",
      log_file: "./logs/pm2-product-combined.log",
      time: true,
      max_memory_restart: "500M",
      restart_delay: 4000,
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],

  deploy: {
    production: {
      user: "node",
      host: "your-server.com",
      ref: "origin/main",
      repo: "git@github.com:username/repo.git",
      path: "/var/www/production",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
    },
    staging: {
      user: "node",
      host: "staging-server.com",
      ref: "origin/develop",
      repo: "git@github.com:username/repo.git",
      path: "/var/www/staging",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env staging",
    },
  },
};
