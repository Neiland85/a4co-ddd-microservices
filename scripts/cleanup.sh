#!/bin/bash
# Cleanup script for A4CO DDD Microservices monorepo
# Run this script to clean up build artifacts, dependencies, and temporary files

set -e

echo "🧹 Starting cleanup process..."

# Function to safely remove directories
safe_remove() {
    if [ -d "$1" ]; then
        echo "  Removing $1..."
        rm -rf "$1"
    fi
}

# Function to safely remove files
safe_remove_file() {
    if [ -f "$1" ]; then
        echo "  Removing $1..."
        rm -f "$1"
    fi
}

# Clean node_modules
echo "📦 Cleaning node_modules..."
find . -name "node_modules" -type d -not -path "./node_modules" -prune -exec rm -rf {} + 2>/dev/null || true
safe_remove "node_modules"

# Clean dist/build directories
echo "🏗️  Cleaning build artifacts..."
find . -name "dist" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name ".next" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name ".turbo" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Clean test artifacts
echo "🧪 Cleaning test artifacts..."
find . -name "coverage" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "test-results" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "playwright-report" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Clean Prisma generated files
echo "🗄️  Cleaning Prisma artifacts..."
find . -name "generated" -type d -path "*/prisma/generated" -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Clean TypeScript build info
echo "📝 Cleaning TypeScript artifacts..."
find . -name "*.tsbuildinfo" -not -path "./node_modules/*" -delete 2>/dev/null || true

# Clean lock files (optional - uncomment if needed)
# echo "🔒 Cleaning lock files..."
# safe_remove_file "package-lock.json"
# safe_remove_file "yarn.lock"

# Clean cache directories
echo "💾 Cleaning cache..."
safe_remove ".turbo"
safe_remove ".eslintcache"

# Clean temporary files
echo "🗑️  Cleaning temporary files..."
find . -name "*.log" -not -path "./node_modules/*" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
safe_remove_file ".env.test"
safe_remove_file ".env.local"

# Clean Docker artifacts (optional)
if command -v docker &> /dev/null; then
    echo "🐳 Cleaning Docker artifacts..."
    docker system prune -f 2>/dev/null || true
fi

echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "To reinstall dependencies, run:"
echo "  pnpm install"
echo ""
echo "To rebuild the project, run:"
echo "  pnpm run build"
