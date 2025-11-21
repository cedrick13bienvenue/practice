FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose ports
EXPOSE 3000 3001 8000

# Start the application
CMD ["npm", "start"]