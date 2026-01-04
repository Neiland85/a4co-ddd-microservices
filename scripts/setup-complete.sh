#!/bin/bash
# Complete setup script for A4CO DDD Microservices monorepo
# Run this after a fresh clone or deep cleanup

set -e

echo "🚀 A4CO DDD Microservices - Complete Setup"
echo "==========================================="
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 22 or higher."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm@10.14.0
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Some features may not work."
fi

echo "✅ Prerequisites checked"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma clients
echo "🗄️  Generating Prisma clients..."
if find . -name "schema.prisma" | grep -q .; then
    pnpm -w exec prisma generate || true
    pnpm --filter "@a4co/*" exec prisma generate || true
    pnpm --filter "./apps/*" run db:generate --if-present || true
else
    echo "  No Prisma schemas found, skipping..."
fi

# Build shared packages
echo "🏗️  Building shared packages..."
pnpm --filter "./packages/*" run build

# Build apps (optional)
echo "🔨 Building applications..."
pnpm -r run build || echo "⚠️  Some builds failed, but continuing..."

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Available commands:"
echo "  pnpm run dev           # Start all services in development mode"
echo "  pnpm run dev:frontend  # Start frontend only"
echo "  pnpm run dev:backend   # Start backend services only"
echo "  pnpm run build         # Build all packages and apps"
echo "  pnpm run test          # Run all tests"
echo "  pnpm run lint          # Lint all packages"
echo ""
echo "🐳 Docker commands:"
echo "  docker compose up -d   # Start infrastructure services"
echo "  docker compose down    # Stop all services"
echo ""
echo "🧹 Cleanup commands:"
echo "  pnpm run clean         # Clean build artifacts"
echo "  pnpm run clean:deep    # Deep cleanup (removes all)"
