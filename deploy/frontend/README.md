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
│   │   ├── ProgressBar.jsx    # Step progress bar used by the RSVP form
│   │   ├── ToggleGroup.jsx    # Multi-select buttons (meal options, allergens)
│   │   └── RSVPForm.jsx       # Multi-step RSVP form
│   ├── hooks/
│   │   └── useWeddingData.js  # Fetches settings + stories from WordPress
│   ├── utils/
│   │   └── translations.js    # i18n support (FR/EN, incl. fallback texts)
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

### Page title
The browser tab title and the description are built from the couple names and the date set in wp-admin (Wedding → Settings → General), in the site language (`meta.title` / `meta.description` in `translations.js`). `index.html` only holds a neutral fallback. Link previews (WhatsApp, Messenger…) read the HTML without running the app, so they show that fallback.

### Colors & Theme
The hosts pick a color theme in wp-admin (Wedding → Settings → General → Colors). `GET /settings` returns it as `theme.colors`, and `src/utils/theme.js` sets each color as the matching Tailwind variable on `<html>` (`--color-primary`, `--color-on-primary`, `--color-accent`, `--color-secondary`, `--color-surface`) before the page renders. Tokens are named by role, not by color, and components only use these names (`bg-primary`, `text-accent/80`…), so they follow the theme with no rebuild; avoid hardcoded colors (use `var(--color-accent)` in arbitrary values).

The last theme is remembered in the browser (`localStorage`, optional), so the loading screen of a later visit already uses it; on a first visit the loader is neutral (white/gray) instead of flashing the Classic colors.

`src/index.css` keeps the Classic values as fallback:
```css
@theme {
  --color-primary: #800020;
  --color-on-primary: #f7e7ce;
  --color-accent: #d4af37;
  --color-secondary: #a35663;
  --color-surface: #fdfaf5;
}
```
New palettes are added in the plugin (`includes/themes.php`), not here. Color roles in the components, so every palette stays readable (WCAG AA 4.5:1):
- `primary`: headings, buttons, footer, and text/icons placed on the accent (`bg-accent text-primary`).
- `on-primary`: light text on `primary` (footer, hero).
- `accent`: decorative only on light backgrounds (lines, borders, progress fill, selected-option tint `bg-accent/10`); as text only over the dark hero photo. Never `text-white` on it.
- `secondary`: subtitles, selected options, hover text and hover borders (`hover:text-secondary`).
- `surface`: page background.

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
**Flow:** access code → guest names → attendance → meal preferences → review → success. Names are collected *before* asking about attendance, so clicking "Regretfully decline" submits the RSVP immediately (with the names) and shows the "we will miss you" screen. The meal section is configured in wp-admin → Wedding → RSVP → Meal Options: a checkbox turns the dish choice off (fixed menu: only allergies/notes are asked), and the options list (one per line) replaces the translated defaults when filled. Allergens work the same way (Allergens box) and are always asked, as tick buttons plus a free-text "Not in the list? Tell us more" field. If a submission fails, an error is shown and the guest can retry instead of seeing a fake success screen.

The RSVP form, this will be the one that will let you know who is comming (/or is not comming (soon<sup>TM</sup>)), for now it is a fixed form, meaning it's content and steps is hard coded, but you get the first and last name of each guest if they come with a +1 or more, they can let you know if they have a specific regime or food alergies, what kind of music they want. I'm looking into make this form configurable in the wp-admin wedding plugin. This form needs a code that can be passed in the URL `/?code=TEST123` for exemple, this code can be set in wp-admin -> settings tab RSVP, this is to avoid litle smart a** to spam or worst your wordpress, every RSVP is saved in wp-admin (RSVPs) and the hosts get one email per night with the new ones (recipients set in wp-admin -> Wedding -> Emails, with a "Send email now" button; needs SMTP: see the main README, "RSVP Digest Email").

## Accessibility
Guests mostly answer on phones and some are older relatives, so the site follows WCAG 2.2 AA where the code allows it (audit with the `/a11y-check` skill):
- **Form fields:** every field has a label (`aria-label` or `htmlFor`), required names use `aria-required`, the meal/allergen choices are `fieldset`/`legend` groups with `aria-pressed` buttons, each guest row is a group named "Invité N". Field borders (`gray-500`) and the focus ring (`primary`) are at least 3:1 on the page background. The access code can be submitted with Enter.
- **Step changes:** when the guest moves to another RSVP step, focus goes to that step's heading, so screen readers announce it (including the thank-you and declined screens). Not on page load, so a `?code=` link does not jump to the form.
- **Phones:** in the guest step the age and remove controls sit under the names; the remove button is a 44px target.
- **Motion:** zoom, bounce and slide effects only run when the device does not ask for reduced motion (`motion-safe:`).
- **Page:** `<html lang="fr">` (to be updated at runtime with the v2 language toggle), one `<main>` landmark, decorative icons and emoji hidden from screen readers.
- **Colors:** every theme passes 4.5:1 for text (see Colors & Theme for the color roles); the step text uses `gray-500`.

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
