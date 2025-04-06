FROM oven/bun:latest

#set working directory
WORKDIR /app

#copy package.json and package-lock.json
COPY package.json bun.lockb ./

#install dependencies
RUN bun install

#copy source code
COPY . .

#expose port 3000
EXPOSE 3000

#start the application
CMD ["bun", "run", "dev"]
