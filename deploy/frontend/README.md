# Wedding RSVP Website

A premium, invite-only wedding website built with React, Tailwind CSS v4, and a headless WordPress backend.

## Quick Start

### Frontend (React)
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Start prod server
npm run build
```
Visit: `http://localhost:5173/?code=TEST123`

### Backend (WordPress)
1. Ensure WAMP/XAMPP is running
2. Create database: `wedding-rsvp`
3. Visit: `http://localhost/wp-admin`

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CityHall.jsx      # City Hall section
│   │   ├── Hero.jsx          # Countdown timer & CTA
│   │   ├── Location.jsx      # Location section
│   │   ├── OurStory.jsx      # Photo grid section
│   │   └── RSVPForm.jsx      # Multi-step form
│   │   ├── VenueLocation.jsx # Venue location section
│   │   ├── Timeline.jsx      # Event schedule
│   ├── utils/
│   │   ├── translations.js   # Translation file
│   ├── App.jsx
│   └── index.css             # Tailwind config
└── index.html
```

---

## Access Codes

| Code | Purpose |
|------|---------|
| `TEST123` | Testing |
| `LOVE2025` | Guest invite |
| `WEDDING` | Guest invite |
| `EMMA2025` | Guest invite |
| `JOHN2025` | Guest invite |

---

## Customization

### Wedding Date
Edit `src/components/Hero.jsx`:
```js
const WEDDING_DATE = new Date('2026-09-26T14:00:00');
```

### Venue Location
Edit `src/components/Location.jsx` - update the address and Google Maps embed.

### Colors
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
| `wp-json/wedding/v1/rsvp` | POST | Submit RSVP |
| `wp-json/wedding/v1/validate-code` | POST | Validate access code |

---

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4
- **Backend**: WordPress (REST API)
- **Fonts**: Playfair Display, Inter

## Troubleshooting

### REST API returns 404
If the `/wp-json/` endpoints return a 404 error:

1.  **Permalinks**: Ensure WordPress Permalinks are **NOT** set to "Plain". Set them to "Post name" in **Settings > Permalinks**.
2.  **Apache mod_rewrite**: Enable the rewrite module on your server:
    ```bash
    sudo a2enmod rewrite
    sudo systemctl restart apache2
    ```
3.  **Apache AllowOverride**: Ensure your VirtualHost configuration allows `.htaccess` overrides. Add this to your `000-default.conf`:
    ```apache
    <Directory /var/www/html>
        AllowOverride All
    </Directory>
    ```

---

## License

Private - For personal use only.