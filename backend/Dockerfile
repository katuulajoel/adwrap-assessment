# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]