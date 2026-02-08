# Wedding RSVP Website

A premium, invite-only wedding website built with React, Tailwind CSS v4, and a headless WordPress backend.

---

## Content Management

All wedding content is configured in the **WordPress Admin Dashboard**:

1. Visit: `http://localhost:8080/wp-admin`
2. Go to **Wedding Settings** in the sidebar
3. Configure:
   - Date & Time, Couple Names, Hero Image
   - Venues (City Hall & Reception)
   - Timeline Schedule
   - Story, Location, Accommodation sections
   - RSVP Form & Access Codes

The React frontend fetches all content dynamically from WordPress REST API.

---

## Quick Start

### Frontend (React)
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Start prod server
npm run build && npm run preview
```

Visit: `http://localhost:5173/?code=TEST123`

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Hero.jsx           # Hero section with countdown
│   │   ├── OurStory.jsx       # Story/Photo grid section
│   │   ├── Timeline.jsx       # Event schedule
│   │   ├── CityHall.jsx      # City Hall venue section
│   │   ├── VenueLocation.jsx # Reception venue section
│   │   ├── Location.jsx      # Map & directions
│   │   └── RSVPForm.jsx      # Multi-step RSVP form
│   ├── utils/
│   │   └── translations.js   # i18n support
│   ├── App.jsx
│   └── index.css             # Tailwind v4 theme
└── index.html
```

---

## Access Codes

| Code | Purpose |
|------|---------|
| `TEST123` | Testing / Development |
| `LOVE2025` | Guest invite |
| `WEDDING` | Guest invite |
| `EMMA2025` | Guest invite |
| `JOHN2025` | Guest invite |

Add/remove codes in **Wedding Settings > RSVP** tab in WordPress admin.

---

## Customization

### Colors & Theme
Edit `src/index.css`:
```css
@theme {
  --color-burgundy: #800020;
  --color-gold: #c4a12eff;
  --color-cream: #fdfaf5;
}
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `wp-json/wedding/v1/settings` | GET | Fetch all wedding settings |
| `wp-json/wedding/v1/rsvp` | POST | Submit RSVP response |
| `wp-json/wedding/v1/validate-code` | POST | Validate access code |
| `wp-json/wp/v2/rsvp-responses` | GET | List all RSVPs (admin) |

---

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4
- **Backend**: WordPress (headless REST API)
- **Database**: MySQL 8.0
- **Fonts**: Playfair Display (headings), Inter (body)

---

## Deployment

Run the full stack deployment script:
```bash
cd deploy
./deploy/deploy.sh
```

This starts: MySQL, WordPress, and React frontend containers.

---

## Troubleshooting

### REST API returns 404
If the `/wp-json/` endpoints return a 404 error:

1. **Permalinks**: Ensure WordPress Permalinks are **NOTPlain". Set them** set to " to "Post name" in **Settings > Permalinks**.
2. **Apache mod_rewrite**: Enable the rewrite module:
    ```bash
    sudo a2enmod rewrite
    sudo systemctl restart apache2
    ```
3. **Apache AllowOverride**: Ensure VirtualHost allows `.htaccess` overrides:
    ```apache
    <Directory /var/www/html>
        AllowOverride All
    </Directory>
    ```

### Changes not appearing
After updating WordPress settings, hard refresh the React app or clear browser cache.

---

### TODO
1. Create a simple API utility to remove duplication
2. Create a proper useWeddingData hook for better abstraction
3. Leave it as-is since it's already working well

## License

Private - For personal use only.
