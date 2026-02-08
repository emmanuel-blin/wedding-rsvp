import { useTranslation } from 'react-i18next';

export default function VenueLocation({ 
  title, 
  address, 
  description, 
  gettingThere = [], 
  mapOrder = "ltr" ,
}) {
  const encodedAddress = encodeURIComponent(address);
  const { t } = useTranslation();

  const mapLinks = [
    {
      name: "Google Maps",
      url: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
    },
    {
      name: "Waze",
      url: `https://waze.com/ul?q=${encodedAddress}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
    },
    {
      name: "Apple Maps",
      url: `http://maps.apple.com/?q=${encodedAddress}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-center last:mb-0">
      {/* Map */}
      <div className={`relative ${mapOrder === "rtl" ? "lg:order-2" : ""}`}>
        <div className="relative overflow-hidden rounded-sm shadow-sm border border-champagne/20">
          <iframe
            src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-64 md:h-96 pointer-events-none md:pointer-events-auto"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${title} Location`}
          ></iframe>
        </div>
      </div>

      {/* Details */}
      <div className={`flex flex-col justify-center ${mapOrder === "rtl" ? "lg:order-1" : ""}`}>
        <h3 className="font-serif text-2xl md:text-3xl text-burgundy mb-4">{title}</h3>
        {description && (
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {/* Address */}
        <div className="bg-cream p-6 rounded-sm mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{t('location.address')}</p>
          <p className="text-gray-800 select-all">{address}</p>
        </div>

        {/* Getting There */}
        {gettingThere.length > 0 && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">{t('location.getting_there')}</p>
            <ul className="text-gray-600 space-y-2">
              {gettingThere.filter(item => item && item.trim() !== "").map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mapLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 shadow-md hover:shadow-xl border-2 border-transparent hover:border-gold text-burgundy hover:text-gold rounded-sm transition-all duration-300 text-sm uppercase tracking-wider bg-cream active:bg-white hover:bg-white "
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
