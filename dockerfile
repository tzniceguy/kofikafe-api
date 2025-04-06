FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application in production mode
CMD ["bun", "run", "src/index.ts"]
