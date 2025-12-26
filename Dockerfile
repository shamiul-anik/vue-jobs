# Stage 1: Build dependencies
FROM node:22-alpine AS builder
WORKDIR /app
# Install build dependencies for native modules if needed
RUN apk add --no-cache build-base python3
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app
# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules
# Copy only required backend files
COPY server.js ./
COPY routes ./routes
COPY middleware ./middleware
COPY scripts ./scripts

# Expose API port
EXPOSE 3000

# Ensure db folder exists
RUN mkdir -p db

# Start the server
CMD ["node", "server.js"]
