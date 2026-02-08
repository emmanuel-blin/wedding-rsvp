# Wedding RSVP - Docker Deployment

A premium, invite-only wedding RSVP website with React frontend and headless WordPress backend, fully containerized for easy deployment.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐
│  React/Vite     │───▶│  WordPress       │───▶│  MySQL      │
│  Port 5173      │    │  Port 8080       │    │  (internal) │
│  (Frontend)     │    │  (REST API)      │    │             │
└─────────────────┘    └──────────────────┘    └─────────────┘
                             │
                       ┌─────┴─────┐
                       │ phpMyAdmin│
                       │ Port 8081 │
                       └───────────┘
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- 2GB+ free RAM
- 6GB+ free disk space

### Deploy

```bash
cd deploy

# Make scripts executable
chmod +x deploy.sh debug.sh wordpress-entrypoint.sh wordpress-setup.sh

# Copy environment template
cp .env.example .env

# (Optional) Edit .env to customize passwords
nano .env
```

### Deploy everything
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

### Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Wedding Site** | http://localhost:5173?code=TEST123 | - |
| **WordPress Admin** | http://localhost:8080/wp-admin | admin / admin123 |
| **WordPress GraphQL** | http://localhost:8080/graphql | - | Optional* |
| **Wedding API** | http://localhost:8080/wp-json/wedding/v1/ | - |
| **phpMyAdmin** | http://localhost:8081 | root / rootpassword123 |

#### **\* GraphQL requires setting `WORDPRESS_ENABLE_GRAPHQL=true` in `.env`**
---

## Available Scripts

| Command | Description |
|---------|-------------|
| `./deploy.sh` | Full deployment with health checks |
| `./debug.sh` | Diagnose deployment issues |
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop and delete all data |
| `docker compose logs -f wordpress` | Watch WordPress logs |

## Project Structure

```
wedding-rsvp/
├── deploy/                          # Docker deployment
│   ├── docker-compose.yml
│   ├── deploy.sh                    # One-command deploy
│   ├── debug.sh                     # Troubleshooting
│   ├── wordpress-setup.sh           # WP auto-config
│   ├── wordpress-entrypoint.sh
│   ├── .env                         # Your config
│   ├── .env.example                 # Template
│   ├── frontend/                    # React/Vite app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── OurStory.jsx
│   │   │   │   ├── Location.jsx
│   │   │   │   ├── CityHall.jsx
│   │   │   │   ├── SleepLocation.jsx
│   │   │   │   ├── Timeline.jsx
│   │   │   │   └── RSVPForm.jsx
│   │   │   └── App.jsx
│   │   └── package.json
│   ├── wp-plugins/
│   │   └── wedding-rsvp-api/        # Custom WP plugin
│   └── wp-themes/
│       └── weddingrsvpblank/        # Blank WP theme
└── README.md
```

### Enable GraphQL (Optional)

To enable GraphQL support:

```bash
# Edit .env and add:
WORDPRESS_ENABLE_GRAPHQL=true

# Rebuild WordPress container:
docker compose up -d --build wordpress
```

Then access GraphQL at: http://localhost:8080/graphql

---

## Environment Variables

Edit `deploy/.env` to customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `WORDPRESS_ADMIN_USER` | admin | WP admin username |
| `WORDPRESS_ADMIN_PASSWORD` | admin123 | WP admin password |
| `WORDPRESS_SITE_TITLE` | Headless WordPress | Site title |
| `VITE_API_BASE` | http://localhost:8080/wp-json/wedding/v1 | Wedding API URL |
| `WORDPRESS_CORS_ORIGINS` | http://localhost:5173 | Allowed CORS origins |
| `WORDPRESS_ENABLE_GRAPHQL` | false | Enable WPGraphQL plugin |

---

## API Endpoints

All endpoints under `/wp-json/wedding/v1/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/settings` | GET | Wedding settings (dates, venue, etc.) |
| `/stories` | GET | Our Story posts |
| `/validate-code` | POST | Validate access code |
| `/rsvp` | POST | Submit RSVP |

---

## Access Codes

Manage in WordPress Admin → Wedding Settings:

| Code | Purpose |
|------|---------|
| `TEST123` | Testing |
| `LOVE2025` | Guest invite |
| `WEDDING` | Guest invite |

---

## Commands

```bash
cd deploy

./deploy.sh                    # Full deployment
./debug.sh                     # Diagnose issues
docker compose down            # Stop services
docker compose down -v         # Stop + delete data
docker compose logs -f wordpress  # Watch WP logs
```


### Setup React Frontend (If you don't want to use the one in the repo)

```bash
cd frontend

# Create new Vite React app (if starting fresh)
npm create vite@latest . -- --template react

# Or install dependencies if you have existing code
npm install

# Return to project root
cd ..
```

### Connect Frontend to WordPress

Environment variables are automatically configured:

```javascript
// In your React components
const API_URL = import.meta.env.VITE_WP_API_URL; // http://localhost:8080/wp-json/wp/v2

// Fetch posts example
fetch(`${API_URL}/posts`)
  .then(res => res.json())
  .then(posts => console.log(posts));
```

---

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

### MySql health check failed
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

### REST API 404
Permalinks are auto-configured. If issues persist:
```bash
docker exec -it wordpress_backend wp rewrite flush --allow-root
```

### CORS Errors
Add your domain to `WORDPRESS_CORS_ORIGINS` in `.env`:
```env
WORDPRESS_CORS_ORIGINS=http://localhost:5173,https://your-domain.com
```

---

### Frontend hot-reload not working

Make sure `vite.config.js` includes development mode:

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