<<<<<<< HEAD
# Optimized multi-stage build for CI/CD
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@10.14.0 turbo

WORKDIR /app

# Copy workspace config first (for better caching)
COPY pnpm-workspace.yaml turbo.json ./

# Copy root package.json
COPY package.json pnpm-lock.yaml ./

# Copy package.json files for dependency resolution
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install ALL dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Ensure all workspace dependencies are installed
RUN pnpm install --frozen-lockfile

# Build only essential packages (skip heavy ones like design-system if not needed)
RUN pnpm run build

# Development stage - with hot reload support
FROM node:20-alpine AS development

# Install pnpm globally
RUN npm install -g pnpm@10.14.0 turbo

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml turbo.json ./

# Copy root package.json
COPY package.json pnpm-lock.yaml ./

# Copy package.json files
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install ALL dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Default command for development
CMD ["pnpm", "run", "dev"]

# Production stage - minimal runtime
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy built artifacts only
COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/*/dist ./apps/
COPY --from=base /app/packages/*/dist ./packages/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 3000

# Default command (override in docker-compose for specific services)
CMD ["sh", "-c", "echo 'Multi-service image built successfully. Use docker-compose for individual services.'"]
=======
# GCC support can be specified at major, minor, or micro version
# (e.g. 8, 8.2 or 8.2.0).
# See https://hub.docker.com/r/library/gcc/ for all supported GCC
# tags from Docker Hub.
# See https://docs.docker.com/samples/library/gcc/ for more on how to use this image
FROM gcc:latest

# These commands copy your files into the specified directory in the image
# and set that as the working location
COPY . /usr/src/myapp
WORKDIR /usr/src/myapp

# This command compiles your app using GCC, adjust for your source code
RUN g++ -o myapp main.cpp

# This command runs your application, comment out this line to compile only
CMD ["./myapp"]

LABEL Name=a4codddmicroservices Version=0.0.1
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
