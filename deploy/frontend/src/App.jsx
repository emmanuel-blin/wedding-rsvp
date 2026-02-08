import { useRef, useEffect, useState } from 'react';
import packageJson from '../package.json';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import Location from './components/Location';
import CityHall from './components/CityHall';
import SleepLocation from './components/SleepLocation';
import Timeline from './components/Timeline';
import RSVPForm from './components/RSVPForm';
import { useTranslation } from 'react-i18next';
import './utils/translations';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const rsvpRef = useRef(null);
  const [accessCode, setAccessCode] = useState(null);
  const [settings, setSettings] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  // Fetch settings and stories from WordPress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, storiesRes] = await Promise.all([
          fetch(`${API_BASE}/settings`),
          fetch(`${API_BASE}/stories`),
        ]);
        
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        } else {
          throw new Error('Failed to load settings');
        }
        
        if (storiesRes.ok) {
          const storiesData = await storiesRes.json();
          setStories(storiesData);
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

  // Check for access code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setAccessCode(code);
    }
  }, []);

  const scrollToRSVP = () => {
    rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-burgundy text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  // Show error state
  if (error || !settings) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-burgundy text-lg">{t('common.api_error')}</p>
        </div>
      </div>
    );
  }

  const coupleNames = settings?.coupleNames || ['Emma', 'John'];
  const weddingDate = settings?.weddingDate || '2026-09-26T14:00:00';
  const heroSubtitle = settings?.hero.subtitle || 'Together with their families';
  const heroTitle = settings?.hero.title || 'Request the pleasure of your company';
  const locationTitle = settings?.location.title || 'Location';
  const locationSubtitle = settings?.location.subtitle || 'Find Your Way';

  return (
    <div className="min-h-screen bg-cream">
      <Hero 
        onRSVPClick={scrollToRSVP} 
        weddingDate={weddingDate}
        coupleNames={coupleNames}
        heroImage={settings?.heroImage}
        heroSubtitle={heroSubtitle}
        heroTitle={heroTitle}
      />
      <OurStory stories={stories} ourStory={settings?.ourStory} />
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-rose-gold tracking-[0.3em] uppercase text-sm mb-2">{locationSubtitle}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-burgundy">{locationTitle}</h2>
            <div className="mt-4 w-24 h-[1px] bg-gold mx-auto"></div>
          </div>
          <CityHall cityHall={settings?.cityHall} />
          <Location venue={settings?.venue} />
           <SleepLocation sleepLocation={settings?.sleepLocation} />
        </div>
      </section>
      <Timeline timeline={settings?.timeline} />
      <div ref={rsvpRef}>
        <RSVPForm accessCode={accessCode} formHead={settings?.form} />
      </div>

      {/* Footer */}
      <footer className="py-8 bg-burgundy text-center">
        <p className="text-champagne/80 text-sm tracking-widest uppercase">
          {coupleNames[0]} & {coupleNames[1]} • {new Date(weddingDate).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <div className="flex gap-2 justify-center">
          <p className="text-champagne/60 text-xs mt-2">
            Version {packageJson.version}
          </p>
          <p className="text-champagne/60 text-xs mt-2">
            Made with love
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
