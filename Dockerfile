FROM node:22-alpine

WORKDIR /app

# Install dependencies (only production if possible, but we need devDependencies for currently setup build scripts if any, though here we run server)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start validity check: Ensure db folder exists
RUN mkdir -p db

# Start the server
CMD ["npm", "run", "server"]
