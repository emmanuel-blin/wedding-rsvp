#!/bin/bash
set -e

echo "=========================================="
echo "WordPress + React Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if phpMyAdmin is enabled in docker-compose.yml
PHPmyADMIN_ENABLED=false
if grep -q "^[[:space:]]*phpmyadmin:" docker-compose.yml 2>/dev/null; then
    PHPmyADMIN_ENABLED=true
fi

# Step 1: Cleanup existing containers
log_info "Step 1: Cleaning up existing containers..."
docker compose down -v 2>/dev/null || true
log_info "Cleanup complete."

# Step 2: Pull images sequentially with error handling
log_info "Step 2: Pulling images one by one..."

IMAGES=(
    "mysql:8.0"
    "wordpress:latest"
    "node:18-alpine"
)

# Only pull phpMyAdmin image if it's enabled
if [ "$PHPmyADMIN_ENABLED" = true ]; then
    IMAGES+=("phpmyadmin/phpmyadmin:latest")
fi

for img in "${IMAGES[@]}"; do
    log_info "Pulling $img..."
    if docker pull "$img"; then
        log_info "Successfully pulled $img"
    else
        log_error "Failed to pull $img"
        exit 1
    fi
    sleep 1
done

log_info "All images pulled successfully."

# Step 3: Start containers in order with health checks
echo ""
log_info "Step 3: Starting containers in order..."
echo ""

# 3a. Start database
log_info "Starting MySQL database..."
docker compose up -d db
log_info "Waiting for MySQL to be healthy..."
for i in {1..40}; do
    # Check health status using docker inspect
    health_status=$(docker inspect --format='{{.State.Health.Status}}' wordpress_db 2>/dev/null || echo "unknown")
    if [ "$health_status" = "healthy" ]; then
        log_info "MySQL is healthy!"
        break
    fi
    if [ $i -eq 40 ]; then
        log_error "MySQL failed to become healthy (status: $health_status)"
        exit 1
    fi
    sleep 2
    echo -n "."
done
echo ""

# 3b. Start WordPress (setup script runs automatically via /docker-entrypoint-initwp.d/)
log_info "Starting WordPress (setup will run automatically)..."
docker compose up -d wordpress

log_info "Waiting for WordPress initialization and setup..."
for i in {1..60}; do
    # Check if setup script has completed (it logs to stdout which we can see in logs)
    if docker compose logs --tail=20 wordpress 2>&1 | grep -q "WordPress headless setup complete"; then
        log_info "WordPress setup completed!"
        break
    fi
    if [ $i -eq 60 ]; then
        log_warn "WordPress setup timeout - running diagnostics..."
        echo ""
        log_info "Setup script output:"
        docker compose logs --tail=30 wordpress 2>&1
        echo ""
        log_error "WordPress setup failed. Run ./debug.sh for full diagnostics"
        exit 1
    fi
    sleep 3
    echo -n "."
done
echo ""

# Give WordPress a moment to stabilize
sleep 5

# 3c. Start frontend
log_info "Starting React frontend..."
docker compose up -d frontend
log_info "Waiting for frontend to start..."
sleep 10

# 3d. Start phpMyAdmin (optional - only if enabled)
if [ "$PHPmyADMIN_ENABLED" = true ]; then
    log_info "Starting phpMyAdmin..."
    docker compose up -d phpmyadmin
    sleep 3
else
    log_info "phpMyAdmin is disabled (commented out in docker-compose.yml)"
fi

# Quick verification
echo ""
log_info "Verifying deployment..."
all_ok=true

if docker exec wordpress_backend curl -sf http://localhost:80/wp-json/wp/v2/ &>/dev/null; then
    log_info "✓ WordPress API is responding"
else
    log_warn "⚠ WordPress API not responding (may still be initializing)"
    all_ok=false
fi

if docker exec vite_frontend wget -q --spider http://localhost:5173 &>/dev/null; then
    log_info "✓ Frontend is responding"
else
    log_warn "⚠ Frontend not responding (may still be starting)"
fi

# Final status
echo ""
echo "=========================================="
if [ "$all_ok" = true ]; then
    echo "Deployment Complete!"
else
    echo "Deployment Complete (with warnings)"
fi
echo "=========================================="
echo ""
echo "Services:"
docker compose ps
echo ""
echo "URLs:"
echo "  - WordPress:      http://localhost:8080"
echo "  - WordPress API:  http://localhost:8080/wp-json/wp/v2/"
echo "  - GraphQL *:      http://localhost:8080/graphql"
echo "  - React Frontend: http://localhost:5173"
if [ "$PHPmyADMIN_ENABLED" = true ]; then
    echo "  - phpMyAdmin:     http://localhost:8081"
fi
echo "  * GraphQL requires setting WORDPRESS_ENABLE_GRAPHQL=true"
if [ "$PHPmyADMIN_ENABLED" = false ]; then
    echo "  * phpMyAdmin is disabled (uncomment in docker-compose.yml to enable)"
fi
echo ""
echo "WordPress Admin Credentials:"
echo "  - Username: ${WORDPRESS_ADMIN_USER:-admin}"
echo "  - Password: ${WORDPRESS_ADMIN_PASSWORD:-admin123}"
echo ""
echo "Troubleshooting:"
echo "  - Run ./debug.sh to diagnose any issues"
echo "  - Run docker compose logs -f wordpress to watch logs"
echo ""
