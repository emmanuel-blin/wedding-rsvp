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
│   │   ├── CityHall.jsx       # City Hall venue section
│   │   ├── SleepLocation.jsx  # Link to AirBnB and Booking.com
│   │   ├── VenueLocation.jsx  # Reception venue section
│   │   ├── Location.jsx       # Map & directions
│   │   └── RSVPForm.jsx       # Multi-step RSVP form
│   ├── utils/
│   │   └── translations.js    # i18n support
│   ├── App.jsx
│   └── index.css              # Tailwind v4 theme
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

## Components

### Hero.jsx
Hero zone, contains a background image that can be customized in wp-admin Wedding -> settings general tab, so your guests will know who you are

### OurStory.jsx
Story telling section, can be customized in wp-admin Wedding -> settings -> all stories, those are post type, like a normal wordpress post, they can have thumbnails, titles and texts. Tell your story get crative.

### Timeline.jsx
Timeline section, can be customized in the wp-admin wedding -> settings Timeline tab, this will let you set how you planned the event. we all know it won't go as you planned it but at list it is there

### CityHall.jsx / VenueLocation.jsx
Google map frame with the address of the city hall and venue location, some indications for the access, parking... buttons to add the address to waze / apple maps / google maps, so people should not be lost, they will be but at list you know where they can find the address.

### Location.jsx
just to load both previous components.

### SleepLocation.jsx
Section, where the guests can easaly get to rent a place to stay after the event, even thought we all hope the guests should not take the road after having too much wine and dancing

### RSVPForm.jsx
The RSVP form, this will be the one that will let you know who is comming (/or is not comming (soon<sup>TM</sup>)), for now it is a fixed form, meaning it's content and steps is hard coded, but you got the name of the guest if they come with a +1 or more, they can let you know if they have a specific regime or food alergies, what kind of music they want. I'm looking into make this form configurable in the wp-admin wedding plugin. This form needs a code that can be passed in the URL `/?code=TEST123` for exemple, this code can be set in wp-admin -> settings tab RSVP, this is to avoid litle smart a** to spam or worst your wordpress, it is set to send an email to with the infos to the admin email.

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

## License

Private - For personal use only.
