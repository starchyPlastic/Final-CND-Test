FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies (bcrypt needs build tools - use full node image not alpine)
RUN npm install

# Copy source code
COPY . .

# Expose Registration Service port
EXPOSE 5003

# Start the Registration Service
CMD ["node", "registrater.js"]
