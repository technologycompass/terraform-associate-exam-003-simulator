# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package definition files
COPY package*.json ./

# Install dependencies (clean install)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build argument for API Key 
# (Note: In production, it is safer to fetch keys at runtime or via a proxy, 
# but for Vite client-side builds, env vars are often embedded at build time)
ARG API_KEY
ENV API_KEY=$API_KEY

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a custom Nginx config for Single Page Application (SPA) support
# This ensures that refreshing on a sub-route (like /review) redirects to index.html
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]


