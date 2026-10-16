# ── Stage 1: Build the React app ──
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:1.30-alpine

# Pull in Alpine security patches released after the base image was built
RUN apk upgrade --no-cache

# Create non-root user (M4 requirement)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built React assets and custom Nginx config
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions for non-root Nginx
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
