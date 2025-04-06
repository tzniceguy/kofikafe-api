FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts


# Expose port 3000
EXPOSE 3000

# Start the application in production mode

CMD ["/bin/sh", "-c", "bun run makemigrations && bun run migrate && ./server"]
