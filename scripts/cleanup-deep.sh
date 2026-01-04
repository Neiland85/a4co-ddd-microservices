#!/bin/bash
# Deep cleanup script - removes ALL generated files and resets the repository
# WARNING: This will remove all build artifacts, dependencies, and generated files
# Use this for a complete fresh start

set -e

echo "⚠️  DEEP CLEANUP WARNING ⚠️"
echo "This will remove:"
echo "  - All node_modules"
echo "  - All build artifacts"
echo "  - All Prisma generated files"
echo "  - All lock files"
echo "  - All cache directories"
echo "  - All Docker volumes and images"
echo ""
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "🧹 Starting deep cleanup..."

# Stop all Docker containers
if command -v docker &> /dev/null; then
    echo "🐳 Stopping Docker containers..."
    docker compose down -v 2>/dev/null || true
    docker compose -f docker-compose.test.yml down -v 2>/dev/null || true
    docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true
    docker compose -f docker-compose.observability.yml down -v 2>/dev/null || true
fi

# Remove all node_modules
echo "📦 Removing all node_modules..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove all dist/build directories
echo "🏗️  Removing all build artifacts..."
find . -name "dist" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "out" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Remove all test artifacts
echo "🧪 Removing all test artifacts..."
find . -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "test-results" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "playwright-report" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".jest-cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove Prisma artifacts
echo "🗄️  Removing Prisma generated files..."
find . -name "generated" -type d -path "*/prisma/generated" -exec rm -rf {} + 2>/dev/null || true

# Remove TypeScript artifacts
echo "📝 Removing TypeScript artifacts..."
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
find . -name "tsconfig.tsbuildinfo" -delete 2>/dev/null || true

# Remove cache directories
echo "💾 Removing cache directories..."
rm -rf .turbo
rm -rf .eslintcache
rm -rf .nx
find . -name ".cache" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Remove lock files
echo "🔒 Removing lock files..."
rm -f package-lock.json
rm -f yarn.lock
# Keep pnpm-lock.yaml for reproducible builds

# Remove temporary files
echo "🗑️  Removing temporary files..."
find . -name "*.log" -not -path "./node_modules/*" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
rm -f .env.test
rm -f .env.local

# Docker cleanup
if command -v docker &> /dev/null; then
    echo "🐳 Deep Docker cleanup..."
    docker system prune -af --volumes 2>/dev/null || true
    
    # Remove specific project images
    echo "  Removing project Docker images..."
    docker images | grep "a4co" | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
fi

# Git cleanup
echo "🗂️  Git cleanup..."
git clean -fdx -e .env -e .env.* 2>/dev/null || true

echo ""
echo "✅ Deep cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "  1. pnpm install          # Reinstall dependencies"
echo "  2. pnpm run build        # Rebuild packages"
echo "  3. pnpm run dev          # Start development"
echo ""
echo "Or run the full setup:"
echo "  ./scripts/setup-complete.sh"
