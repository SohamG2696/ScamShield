# ============================================================
# ScamShield Frontend Multi-Stage Dockerfile
# Stage 1: Build React/Vite production bundles
# Stage 2: Serve optimized static assets with high-performance Nginx
# ============================================================

# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_API_BASE_URL=http://localhost:8000
ARG VITE_GOOGLE_CLIENT_ID=""

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Build production bundle into /app/dist
RUN npm run build

# --- Stage 2: Production Nginx Server ---
FROM nginx:1.27-alpine

# Replace default Nginx configuration with React Router-compatible config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check to ensure Nginx is serving traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

