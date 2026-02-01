#!/bin/bash

echo "=========================================="
echo "WordPress + React Debug & Troubleshooting"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_ok() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

echo ""
echo "=========================================="
echo "CONTAINER STATUS CHECK"
echo "=========================================="

# Check all containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(wordpress_db|wordpress_backend|vite_frontend|wordpress_phpmyadmin)" || echo "No project containers found"

echo ""
echo "=========================================="
echo "1. MYSQL DATABASE CHECK"
echo "=========================================="

if docker ps | grep -q wordpress_db; then
    log_ok "MySQL container is running"
    
    # Check health
    health=$(docker inspect --format='{{.State.Health.Status}}' wordpress_db 2>/dev/null || echo "unknown")
    if [ "$health" = "healthy" ]; then
        log_ok "MySQL health: $health"
    else
        log_warn "MySQL health: $health"
    fi
    
    # Check logs for errors
    if docker logs --tail=20 wordpress_db 2>&1 | grep -qi error; then
        log_warn "Errors found in MySQL logs"
        docker logs --tail=10 wordpress_db 2>&1 | grep -i error
    else
        log_ok "No recent errors in MySQL logs"
    fi
    
    # Test connection
    if docker exec wordpress_db mysqladmin ping -h localhost -uroot -p"${MYSQL_ROOT_PASSWORD:-rootpassword123}" &>/dev/null; then
        log_ok "MySQL responding to ping"
    else
        log_error "MySQL not responding"
    fi
else
    log_error "MySQL container (wordpress_db) NOT running"
fi

echo ""
echo "=========================================="
echo "2. WORDPRESS BACKEND CHECK"
echo "=========================================="

if docker ps | grep -q wordpress_backend; then
    log_ok "WordPress container is running"
    
    # Check if WordPress is installed
    if docker exec wordpress_backend wp core is-installed --allow-root 2>/dev/null; then
        log_ok "WordPress IS installed"
    else
        log_error "WordPress NOT installed"
    fi
    
    # Check for wp-config.php
    if docker exec wordpress_backend test -f /var/www/html/wp-config.php; then
        log_ok "wp-config.php exists"
    else
        log_error "wp-config.php NOT found"
    fi
    
    # Check setup script execution
    if docker logs wordpress_backend 2>&1 | grep -q "WordPress headless setup complete"; then
        log_ok "Setup script ran successfully"
    else
        log_warn "Setup script may not have completed"
    fi
    
    # Check database connection from WordPress
    if docker exec wordpress_backend mysql -h db -u wordpress -p"${MYSQL_PASSWORD:-wordpress123}" -e "SELECT 1" wordpress &>/dev/null; then
        log_ok "WordPress can connect to database"
    else
        log_error "WordPress cannot connect to database"
    fi
    
    # Show last 10 log lines
    echo ""
    echo "Recent WordPress logs:"
    docker logs --tail=10 wordpress_backend 2>&1
else
    log_error "WordPress container (wordpress_backend) NOT running"
fi

echo ""
echo "=========================================="
echo "3. FRONTEND CHECK"
echo "=========================================="

if docker ps | grep -q vite_frontend; then
    log_ok "Frontend container is running"
    
    # Check if node_modules exists
    if docker exec vite_frontend test -d /app/node_modules; then
        log_ok "node_modules exists"
    else
        log_warn "node_modules NOT found (may need npm install)"
    fi
    
    # Check if frontend is responding
    if docker exec vite_frontend wget -q --spider http://localhost:5173 2>/dev/null; then
        log_ok "Frontend responding on port 5173"
    else
        log_warn "Frontend not responding (may still be starting)"
    fi
    
    # Show recent logs
    echo ""
    echo "Recent frontend logs:"
    docker logs --tail=10 vite_frontend 2>&1 || echo "No logs available"
else
    log_error "Frontend container (vite_frontend) NOT running"
fi

echo ""
echo "=========================================="
echo "4. PHPMYADMIN CHECK"
echo "=========================================="

if docker ps | grep -q wordpress_phpmyadmin; then
    log_ok "phpMyAdmin container is running"
    
    # Check if responding
    if docker exec wordpress_phpmyadmin wget -q --spider http://localhost:80 2>/dev/null; then
        log_ok "phpMyAdmin responding"
    else
        log_warn "phpMyAdmin not responding (may still be starting)"
    fi
else
    log_warn "phpMyAdmin container NOT running (optional)"
fi

echo ""
echo "=========================================="
echo "5. NETWORK & CONNECTIVITY"
echo "=========================================="

# Check if all containers can see each other
echo "Testing inter-container connectivity..."

if docker exec wordpress_backend ping -c 1 db &>/dev/null; then
    log_ok "WordPress can reach MySQL (db)"
else
    log_error "WordPress cannot reach MySQL"
fi

if docker exec vite_frontend ping -c 1 wordpress_backend &>/dev/null; then
    log_ok "Frontend can reach WordPress"
else
    log_warn "Frontend cannot reach WordPress"
fi

echo ""
echo "=========================================="
echo "QUICK FIXES"
echo "=========================================="
echo ""
echo "A. Restart specific service:"
echo "   docker compose restart wordpress"
echo "   docker compose restart db"
echo "   docker compose restart frontend"
echo ""
echo "B. View full logs:"
echo "   docker compose logs -f [wordpress|db|frontend]"
echo ""
echo "C. Manual WordPress install:"
echo "   docker exec -it wordpress_backend bash"
echo "   wp core install --url='http://localhost:8080' --title='Headless WP' --admin_user='admin' --admin_password='admin123' --admin_email='admin@example.com' --allow-root"
echo ""
echo "D. Complete reset (DELETES ALL DATA):"
echo "   docker compose down -v"
echo "   docker system prune -a -f"
echo "   rm -f .env && cp .env.example .env"
echo "   ./deploy.sh"
echo ""
echo "=========================================="
