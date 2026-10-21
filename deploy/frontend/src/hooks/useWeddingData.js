import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

// Fetch settings and stories from WordPress
export default function useWeddingData() {
    const [settings, setSettings] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, storiesRes] = await Promise.all([
                    fetch(`${API_BASE}/settings`),
                    fetch(`${API_BASE}/stories`),
                ]);

                if (settingsRes.ok) {
                    setSettings(await settingsRes.json());
                } else {
                    throw new Error('Failed to load settings');
                }

                if (storiesRes.ok) {
                    setStories(await storiesRes.json());
                }
            } catch (error) {
                console.error('Failed to fetch wedding data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { settings, stories, loading, error };
}
