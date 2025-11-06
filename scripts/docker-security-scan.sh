#!/bin/bash
set -e

echo "🔍 Docker Security Scanning"
echo "==========================="

# Check if trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "⚠️  Trivy not installed."
    echo ""
    echo "Installation options:"
    echo "  macOS:   brew install trivy"
    echo "  Linux:   sudo apt-get install trivy"
    echo "  Docker:  docker run --rm aquasec/trivy image <image-name>"
    echo ""
    echo "Skipping Trivy scan. Continuing with basic checks..."
    TRIVY_AVAILABLE=false
else
    TRIVY_AVAILABLE=true
fi

# Services to scan
services=(
  "apps/order-service/Dockerfile.prod"
  "apps/payment-service/Dockerfile.prod"
  "apps/inventory-service/Dockerfile.prod"
  "apps/auth-service/Dockerfile.prod"
  "apps/product-service/Dockerfile.prod"
)

# Basic security checks
echo ""
echo "📋 Basic Security Checks"
echo "------------------------"

for dockerfile in "${services[@]}"; do
  service_name=$(echo $dockerfile | cut -d'/' -f2)
  echo ""
  echo "Checking: $service_name"
  echo "  Dockerfile: $dockerfile"
  
  # Check if Dockerfile exists
  if [ ! -f "$dockerfile" ]; then
    echo "  ❌ Dockerfile not found!"
    continue
  fi
  
  # Check for non-root user
  if grep -q "USER node" "$dockerfile"; then
    echo "  ✅ Non-root user configured"
  else
    echo "  ⚠️  WARNING: No non-root user found"
  fi
  
  # Check for health check
  if grep -q "HEALTHCHECK" "$dockerfile"; then
    echo "  ✅ Health check configured"
  else
    echo "  ⚠️  WARNING: No health check found"
  fi
  
  # Check for pinned base image version
  if grep -q "FROM node:22.11-alpine" "$dockerfile"; then
    echo "  ✅ Base image version pinned"
  else
    echo "  ⚠️  WARNING: Base image version not pinned"
  fi
  
  # Check for multi-stage build
  stage_count=$(grep -c "^FROM.*AS" "$dockerfile" || echo "0")
  if [ "$stage_count" -ge 3 ]; then
    echo "  ✅ Multi-stage build detected ($stage_count stages)"
  else
    echo "  ⚠️  WARNING: Multi-stage build may not be optimal"
  fi
done

# Trivy scanning (if available)
if [ "$TRIVY_AVAILABLE" = true ]; then
    echo ""
    echo "🔬 Trivy Vulnerability Scanning"
    echo "-------------------------------"
    
    for dockerfile in "${services[@]}"; do
      service_name=$(echo $dockerfile | cut -d'/' -f2)
      echo ""
      echo "Scanning: $service_name"
      echo "------------------------"
      
      # Build image for scanning
      image_name="a4co-${service_name}:scan"
      
      echo "Building image: $image_name"
      docker build -f "$dockerfile" -t "$image_name" . || {
        echo "❌ Failed to build image for $service_name"
        continue
      }
      
      # Scan with Trivy
      echo "Scanning vulnerabilities..."
      trivy image --severity HIGH,CRITICAL "$image_name" || {
        echo "⚠️  Trivy scan failed for $image_name"
      }
      
      # Clean up
      echo "Cleaning up..."
      docker rmi "$image_name" 2>/dev/null || true
    done
else
    echo ""
    echo "⚠️  Skipping Trivy scan (not installed)"
    echo "   Install Trivy for vulnerability scanning:"
    echo "   brew install trivy  # macOS"
    echo "   apt-get install trivy  # Linux"
fi

# Check for hardcoded secrets
echo ""
echo "🔐 Checking for Hardcoded Secrets"
echo "----------------------------------"
secrets_found=false

# Check docker-compose files
for compose_file in infra/docker/docker-compose.yml infra/docker/docker-compose.prod.yml; do
  if [ -f "$compose_file" ]; then
    # Check for common secret patterns
    if grep -E "(password|secret|key|token).*=.*['\"][^${}].*['\"]" "$compose_file" | grep -v "^#" | grep -v "CHANGE_ME" | grep -v "example"; then
      echo "⚠️  Potential hardcoded secrets found in $compose_file:"
      grep -E "(password|secret|key|token).*=.*['\"][^${}].*['\"]" "$compose_file" | grep -v "^#" | grep -v "CHANGE_ME" | grep -v "example" || true
      secrets_found=true
    fi
  fi
done

if [ "$secrets_found" = false ]; then
  echo "✅ No hardcoded secrets detected in docker-compose files"
fi

# Summary
echo ""
echo "==========================="
echo "✅ Security scan completed"
echo "==========================="
echo ""
echo "📝 Recommendations:"
echo "   1. Review all warnings above"
echo "   2. Ensure all secrets use environment variables"
echo "   3. Run Trivy scan regularly in CI/CD"
echo "   4. Keep base images updated"
echo "   5. Review security contexts in docker-compose.prod.yml"
