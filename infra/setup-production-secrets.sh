#!/bin/bash
set -e

echo "🔐 Setting up Docker Secrets for Production"
echo "============================================="

# Check if Docker Swarm is initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "⚠️  Docker Swarm is not initialized. Initializing now..."
    docker swarm init || echo "⚠️  Swarm already initialized or error occurred"
fi

# Validate required env vars
required_vars=(
  "POSTGRES_PASSWORD"
  "JWT_SECRET"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
)

missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ ERROR: The following required environment variables are not set:"
    printf '   - %s\n' "${missing_vars[@]}"
    echo ""
    echo "   Usage:"
    echo "   source infra/.env.production && infra/setup-production-secrets.sh"
    echo ""
    echo "   Or set them manually:"
    echo "   export POSTGRES_PASSWORD='your_password'"
    echo "   export JWT_SECRET='your_jwt_secret'"
    echo "   export STRIPE_SECRET_KEY='your_stripe_key'"
    echo "   export STRIPE_WEBHOOK_SECRET='your_webhook_secret'"
    exit 1
fi

# Create secrets (Docker Swarm mode)
echo ""
echo "Creating Docker secrets..."

echo "$POSTGRES_PASSWORD" | docker secret create db_password - 2>/dev/null || echo "⚠️  db_password already exists"
echo "$JWT_SECRET" | docker secret create jwt_secret - 2>/dev/null || echo "⚠️  jwt_secret already exists"
echo "$STRIPE_SECRET_KEY" | docker secret create stripe_secret_key - 2>/dev/null || echo "⚠️  stripe_secret_key already exists"
echo "$STRIPE_WEBHOOK_SECRET" | docker secret create stripe_webhook_secret - 2>/dev/null || echo "⚠️  stripe_webhook_secret already exists"

echo ""
echo "✅ Docker secrets configured successfully"
echo ""
echo "List of secrets:"
docker secret ls

echo ""
echo "📝 Next steps:"
echo "   1. Verify secrets: docker secret ls"
echo "   2. Deploy stack: docker stack deploy -c infra/docker/docker-compose.prod.yml a4co"
echo "   3. Check services: docker service ls"
