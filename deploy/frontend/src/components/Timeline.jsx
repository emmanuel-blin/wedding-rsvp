export default function Timeline({ timeline }) {

  const displayTimelineSubtitle = timeline?.subtitle || 'The schedule'; 
  const displayTimelineTitle = timeline?.title || 'Timeline';
  const displayTimelineCityHallName = timeline?.cityHall.name || 'City Hall';
  const displayTimelineCityHallShortname = timeline?.cityHall.shortname;
  const displayTimelinePhotoTime = timeline?.photo.time || '15:00';
  const displayTimelinePhotoName = timeline?.photo.name || 'Photo';
  const displayTimelinePhotoShortname = timeline?.photo.shortname;
  const displayTimelineDinnerTime = timeline?.dinner.time || '17:00';
  const displayTimelineDinnerName = timeline?.dinner.name || 'Dinner';
  const displayTimelineDinnerShortname = timeline?.dinner.shortname;
  const displayTimelineDancingTime = timeline?.dancing.time || '19:00';
  const displayTimelineDancingName = timeline?.dancing.name || 'Dancing';
  const displayTimelineDancingShortname = timeline?.dancing.shortname;

  const events = [
    {
      time: "14:00",
      title: displayTimelineCityHallName,
      location: displayTimelineCityHallShortname,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      time: displayTimelinePhotoTime,
      title: displayTimelinePhotoName,
      location: displayTimelinePhotoShortname,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      time: displayTimelineDinnerTime,
      title: displayTimelineDinnerName,
      location: displayTimelineDinnerShortname,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      time: displayTimelineDancingTime,
      title: displayTimelineDancingName,
      location: displayTimelineDancingShortname,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-rose-gold tracking-[0.3em] uppercase text-sm mb-2">{displayTimelineSubtitle}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-burgundy">{displayTimelineTitle}</h2>
          <div className="mt-4 w-24 h-[1px] bg-gold mx-auto"></div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gold/30 transform -translate-x-1/2"></div>

          {/* Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div 
                key={event.time}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Time Badge */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8 md:pr-12' : 'text-left pl-8 md:pl-12'}`}>
                  <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-burgundy text-white font-serif text-lg md:text-xl rounded-sm">
                    {event.time}
                  </span>
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-gold rounded-full flex items-center justify-center text-white z-10 shadow-lg">
                  {event.icon}
                </div>

                {/* Content */}
                <div className={`${index % 2 === 0 ? 'pl-8 md:pl-12' : 'pr-8 md:pr-12'}`}>
                  <h3 className="font-serif text-lg md:text-2xl text-burgundy mb-1 leading-tight">{event.title}</h3>
                  <p className="text-gray-500 text-sm md:text-base">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
