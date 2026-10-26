#!/bin/bash
set -e

# Custom entrypoint that runs WordPress setup after initialization

echo "=========================================="
echo "WordPress Entrypoint Wrapper"
echo "=========================================="

# Run the original WordPress entrypoint in background
docker-entrypoint.sh apache2-foreground &
WP_PID=$!

# Wait for WordPress to initialize
echo "Waiting for WordPress to initialize..."
sleep 10

# Check if WordPress files are ready
for i in {1..30}; do
    if [ -f /var/www/html/wp-config.php ]; then
        echo "WordPress initialized!"
        break
    fi
    sleep 2
done

# Wait a bit more for database connection
echo "Waiting for database connection..."
sleep 5

# Run our setup script if it exists
if [ -f /usr/local/bin/wordpress-setup.sh ]; then
    echo "Running WordPress setup script..."
    bash /usr/local/bin/wordpress-setup.sh
fi

# Trigger WP-Cron every 5 min (it otherwise only runs on site visits)
( while sleep 300; do curl -fsS -o /dev/null http://localhost/wp-cron.php || true; done ) &

# Keep Apache running
echo "WordPress is ready!"
wait $WP_PID
