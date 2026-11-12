FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies (bcrypt needs build tools - use full node image not alpine)
RUN npm install

# Copy source code
COPY . .

# Expose Update Service port
EXPOSE 5004

# Start the Update Service
CMD ["node", "update-service.js"]
