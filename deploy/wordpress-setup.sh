#!/bin/bash
set -e

# This script runs automatically via /docker-entrypoint-initwp.d/
# WordPress's official entrypoint calls this after WordPress files are ready

echo "=========================================="
echo "Running WordPress headless setup..."
echo "=========================================="

# Install WP-CLI
echo "Installing WP-CLI..."
curl -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar 2>/dev/null || true
chmod +x /usr/local/bin/wp

# Change to WordPress directory
cd /var/www/html

# Wait for WordPress to be fully initialized (wp-config.php exists)
echo "Waiting for WordPress files to be ready..."
for i in {1..60}; do
    if [ -f /var/www/html/wp-config.php ]; then
        echo "WordPress files ready!"
        break
    fi
    sleep 2
done

# Check if WordPress is already installed
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "WordPress not installed yet. Running installation..."
    
    # Install WordPress with admin user
    # Using environment variables or defaults
    WP_ADMIN_USER=${WORDPRESS_ADMIN_USER:-admin}
    WP_ADMIN_PASSWORD=${WORDPRESS_ADMIN_PASSWORD:-admin123}
    WP_ADMIN_EMAIL=${WORDPRESS_ADMIN_EMAIL:-admin@example.com}
    WP_SITE_TITLE=${WORDPRESS_SITE_TITLE:-Headless WordPress}
    WP_URL=${WORDPRESS_URL:-http://localhost:8080}
    
    wp core install \
        --url="$WP_URL" \
        --title="$WP_SITE_TITLE" \
        --admin_user="$WP_ADMIN_USER" \
        --admin_password="$WP_ADMIN_PASSWORD" \
        --admin_email="$WP_ADMIN_EMAIL" \
        --skip-email \
        --allow-root
    
    echo "WordPress installed successfully!"
    echo "Admin User: $WP_ADMIN_USER"
    echo "Admin Password: $WP_ADMIN_PASSWORD"
else
    echo "WordPress already installed, skipping installation."
fi

# Optionally install WPGraphQL plugin (disabled by default)
ENABLE_GRAPHQL=${WORDPRESS_ENABLE_GRAPHQL:-false}
if [ "$ENABLE_GRAPHQL" = "true" ]; then
    echo "Installing WPGraphQL plugin..."
    wp plugin install wp-graphql --activate --allow-root 2>/dev/null || true
    echo "GraphQL enabled at: http://localhost:8080/graphql"
else
    echo "GraphQL plugin skipped (enable with WORDPRESS_ENABLE_GRAPHQL=true)"
fi

# ============================================
# WEDDING RSVP PLUGIN & THEME
# ============================================

# Activate Wedding RSVP plugin (mounted via docker-compose volume)
echo "Activating Wedding RSVP plugin..."
if [ -d /var/www/html/wp-content/plugins/wedding-rsvp-api ]; then
    wp plugin activate wedding-rsvp-api --allow-root 2>/dev/null || true
    echo "Wedding RSVP plugin activated!"
else
    echo "Warning: wedding-rsvp-api plugin not found in plugins directory"
fi

# Optionally activate custom Wedding theme instead of headless-theme
ENABLE_CUSTOM_THEME=${WORDPRESS_ENABLE_CUSTOM_THEME:-false}
if [ "$ENABLE_CUSTOM_THEME" = "true" ]; then
    if [ -d /var/www/html/wp-content/themes/weddingrsvpblank ]; then
        echo "Activating Wedding RSVP Blank theme..."
        wp theme activate weddingrsvpblank --allow-root
    else
        echo "Warning: weddingrsvpblank theme not found, using headless-theme"
    fi
else
    echo "Using default headless theme (set WORDPRESS_ENABLE_CUSTOM_THEME=true for Wedding theme)"
fi

# Remove default themes
echo "Removing default themes..."
wp theme delete twentytwentyone --allow-root 2>/dev/null || true
wp theme delete twentytwentytwo --allow-root 2>/dev/null || true
wp theme delete twentytwentythree --allow-root 2>/dev/null || true
wp theme delete twentytwentyfour --allow-root 2>/dev/null || true
wp theme delete twentytwentyfive --allow-root 2>/dev/null || true

# Create minimal headless theme
echo "Creating minimal headless theme..."
mkdir -p /var/www/html/wp-content/themes/headless-theme
cat > /var/www/html/wp-content/themes/headless-theme/style.css << 'EOF'
/*
Theme Name: Headless Theme
Description: Minimal theme for headless WordPress
Version: 1.0
*/
EOF

cat > /var/www/html/wp-content/themes/headless-theme/index.php << 'EOF'
<?php
header('HTTP/1.1 404 Not Found');
echo 'Headless WordPress - Use REST API';
EOF

wp theme activate headless-theme --allow-root

# Set permalink structure to post name (/%postname%/)
echo "Setting permalink structure to post name..."
wp rewrite structure '/%postname%/' --hard --allow-root 2>/dev/null || true

echo "=========================================="
echo "WordPress headless setup complete!"
echo "=========================================="
echo "Site URL:    http://localhost:8080"
echo "Admin Panel: http://localhost:8080/wp-admin"
echo "REST API:    http://localhost:8080/wp-json/wp/v2/"
echo "Wedding API: http://localhost:8080/wp-json/wedding/v1/"
if [ "$ENABLE_GRAPHQL" = "true" ]; then
    echo "GraphQL:     http://localhost:8080/graphql"
fi
echo ""
echo "Admin Credentials:"
echo "  User:     ${WORDPRESS_ADMIN_USER:-admin}"
echo "  Password: ${WORDPRESS_ADMIN_PASSWORD:-admin123}"
