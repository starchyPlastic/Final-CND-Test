FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose API Gateway port
EXPOSE 4000

# Start the API Gateway
CMD ["node", "api-gateway.js"]

