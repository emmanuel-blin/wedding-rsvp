import { useTranslation } from 'react-i18next';
import '../utils/translations';

export default function Timeline({ timeline }) {
    const { t } = useTranslation();

    const displayTimelineSubtitle = timeline?.subtitle || t('defaults.timeline_subtitle');
    const displayTimelineTitle = timeline?.title || t('defaults.timeline_title');
    const displayTimelineCityHallName = timeline?.cityHall?.name || t('defaults.timeline_city_hall');
    const displayTimelineCityHallShortname = timeline?.cityHall?.shortname;
    const displayTimelinePhotoTime = timeline?.photo?.time || '15:00';
    const displayTimelinePhotoName = timeline?.photo?.name || t('defaults.timeline_photo');
    const displayTimelinePhotoShortname = timeline?.photo?.shortname;
    const displayTimelineDinnerTime = timeline?.dinner?.time || '17:00';
    const displayTimelineDinnerName = timeline?.dinner?.name || t('defaults.timeline_dinner');
    const displayTimelineDinnerShortname = timeline?.dinner?.shortname;
    const displayTimelineDancingTime = timeline?.dancing?.time || '19:00';
    const displayTimelineDancingName = timeline?.dancing?.name || t('defaults.timeline_dancing');
    const displayTimelineDancingShortname = timeline?.dancing?.shortname;

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
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                <path transform="translate(6 0) rotate(12 0 21)" d="M-2 2h4l-.5 8a1.5 1.5 0 0 1-3 0ZM0 11.5V21M-2.5 21h5" />
                <path transform="translate(18 0) rotate(-12 0 21)" d="M-2 2h4l-.5 8a1.5 1.5 0 0 1-3 0ZM0 11.5V21M-2.5 21h5" />
            </g>
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
        <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <p className="text-secondary tracking-[0.3em] uppercase text-sm mb-2">{displayTimelineSubtitle}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary">{displayTimelineTitle}</h2>
            <div className="mt-4 w-24 h-px bg-accent mx-auto"></div>
            </div>

            <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent/30 transform -translate-x-1/2"></div>

            <div className="space-y-12">
                {events.map((event, index) => {
                const timeLeft = index % 2 === 0;
                return (
                <div
                    key={index}
                    className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 md:gap-x-12"
                >
                    <div className={`row-start-1 ${timeLeft ? 'col-start-1 text-right' : 'col-start-3 text-left'}`}>
                    <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-primary text-on-primary font-serif text-lg md:text-xl rounded-sm">
                        {event.time}
                    </span>
                    </div>

                    <div aria-hidden="true" className="row-start-1 col-start-2 w-10 h-10 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center text-primary z-10">
                    {event.icon}
                    </div>

                    <div className={`row-start-1 break-words ${timeLeft ? 'col-start-3 text-left' : 'col-start-1 text-right'}`}>
                    <h3 className="font-serif text-lg md:text-2xl text-primary mb-1 leading-tight">{event.title}</h3>
                    <p className="text-gray-500 text-sm md:text-base">{event.location}</p>
                    </div>
                </div>
                );
                })}
            </div>
            </div>
        </div>
        </section>
    );
}
