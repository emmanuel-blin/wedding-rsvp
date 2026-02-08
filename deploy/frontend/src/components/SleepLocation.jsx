import { useTranslation } from 'react-i18next';
import '../utils/translations';

export default function SleepLocation({ sleepLocation: apiSleepLocation }) {
  const { t } = useTranslation();
  const sleepLocation = apiSleepLocation || {};
  
  const subtitle = sleepLocation.subtitle || 'Need a Place to Stay';
  const title = sleepLocation.title || 'Accommodation';
  const description = sleepLocation.description || "Looking for a place to stay? We've partnered with local accommodations to make your visit comfortable. Book your stay near the venue using the links below.";
  const venueName = sleepLocation.venueName || 'The venue name';
  
  // Generate booking URLs with venue name as search parameter
  const airbnbUrl = `https://www.airbnb.com/s/${encodeURIComponent(venueName)}/homes`;
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(venueName)}`;
  
  const bookingServices = [
    {
      name: 'Airbnb',
      url: airbnbUrl,
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="96" height="96" viewBox="0 0 48 48">
            <path fill="#ff5252" d="M42.459,32.519c-1.037-3.336-9.539-19.596-12.12-24.5l-0.026-0.048C29.153,5.559,26.676,4,24,4 s-5.153,1.559-6.291,3.929L17.661,8.02C15.08,12.923,6.578,29.183,5.542,32.518C5.261,33.421,5,34.407,5,35.5 c0,4.687,3.813,8.5,8.5,8.5c4.654,0,7.612-1.949,10.5-5.184C26.888,42.051,29.846,44,34.5,44c4.687,0,8.5-3.813,8.5-8.5 C43,34.407,42.739,33.421,42.459,32.519z M23.999,34.662C22.33,32.515,20,28.881,20,26c0-2.206,1.794-4,4-4s4,1.794,4,4 C28,28.872,25.668,32.511,23.999,34.662z M34.5,41c-3.287,0-5.521-1.107-8.325-4.258C27.878,34.596,31,30.104,31,26 c0-3.86-3.141-7-7-7s-7,3.14-7,7c0,4.104,3.122,8.596,4.825,10.742C19.021,39.893,16.787,41,13.5,41C10.468,41,8,38.533,8,35.5 c0-0.653,0.162-1.308,0.406-2.09C9.17,30.95,15.3,18.948,20.316,9.417l0.076-0.146C21.055,7.891,22.471,7,24,7 s2.945,0.891,3.615,2.285l0.068,0.132C32.7,18.948,38.83,30.95,39.595,33.411C39.838,34.192,40,34.847,40,35.5 C40,38.533,37.532,41,34.5,41z"></path>
        </svg>
      ),
    },
    {
      name: 'Booking.com',
      url: bookingUrl,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 3.036 3.037">
            <path d="M1.113 2.524h-.51v-.61c0-.13.05-.2.162-.214h.35a.38.38 0 0 1 .41.411c0 .26-.157.415-.41.415zM.602.875v-.16c0-.14.06-.208.19-.216h.262c.224 0 .36.134.36.36 0 .17-.092.37-.35.37h-.46zm1.164.61l-.092-.052.08-.07c.094-.08.25-.262.25-.575 0-.48-.372-.79-.947-.79h-.73a.32.32 0 0 0-.309.317v2.72H1.07c.64 0 1.052-.348 1.052-.888 0-.29-.133-.54-.358-.665" fill="#273b7d"/>
            <path d="M2.288 2.67c0-.203.163-.367.365-.367s.367.164.367.367-.164.367-.367.367-.365-.164-.365-.367" fill="#499fdd"/>
        </svg>
      ),
    },
  ];
  
  return (
    <section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-rose-gold tracking-[0.3em] uppercase text-sm mb-2">{subtitle}</p>
          <div className="mt-4 w-24 h-[1px] bg-gold mx-auto"></div>
        </div>
        
        {/* Description */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
          <p className="text-burgundy font-medium mt-4">{venueName}</p>
        </div>
        
        {/* Booking Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {bookingServices.map((service) => (
            <a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gold bg-cream hover:bg-white active:bg-white"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300">
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-burgundy group-hover:text-gold transition-colors duration-300">{service.name}</h3>
                <p className="text-sm text-gray-500">Search accommodations near {venueName}</p>
              </div>
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-gold transition-all duration-300 transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
