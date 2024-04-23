# Use Node.js image as base
FROM --platform=linux/x86-64 node:latest as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@latest

# Copy the rest of the files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as base
FROM --platform=linux/x86-64 nginx:alpine

# Copy build files from the previous stage to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]