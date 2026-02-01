# WordPress Headless CMS + Vite/React Docker Setup

A complete Docker Compose configuration for running WordPress as a headless CMS with a Vite/React frontend. WordPress automatically installs and configures itself as a headless backend.

## Architecture

- **WordPress** (Port 8080) - Headless CMS backend with REST API
- **Vite/React** (Port 5173) - Modern frontend with hot-reload
- **MySQL** (Internal) - Database for WordPress
- **phpMyAdmin** (Port 8081) - Database management interface (optional)

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- At least 2GB free RAM
- At least 6GB free space

### 1. Setup Environment

```bash
# Make the scripts executable
chmod +x deploy.sh
chmod +x debug.sh
chmod +x wordpress-entrypoint.sh
chmod +x wordpress-setup.sh

# Copy environment file
cp .env.example .env

# (Optional) Edit .env to customize passwords
nano .env
```

### 2. Deploy Everything

```bash
# Run the deployment script
./deploy.sh
```

The script will:
- Pull all Docker images
- Start MySQL and wait for it to be healthy
- Start WordPress and run automatic setup
- Start React frontend
- Start phpMyAdmin (optional)

### 3. Access Services

Once deployment completes:

| Service | URL | Credentials | Status |
|---------|-----|-------------|--------|
| **WordPress Admin** | http://localhost:8080/wp-admin | admin / admin123 (or from .env) | Required |
| **WordPress REST API** | http://localhost:8080/wp-json/wp/v2/ | - | Required |
| **WordPress GraphQL** | http://localhost:8080/graphql | - | Optional* |
| **React Frontend** | http://localhost:5173 | - | Required |
| **phpMyAdmin** | http://localhost:8081 | root / rootpassword123 | Optional |

\* GraphQL requires setting `WORDPRESS_ENABLE_GRAPHQL=true` in `.env`

### 4. Setup React Frontend (First Time)

```bash
cd frontend

# Create new Vite React app (if starting fresh)
npm create vite@latest . -- --template react

# Or install dependencies if you have existing code
npm install

# Return to project root
cd ..
```

### 5. Connect Frontend to WordPress

Environment variables are automatically configured:

```javascript
// In your React components
const API_URL = import.meta.env.VITE_WP_API_URL; // http://localhost:8080/wp-json/wp/v2

// Fetch posts example
fetch(`${API_URL}/posts`)
  .then(res => res.json())
  .then(posts => console.log(posts));
```

### 6. Enable GraphQL (Optional)

To enable GraphQL support:

```bash
# Edit .env and add:
WORDPRESS_ENABLE_GRAPHQL=true

# Rebuild WordPress container:
docker compose up -d --build wordpress
```

Then access GraphQL at: http://localhost:8080/graphql

## Available Scripts

| Command | Description |
|---------|-------------|
| `./deploy.sh` | Full deployment with health checks |
| `./debug.sh` | Diagnose deployment issues |
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop and delete all data |
| `docker compose logs -f wordpress` | Watch WordPress logs |

## Directory Structure

```
.
├── docker-compose.yml          # Docker services configuration
├── .env.example                # Environment variables template
├── .env                        # Your environment variables
├── debug.sh                    # One-command deployment diagnosis
├── deploy.sh                   # One-command deployment script
├── wordpress-entrypoint.sh     # WordPress container entrypoint
├── wordpress-setup.sh          # WordPress automatic setup script
├── frontend/                   # Your Vite/React application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md                   # This file
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_ROOT_PASSWORD` | rootpassword123 | MySQL root password |
| `MYSQL_PASSWORD` | wordpress123 | WordPress database password |
| `WORDPRESS_ADMIN_USER` | admin | WordPress admin username |
| `WORDPRESS_ADMIN_PASSWORD` | admin123 | WordPress admin password |
| `WORDPRESS_SITE_TITLE` | Headless WordPress | Site title |
| `WORDPRESS_ENABLE_GRAPHQL` | false | Enable GraphQL plugin (set to `true` to enable) |
| `VITE_WP_API_URL` | http://localhost:8080/wp-json/wp/v2 | REST API URL |

## Troubleshooting

### Reset Everything

```bash
# Stop and remove all containers, volumes, and images
docker compose down
docker system prune -a -f --volumes
rm -f .env
cp .env.example .env
./deploy.sh
```

### MySql failed
During first deploy MySql can return `[ERROR] MySQL failed to become healthy (status: unhealthy)`

```bash
# Check the container status, Stop all the containers, and restart deploy script
docker ps
docker compose down
./deploy.sh
```

### Debug Script

If deployment fails or you're having issues, run the debug script to diagnose:

```bash
./debug.sh
```

This will check:
- Containers status and logs
- WordPress installation status
- Frontend modules and response
- Inter-containers connectivity
- Environment variables
- File existence

The script also provides quick fixes for common issues.

### WordPress stuck on language selection

The automatic setup should handle this. If not:

```bash
# Check logs
docker compose logs -f wordpress

# Or manually complete setup
docker exec -it wordpress_backend bash
wp core install --url='http://localhost:8080' --title='My Site' --admin_user='admin' --admin_password='admin123' --admin_email='admin@example.com' --allow-root
```

### Frontend hot-reload not working

Make sure `vite.config.js` includes:

```javascript
export default {
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    }
  }
}
```

### phpMyAdmin login issues

- URL: http://localhost:8081
- Server: db (leave as default or enter "db")
- Username: root
- Password: rootpassword123 (or your MYSQL_ROOT_PASSWORD from .env)

### Disable phpMyAdmin

If you don't need phpMyAdmin, comment it out in `docker-compose.yml`:

```yaml
  # phpMyAdmin (Optional) - Comment out to disable
  # phpmyadmin:
  #   image: phpmyadmin/phpmyadmin:latest
  #   ...
```

## What Gets Configured Automatically

When you run `./deploy.sh`, WordPress is automatically:

1. ✅ Installed with admin user
2. ✅ REST API enabled (always available)
3. ✅ Permalinks set to `/%postname%/` format
4. ✅ Default themes removed (twentytwenty*)
5. ✅ Minimal headless theme activated
6. ✅ CORS headers configured for API access
7. ⬜ GraphQL plugin (only if `WORDPRESS_ENABLE_GRAPHQL=true`)

## Production Considerations

1. **Change all default passwords** in `.env` file
2. **Use HTTPS** - Configure SSL certificates
3. **Backups** - Regularly backup the volumes: `docker volume ls | grep test2`
4. **Security** - Restrict phpMyAdmin access in production (or disable it)
5. **GraphQL** - Only enable if you need it

## License

MIT