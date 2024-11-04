# Build stage
FROM node:16-alpine as build

# Set working directory
WORKDIR /app

# Add npm configuration for better reliability
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retry-maxtimeout 600000
RUN npm config set fetch-timeout 600000

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy public directory first
COPY public/ ./public/

# Copy remaining source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 