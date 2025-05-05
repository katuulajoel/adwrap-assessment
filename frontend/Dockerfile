# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]