import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/translations';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';

function calculateTimeLeft(weddingDate) {
  const difference = new Date(weddingDate) - new Date();
 
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function Hero({ onRSVPClick, weddingDate, coupleNames, heroImage, heroSubtitle, heroTitle }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(weddingDate));
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const displayNames = coupleNames || ['Emma', 'John'];
  const backgroundImage = heroImage || DEFAULT_HERO_IMAGE;
  const displayHeroSubtitle = heroSubtitle || 'Together with their families';
  const displayHeroTitle = heroTitle || 'Request the pleasure of your company';
  const formattedDate = new Date(weddingDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url("${backgroundImage}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative text-center text-white px-4">
        {/* Names */}
        <p className="text-champagne tracking-[0.3em] uppercase text-sm md:text-base mb-4 animate-fade-in">
          {displayHeroSubtitle}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-2 tracking-wide">
          {displayNames[0]} & {displayNames[1]}
        </h1>
        <p className="text-champagne tracking-[0.2em] uppercase text-lg md:text-xl mb-4">
          {displayHeroTitle}
        </p>
        <p className="text-champagne tracking-[0.2em] uppercase text-xl md:text-2xl mb-8">
          {formattedDate}
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-2 md:gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-serif text-gold">{timeLeft.days}</div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-champagne/80">{t('hero.countdown_days')}</div>
          </div>
          <div className="text-3xl md:text-5xl font-light text-gold/60">:</div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-serif text-gold">{timeLeft.hours}</div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-champagne/80">{t('hero.countdown_hours')}</div>
          </div>
          <div className="text-3xl md:text-5xl font-light text-gold/60">:</div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-serif text-gold">{timeLeft.minutes}</div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-champagne/80">{t('hero.countdown_minutes')}</div>
          </div>
          <div className="text-3xl md:text-5xl font-light text-gold/60">:</div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-serif text-gold">{timeLeft.seconds}</div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-champagne/80">{t('hero.countdown_seconds')}</div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onRSVPClick}
          className="group relative inline-flex items-center justify-center px-10 py-4 text-sm 
                    md:text-base font-medium tracking-[0.2em] uppercase text-white border-2 border-gold rounded-lg bg-transparent overflow-hidden transition-all duration-500 
                    hover:text-burgundy hover:border-gold hover:bg-gold hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          <span className="relative z-10">{t('hero.rsvp_now')}</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-champagne/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
