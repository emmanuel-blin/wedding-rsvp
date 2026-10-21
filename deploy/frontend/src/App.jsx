import { useRef, useState } from 'react';
import packageJson from '../package.json';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import Location from './components/Location';
import CityHall from './components/CityHall';
import SleepLocation from './components/SleepLocation';
import Timeline from './components/Timeline';
import RSVPForm from './components/RSVPForm';
import { useTranslation } from 'react-i18next';
import useWeddingData from './hooks/useWeddingData';
import './utils/translations';
import './App.css';

function App() {
    const rsvpRef = useRef(null);
    // Access code from the invitation URL (?code=...)
    const [accessCode] = useState(() => new URLSearchParams(window.location.search).get('code'));
    const { settings, stories, loading, error } = useWeddingData();
    const { t } = useTranslation();

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
    const heroSubtitle = settings?.hero?.subtitle || t('defaults.hero_subtitle');
    const heroTitle = settings?.hero?.title || t('defaults.hero_title');
    const locationTitle = settings?.location?.title || t('sections.location');
    const locationSubtitle = settings?.location?.subtitle || t('sections.location_sub');

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
