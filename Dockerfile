FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies.
# This speeds up the pipeline by only installing dependencies when they change
COPY ./web/package*.json ./
RUN npm ci

COPY ./web .
RUN npm run build

# Use a lightweight web server to serve the built app
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
