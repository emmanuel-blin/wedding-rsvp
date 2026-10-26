import { useEffect, useRef, useState } from 'react';
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
import { applyCachedTheme } from './utils/theme';
import './utils/translations';
import './App.css';

function App() {
    const rsvpRef = useRef(null);
    // Access code from the invitation URL (?code=...)
    const [accessCode] = useState(() => new URLSearchParams(window.location.search).get('code'));
    // Remembered theme; without one the loader stays neutral
    const [themeKnown] = useState(applyCachedTheme);
    const { settings, stories, loading, error } = useWeddingData();
    const { t } = useTranslation();

    // Browser tab title and description from the couple names and date set in wp-admin
    useEffect(() => {
        if (!settings?.coupleNames || !settings?.weddingDate) return;
        const [name1, name2] = settings.coupleNames;
        const date = new Date(settings.weddingDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        document.title = t('meta.title', { name1, name2, date });
        document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description', { name1, name2, date }));
    }, [settings, t]);

    const scrollToRSVP = () => {
        rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
        <div className={`min-h-screen flex items-center justify-center ${themeKnown ? 'bg-surface' : 'bg-white'}`}>
            <div role="status" className={`text-xl ${themeKnown ? 'text-primary' : 'text-gray-600'}`}>{t('common.loading')}</div>
        </div>
        );
    }

    if (error || !settings) {
        return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="text-center max-w-md">
            <p className="text-primary text-lg">{t('common.api_error')}</p>
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
        <div className="min-h-screen bg-surface">
        <main>
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
            <div className="text-center mb-16">
                <p className="text-secondary tracking-[0.3em] uppercase text-sm mb-2">{locationSubtitle}</p>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary">{locationTitle}</h2>
                <div className="mt-4 w-24 h-px bg-accent mx-auto"></div>
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
        </main>

        <footer className="py-8 bg-primary text-center">
            <p className="text-on-primary/80 text-sm tracking-widest uppercase">
            {coupleNames[0]} & {coupleNames[1]} • {new Date(weddingDate).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="flex gap-2 justify-center">
            <p className="text-on-primary/60 text-xs mt-2">
                Version {packageJson.version}
            </p>
            <p className="text-on-primary/60 text-xs mt-2">
                {t('common.made_with_love')}
            </p>
            </div>
        </footer>
        </div>
    );
}

export default App;
