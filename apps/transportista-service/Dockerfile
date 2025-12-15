# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/transportista-service/package.json ./apps/transportista-service/
COPY packages ./packages

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy service source
COPY apps/transportista-service ./apps/transportista-service

# Generate Prisma client
WORKDIR /app/apps/transportista-service
RUN pnpm prisma:generate

# Build the service
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/transportista-service/package.json ./apps/transportista-service/
COPY packages ./packages

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files and prisma
COPY --from=builder /app/apps/transportista-service/dist ./apps/transportista-service/dist
COPY --from=builder /app/apps/transportista-service/prisma ./apps/transportista-service/prisma

# Generate Prisma client for production
WORKDIR /app/apps/transportista-service
RUN pnpm prisma:generate

# Set environment
ENV NODE_ENV=production
ENV PORT=3008

# Expose port
EXPOSE 3008

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3008/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the service
CMD ["node", "dist/main.js"]
