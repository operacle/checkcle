# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY application/package*.json ./
RUN npm install
COPY application/ ./
RUN npm run build

# Stage 2: Download PocketBase binary
FROM alpine:3.17 AS pb-builder
WORKDIR /pb
ARG PB_VERSION=0.27.2
RUN apk add --no-cache wget unzip \
    && wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && chmod +x /pb/pocketbase

# Stage 3: Final runtime image
FROM alpine:3.17
WORKDIR /app

# Copy PocketBase binary
COPY --from=pb-builder /pb/pocketbase /app/pocketbase

# Copy frontend build to PocketBase public directory
COPY --from=frontend-builder /app/dist /app/pb_public

# Copy backend files
COPY server/pb_migrations /app/pb_migrations
COPY server/pb_data /app/pb_data  

# Mark pb_data as a volume for runtime persistence
VOLUME /app/pb_data

# Expose default PocketBase port
EXPOSE 8090

# Launch PocketBase and bind to 0.0.0.0 for external access
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir", "/app/pb_data"]
