FROM --platform=linux/amd64 node:20-slim# Use Node.js LTS (Long Term Support) as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create a non-root user and switch to it
RUN groupadd -r nodejs --gid 1001 && \
    useradd -r -g nodejs --uid 1001 nodeuser && \
    chown -R nodeuser:nodejs /app
USER nodeuser

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]