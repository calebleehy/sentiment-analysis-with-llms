# Use Node.js image as base
FROM node:alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as base
FROM nginx:alpine

# Copy build files from the previous stage to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]