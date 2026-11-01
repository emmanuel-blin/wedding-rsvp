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

# Edit .env and replace every CHANGE_ME value (WORDPRESS_ADMIN_PASSWORD is required, and the
# first install refuses the CHANGE_ME placeholder)
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
| **Wedding Site** | http://localhost:5173?code=YOUR-CODE | - |
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
│   │       ├── index.php            # Plugin entry (version, includes)
│   │       ├── admin-setup.php      # Registered settings
│   │       ├── admin-settings.php   # wp-admin "Wedding" settings tabs
│   │       └── includes/
│   │           ├── api-read.php     # GET /settings, /stories
│   │           ├── api-rsvp.php     # POST /rsvp, /validate-code, nightly digest email, SMTP
│   │           ├── rsvp-type.php    # RSVP post type + admin columns
│   │           └── cors.php         # CORS headers (WORDPRESS_CORS_ORIGINS)
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
| `WORDPRESS_ADMIN_PASSWORD` | *(none, required)* | WP admin password, **only used at the first install** (the first install refuses `CHANGE_ME` values). Changing it here later does nothing: see [Rotating passwords](#rotating-passwords) |
| `WORDPRESS_SITE_TITLE` | Headless WordPress | Site title |
| `HOST_URL` | localhost | Public hostname of the **frontend** (no scheme, no port). Added to Vite's `server.allowedHosts` |
| `WP_HOME` / `WP_SITEURL` | http://localhost:8080 | Public URL of **WordPress** |
| `VITE_API_BASE` | http://localhost:8080/wp-json/wedding/v1 | Wedding API URL, as seen from the **browser** |
| `WORDPRESS_CORS_ORIGINS` | http://localhost:5173 | Allowed CORS origins (the frontend's public origin, no port/path unless needed) |
| `WORDPRESS_ENABLE_GRAPHQL` | false | Enable WPGraphQL plugin (setting it back to `false` deactivates the plugin at the next start) |
| `BIND_ADDR` | 0.0.0.0 | Address the frontend (5173) and WordPress (8080) ports listen on. Use `127.0.0.1` when your reverse proxy or tunnel runs on the same host |
| `WORDPRESS_ADMIN_EMAIL` | admin@example.com | WP admin email, **only used at the first install** (later: WP Admin → Settings → General). Receives the RSVP digest when no recipient is set in Wedding → Emails |
| `WEDDING_DIGEST_HOUR` | 2 | Hour (0-23) of the nightly RSVP digest, in the WordPress timezone (Settings → General, UTC by default) |
| `WEDDING_SMTP_HOST` | *(empty)* | SMTP server. **Required to send any email**: the WordPress image has no sendmail |
| `WEDDING_SMTP_PORT` | 587 | SMTP port |
| `WEDDING_SMTP_SECURE` | tls | `tls` (587), `ssl` (465) or `none` |
| `WEDDING_SMTP_USER` / `WEDDING_SMTP_PASS` | *(empty)* | SMTP login (e.g. a Gmail address + an app password) |
| `WEDDING_SMTP_FROM` | `WEDDING_SMTP_USER` | Sender address (most providers only accept a verified one) |

### Rotating passwords

`WORDPRESS_ADMIN_PASSWORD` and the `MYSQL_*` passwords are only applied the first time the stack is created (WordPress install, empty database volume). Editing `.env` afterwards changes nothing in the running site. To rotate them:

```bash
# WordPress admin: wp-admin -> Users, or
docker exec wordpress_backend wp user update <user> --user_pass='a-new-long-password' --allow-root

# MySQL: change the user's password inside the db container, then update MYSQL_PASSWORD in .env
# and recreate the containers (ALTER USER 'wordpress'@'%' IDENTIFIED BY '...';)
```

Older revisions of this repository shipped example passwords (`admin123`, ...) that remain in the git history: if a site was ever installed with them, rotate them.

> `VITE_API_BASE` is read when the frontend container starts. After changing it (or any `.env` value), recreate the container: `docker compose up -d --force-recreate frontend`. A plain restart does not pick up new env vars.

---

## API Endpoints

All endpoints under `/wp-json/wedding/v1/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/settings` | GET | Wedding settings (dates, venue, etc.) |
| `/stories` | GET | Our Story posts |
| `/validate-code` | POST | Validate access code |
| `/rsvp` | POST | Submit RSVP (saved as an RSVP post, included in the next [nightly digest](#rsvp-digest-email)) |

---

## Access Codes

Manage in WordPress Admin → Wedding → RSVP → **Access Codes** (one per line, not case-sensitive).

- There is **no built-in code**: until you add one, nobody can send an RSVP (the settings page tells you).
- Use a long random code, 10 characters or more (e.g. `A7K9Q2XM4PLR`), and put the **same code** on the printed invitation and in the link of its QR code (`https://your-site/?code=A7K9Q2XM4PLR`). Guests who scan the QR code never type anything; guests who type it can use any capitalisation.
- The page removes `?code=` from the address bar after reading it (kept for the visit only), so it does not stay in the browser history or in a shared screenshot.
- A visitor who sends 20 wrong codes within 15 minutes is blocked for a while (right codes are never counted, other visitors are not affected). Behind a tunnel or proxy on a private address, the visitor address comes from the `CF-Connecting-IP` header.
- One code is shared by all guests: anyone holding it could answer in another guest's name. A resubmission with the same code and the same guest names replaces the previous answer (no double counting). A code per invitation is on the backlog.
- An RSVP accepts at most 20 guests, names up to 80 characters, dietary notes up to 1000 and a song request up to 200.

---

## Meal Options

Manage in WordPress Admin → Wedding Settings → RSVP → **Meal Options**:

- **Ask for a meal choice** (checkbox, on by default): untick it when the menu is already decided. Guests are then only asked for allergies / dietary notes and a song request, and no meal row appears in the review or the email. Tick it again if you want guests to choose.
- **Options**: one option per line, shown to guests exactly as written (use your site's language). Leave it empty to use the built-in translated list (Meat, Fish, Gluten Free, Vegetarian, Vegan). With a fixed menu you can keep only the special diets, e.g. `Vegetarian` and `Vegan`.

The guest's choices are saved with the RSVP and included in the notification email. The API exposes both settings in `GET /wp-json/wedding/v1/settings` as `form.askMealChoice` and `form.mealOptions`.

### Allergens

Same page, **Allergens** box: one allergen per line, shown to guests as tick buttons (same look as the meal options). Leave it empty to use the built-in translated list (Gluten, Milk, Eggs, Peanuts, Tree nuts, Fish, Shellfish, Soy, Sesame). Below the buttons, guests also get a short free-text field ("Not in the list? Tell us more") for anything else. Both are saved with the RSVP, shown in an **Allergens** column of the RSVP list and included in the email. Exposed as `form.allergens`.

---

## RSVP Digest Email

The hosts get **one email per night** listing the RSVPs received since the previous one (guests, attendance, meal, allergens, notes, song), plus running totals. No new RSVP = no email. Guests never receive an email; every RSVP is also visible in WP Admin → RSVPs.

- **Recipients**: WP Admin → Wedding → Settings → **Emails** tab, one address per line (e.g. both hosts). Leave empty to use the WordPress admin email. Handy when you host the site for a couple: you stay the WordPress admin, they get the digest. Invalid addresses are dropped with a warning when saving.
- Sent at `WEDDING_DIGEST_HOUR` (default 2 am, WordPress timezone: set it in Settings → General, it is UTC by default). The Emails tab shows how many RSVPs are waiting and when the next digest is due.
- **Send email now** (same tab): sends the waiting RSVPs right away and shows the result once (sent / nothing new / already sending / failed). It does not save the settings: save first if you changed the recipients. A lock prevents the button and the nightly run from emailing the same RSVPs twice.
- Needs SMTP (`WEDDING_SMTP_*` in `.env`), then `docker compose up -d wordpress` to apply.
- If sending fails, the RSVPs stay pending and are retried the next night. Errors are logged: `docker logs wordpress_backend 2>&1 | grep "Wedding RSVP"`.
- WP-Cron only runs when someone visits the site, so `wordpress-entrypoint.sh` runs a small background loop inside the WordPress container that calls `http://localhost/wp-cron.php` every 5 minutes. The digest therefore leaves within 5 minutes of the set hour, with no extra container and nothing to install on the host. Check the next run: `docker exec wordpress_backend wp cron event list --allow-root` (`wedding_rsvp_digest`).
- From the command line: `docker exec wordpress_backend wp cron event run wedding_rsvp_digest --allow-root` (a mail error is then printed in your terminal, not in `docker logs`). To resend RSVPs already emailed: `wp post meta update <id> notified 0 --allow-root`, then send again.

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
4. **Ports** - Only the frontend (`5173`) and WordPress (`8080`) should be reachable, and only from your reverse proxy or tunnel: set `BIND_ADDR=127.0.0.1` when it runs on the same host, otherwise restrict these two ports to the proxy's address with a firewall (ports published by Docker bypass host firewalls such as ufw). MySQL is not published and phpMyAdmin is bound to `127.0.0.1`. Stop phpMyAdmin when you are done with it. Rate limits on `/wp-login.php` and `/wp-json/wedding/v1/*` at your proxy are a good addition
5. **First install** - WordPress is installed by `wordpress-setup.sh`; until it has run, a small must-use plugin (`deploy/wp-mu-plugins/wedding-install-guard.php`) answers 503 to every web request, so nobody can claim the site through WordPress's web installer
6. **Networks** - `db`, `wordpress` and `phpmyadmin` share `backend_net`; the frontend is alone on `frontend_net`, so it cannot reach MySQL
7. **Resource limits** - Memory is capped per container in `docker-compose.yml` (db 512M, wordpress 512M, frontend 512M, phpmyadmin 128M) so one runaway container cannot freeze the host. Raise them if a container gets OOM-killed (`docker inspect <name> --format '{{.State.OOMKilled}}'`)
8. **GraphQL** - Only enable if you need it
9. **Frontend** - The stack runs the Vite dev server (with polling for the bind mount). That is fine for a short-lived, invite-only site; serve a static build instead if it becomes long-lived
10. **Email** - Set `WEDDING_SMTP_*` and the digest recipients (Wedding → Emails), otherwise the hosts get no RSVP email at all. Send a test digest before the invitations go out (see [RSVP Digest Email](#rsvp-digest-email))

## Plugin Changelog

### 1.3.0
- **Access codes**: no built-in default codes any more (the gate stays closed until a code is set, with a notice on the settings page); strict comparison; wrong codes are counted per visitor (20 per 15 minutes, `429` afterwards) on `/validate-code` and `/rsvp`; the visitor address comes from `CF-Connecting-IP` when the request arrives from a private address (tunnel/proxy).
- **RSVP limits**: at most 20 guests (`400` beyond), names 80 characters, dietary notes 1000, song request 200, 10 meal/allergen items of 80 characters. Same code + same guest names = the new answer replaces the previous one (`updated_at` meta, flagged "Updated answer" in the next digest) instead of a duplicate.
- **Permissions**: RSVPs and stories have their own capabilities and are no longer open to Contributors, Authors and Editors; the Wedding settings, the RSVP list and "Send email now" use `manage_wedding`. New **Wedding host** role (RSVPs, stories, Wedding settings, no other WordPress administration) and the capabilities are given to administrators too (synced once, `wedding_caps_version` option). The raw custom fields box is removed from RSVPs and the list columns are escaped.
- **Digest**: at most 100 RSVPs per email (a follow-up email is scheduled 5 minutes later when more are waiting), totals computed with SQL, multi-line dietary notes indented so they cannot pass for another entry.
- **Headless hardening**: XML-RPC answers `403`, sitemaps and the public user list (`/wp/v2/users`, `?author=`) are off for visitors who are not logged in, "Lost your password?" is limited to 3 requests per hour per visitor and per account. `wordpress-setup.sh` also closes comments and pings, removes the sample post/page, deactivates WPGraphQL when the flag is off, refuses `CHANGE_ME` admin passwords on the first install and warns if the admin user is missing. The plugin, the themes and the generated headless theme declare `Update URI: false` (no WordPress.org update offers for their names).
- **Frontend**: the Google Maps iframes no longer send the full page URL (and the invite code) as Referer; the invite code is read from the QR link, kept in `sessionStorage` and removed from the address bar.
- **Deployment**: install guard (must-use plugin) against a web install before the setup script ran, working WordPress healthcheck, `BIND_ADDR` for the published ports.

### 1.2.1
- **Nightly digest email** for the hosts replaces the email sent on each RSVP (none was actually sent before: the WordPress image has no sendmail). New RSVPs are saved with `notified=0`, the WP-Cron event `wedding_rsvp_digest` emails them once a night at `WEDDING_DIGEST_HOUR` and flips them to `1` only if sending worked. The event is rescheduled by itself when the hour, the timezone or DST changes, and cleared when the plugin is deactivated. `wordpress-entrypoint.sh` now triggers WP-Cron every 5 minutes from inside the WordPress container, so it doesn't depend on site visits (no extra service). A lock (`wedding_digest_lock` option, taken over after 10 minutes) prevents the nightly run and the button from sending the same RSVPs twice.
- **Guest first and last names**: the RSVP form asks for a first name and a last name for every guest (both required, to tell apart guests with the same first name); added guests get the first guest's last name prefilled. Continue explains which names are missing, the age select and the remove-guest button have accessible labels, and errors are announced (`role="alert"`). The API takes `guests[].firstName` / `lastName` and stores `firstName`, `lastName`, `name` (full) and `ageCategory`; the RSVP title and the digest show full names. Translation keys `rsvp.first_name` / `rsvp.last_name` replace `rsvp.full_name` / `rsvp.guest_name`.
- **SMTP** through `phpmailer_init`, configured with the `WEDDING_SMTP_*` env variables; mail errors are logged (`docker logs wordpress_backend`).
- **Digest recipients + "Send email now"** in Wedding → Emails: option `wedding_digest_recipients` (one email per line, validated on save, empty = WordPress admin email), a button that sends the pending RSVPs at once (`admin-post.php?action=wedding_send_digest`, nonce + `manage_options`), plus the pending count and next run; its result is shown once (passed through a transient). The settings page now shows WordPress notices ("Settings saved", invalid addresses). `wedding_send_rsvp_digest()` returns the number of RSVPs sent, `0`, `false` (failed) or `null` (already sending).
- **Guests payload hardened**: each guest's `name` and `ageCategory` are sanitised (unknown age → `adult`, rows without a name dropped) before being stored; the `guests` JSON meta keeps quotes and accents (it was corrupted on save); no PHP warning when `guests` is missing. `POST /rsvp` returns 400 when no guest has a name; the old `{name}` guest shape is still accepted for forms loaded before the update. Names are decoded in the plain-text email (no more `&amp;`).
- RSVPs saved before 1.2.1 have no `notified` flag and are not included in any digest (they are still in WP Admin → RSVPs).

### 1.2.0
- Meal choice fixed (it was never saved), meal options and allergens configurable in wp-admin, "Ask for a meal choice" checkbox.

## License

MIT