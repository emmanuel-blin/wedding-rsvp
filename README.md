# Wedding RSVP - Docker Deployment

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=white)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![YAML](https://img.shields.io/badge/yaml-%23ffffff.svg?style=for-the-badge&logo=yaml&logoColor=158860)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

</div>

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
                       │ 127.0.0.1 │
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

# Edit .env and replace every CHANGE_ME value (passwords are required:
# docker compose refuses to start without WORDPRESS_ADMIN_PASSWORD)
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
| **WordPress Admin** | http://localhost:8080/wp-admin | `WORDPRESS_ADMIN_USER` / `WORDPRESS_ADMIN_PASSWORD` from `.env` |
| **WordPress GraphQL** | http://localhost:8080/graphql | - | Optional* |
| **Wedding API** | http://localhost:8080/wp-json/wedding/v1/ | - |
| **phpMyAdmin** | http://localhost:8081 (host machine only**) | root / `MYSQL_ROOT_PASSWORD` from `.env` |

#### **\* GraphQL requires setting `WORDPRESS_ENABLE_GRAPHQL=true` in `.env`**
#### **\*\* phpMyAdmin is bound to `127.0.0.1`, see [phpMyAdmin access](#phpmyadmin-access)**
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
| `MYSQL_ROOT_PASSWORD` | *(none, required)* | MySQL root password |
| `MYSQL_PASSWORD` | *(none, required)* | MySQL password for the WordPress user |
| `WORDPRESS_ADMIN_USER` | admin | WP admin username |
| `WORDPRESS_ADMIN_PASSWORD` | *(none, required)* | WP admin password |
| `WORDPRESS_SITE_TITLE` | Headless WordPress | Site title |
| `HOST_URL` | localhost | Public hostname of the **frontend** (no scheme, no port). Added to Vite's `server.allowedHosts` |
| `WP_HOME` / `WP_SITEURL` | http://localhost:8080 | Public URL of **WordPress** |
| `VITE_API_BASE` | http://localhost:8080/wp-json/wedding/v1 | Wedding API URL, as seen from the **browser** |
| `WORDPRESS_CORS_ORIGINS` | http://localhost:5173 | Allowed CORS origins (the frontend's public origin, no port/path unless needed) |
| `WORDPRESS_ENABLE_GRAPHQL` | false | Enable WPGraphQL plugin |

> `VITE_API_BASE` is read when the frontend container starts. After changing it (or any `.env` value), recreate the container: `docker compose up -d --force-recreate frontend`. A plain restart does not pick up new env vars.

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
wp core install --url='http://localhost:8080' --title='My Site' --admin_user='admin' --admin_password='<your-admin-password>' --admin_email='admin@example.com' --allow-root
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

> If the browser says `CORS request did not succeed` with `Status code: (null)`, the request never got a response. That is a network problem, not a missing header: check that `VITE_API_BASE` points at a URL that is actually reachable (see [Public domain setup](#public-domain-setup)).

### Vite: "Blocked request. This host is not allowed"
Vite only accepts `localhost` and IPs by default. Set `HOST_URL` in `.env` to the frontend's public hostname (e.g. `rsvp.example.com`, no `https://`, no port), then recreate the frontend container:
```bash
docker compose up -d --force-recreate frontend
```

### `JSON.parse: unexpected character at line 1 column 1`
The frontend received HTML instead of JSON from the API. Usual causes:
1. `VITE_API_BASE` is wrong, stale, or the frontend container was restarted instead of recreated. Vite then answers with its own `index.html`.
2. A Cloudflare Access / tunnel error page is in front of WordPress.
3. WordPress redirects or returns a 404 page (check `WP_HOME`, `WP_SITEURL` and permalinks).

Open DevTools → Network, click the failed request and look at its URL and response body. Verify with `curl -i <VITE_API_BASE>/settings`.

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

### phpMyAdmin access

phpMyAdmin is published on `127.0.0.1:8081` only, so it is **not** reachable from other machines. The server is fixed to `db`.

- URL: http://localhost:8081 (on the machine running Docker)
- Username: root
- Password: your `MYSQL_ROOT_PASSWORD` from `.env`

To reach it from your own computer when Docker runs on a remote host (LXC/VM), use an SSH tunnel:
```bash
ssh -L 8081:127.0.0.1:8081 user@<host>
# then open http://localhost:8081 locally
```

### Disable phpMyAdmin

Once the site is set up you don't need it running. Stop it with `docker compose stop phpmyadmin`, or comment it out in `docker-compose.yml`:

```yaml
  # phpMyAdmin (Optional) - Comment out to disable
  # phpmyadmin:
  #   image: phpmyadmin/phpmyadmin:5.2
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

## Public domain setup

The frontend (Vite, `:5173`) and WordPress (`:8080`) are two separate services, so a public deployment (e.g. behind a Cloudflare Tunnel) needs **two hostnames**, each served over HTTPS on 443:

| Hostname (example) | Points to |
|--------------------|-----------|
| `rsvp.example.com` | frontend, `http://<host>:5173` |
| `wp-rsvp.example.com` | WordPress, `http://<host>:8080` |

```env
HOST_URL=rsvp.example.com
WP_HOME=https://wp-rsvp.example.com
WP_SITEURL=https://wp-rsvp.example.com
VITE_API_BASE=https://wp-rsvp.example.com/wp-json/wedding/v1
WORDPRESS_CORS_ORIGINS=https://rsvp.example.com
```

Do not put a port (`:8080`) in public URLs: the tunnel only serves the hostname on 443. Recreate the containers after changing `.env`:
```bash
docker compose up -d --force-recreate frontend wordpress
```

## Production Considerations

1. **Replace all `CHANGE_ME` passwords** in `.env` (the WordPress admin is publicly reachable)
2. **Use HTTPS** - Configure SSL certificates (or terminate TLS at the tunnel/proxy)
3. **Backups** - Regularly backup the volumes: `docker volume ls | grep test2`
4. **Ports** - Only the frontend (`5173`) and WordPress (`8080`) should be reachable; MySQL is not published and phpMyAdmin is bound to `127.0.0.1`. Stop phpMyAdmin when you are done with it
5. **Networks** - `db`, `wordpress` and `phpmyadmin` share `backend_net`; the frontend is alone on `frontend_net`, so it cannot reach MySQL
6. **Resource limits** - Memory is capped per container in `docker-compose.yml` (db 512M, wordpress 512M, frontend 512M, phpmyadmin 128M) so one runaway container cannot freeze the host. Raise them if a container gets OOM-killed (`docker inspect <name> --format '{{.State.OOMKilled}}'`)
7. **GraphQL** - Only enable if you need it
8. **Frontend** - The stack runs the Vite dev server (with polling for the bind mount). That is fine for a short-lived, invite-only site; serve a static build instead if it becomes long-lived

## License

MIT