// wp-admin color theme (GET /settings theme.colors) applied to the Tailwind --color-* tokens
const TOKENS = {
    primary: '--color-primary',
    onPrimary: '--color-on-primary',
    accent: '--color-accent',
    secondary: '--color-secondary',
    surface: '--color-surface',
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

// Remembered for the next visit's loader (optional: storage can be blocked)
const STORAGE_KEY = 'wedding-theme-colors';

function setColors(colors) {
    Object.entries(TOKENS).forEach(([key, cssVar]) => {
        if (HEX_COLOR.test(colors?.[key] ?? '')) {
            document.documentElement.style.setProperty(cssVar, colors[key]);
        }
    });
}

export function applyTheme(theme) {
    const colors = theme?.colors;
    if (!colors) return;

    setColors(colors);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch {
        // Storage blocked: the loader stays neutral
    }
}

// False when no theme is remembered
export function applyCachedTheme() {
    try {
        const colors = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!colors) return false;
        setColors(colors);
        return true;
    } catch {
        return false;
    }
}
