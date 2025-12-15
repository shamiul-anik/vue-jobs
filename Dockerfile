FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Ensure db folder exists
RUN mkdir -p db

# Start the server with TypeScript support
CMD ["npm", "run", "server"]
