FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code and data
COPY src/ ./src/
COPY data/ ./data/

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"] 