#!/bin/bash
set -e

echo "🔍 Docker Security Scanning"
echo "==========================="

# Services to scan
services=(
  "apps/order-service/Dockerfile.prod"
  "apps/payment-service/Dockerfile.prod"
  "apps/inventory-service/Dockerfile.prod"
  "apps/auth-service/Dockerfile.prod"
  "apps/product-service/Dockerfile.prod"
)

# Check if trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "⚠️  Trivy not installed."
    echo ""
    echo "Installation options:"
    echo "  macOS:   brew install trivy"
    echo "  Ubuntu:  sudo apt-get install trivy"
    echo "  Docker:  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image <image-name>"
    echo ""
    echo "Skipping Trivy scan..."
    echo ""
fi

# Function to scan with Trivy
scan_with_trivy() {
    local dockerfile=$1
    local service_name=$(echo $dockerfile | cut -d'/' -f2)
    
    echo ""
    echo "Scanning: $dockerfile"
    echo "------------------------"
    
    # Build image
    echo "Building image: $service_name:scan"
    docker build -f $dockerfile -t $service_name:scan . || {
        echo "❌ Failed to build $service_name"
        return 1
    }
    
    # Scan with Trivy if available
    if command -v trivy &> /dev/null; then
        echo "Running Trivy scan..."
        trivy image --severity HIGH,CRITICAL $service_name:scan || {
            echo "⚠️  Trivy scan found issues (check output above)"
        }
    else
        echo "⚠️  Trivy not available, skipping image scan"
    fi
    
    # Basic security checks
    echo ""
    echo "Basic security checks:"
    echo "  - Checking for root user..."
    if docker run --rm $service_name:scan id | grep -q "uid=0"; then
        echo "    ❌ Container runs as root!"
    else
        echo "    ✅ Container runs as non-root user"
    fi
    
    echo "  - Checking exposed ports..."
    docker inspect $service_name:scan | grep -q "ExposedPorts" && echo "    ✅ Ports configured" || echo "    ⚠️  No exposed ports"
    
    # Clean up
    echo "Cleaning up temporary image..."
    docker rmi $service_name:scan 2>/dev/null || true
}

# Scan each service
for dockerfile in "${services[@]}"; do
    if [ ! -f "$dockerfile" ]; then
        echo "⚠️  Dockerfile not found: $dockerfile"
        continue
    fi
    
    scan_with_trivy "$dockerfile"
done

echo ""
echo "✅ Security scan completed"
echo ""
echo "📝 Recommendations:"
echo "  - Review all HIGH and CRITICAL vulnerabilities"
echo "  - Update base images regularly"
echo "  - Use specific version tags (not 'latest')"
echo "  - Ensure all containers run as non-root users"
echo "  - Review exposed ports and remove unnecessary ones"
