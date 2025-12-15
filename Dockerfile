FROM oven/bun:latest

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN bun install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start validity check: Ensure db folder exists
RUN mkdir -p db

# Start the server
CMD ["bun", "run", "server"]
