const DEFAULT_STORIES = [
  {
    title: "How We Met",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80",
    text: "It all started on a rainy afternoon in Paris. What seemed like a chance encounter at a small café turned into hours of conversation and the beginning of forever.",
  },
  {
    title: "The First Date",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
    text: "Two weeks later, we found ourselves walking along the Seine at sunset. That evening, we both knew this was something special.",
  },
  {
    title: "The Proposal",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    text: "Under the stars on a quiet beach, with the sound of waves as our witness, the question was asked and answered with tears of joy.",
  },
  {
    title: "Our Journey",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    text: "From that moment to this one, every step has led us here. And now, we're ready to begin the next chapter—with you by our side.",
  },
];

export default function OurStory({ stories, ourStory }) {
  const displayStories = stories && stories.length > 0 ? stories : DEFAULT_STORIES;
  const displayOurStoryTitle = ourStory?.title || 'Our Story';
  const displayOurStorySubtitle = ourStory?.subtitle || 'The highlights';

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-rose-gold tracking-[0.3em] uppercase text-sm mb-2">{displayOurStorySubtitle}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-burgundy">{displayOurStoryTitle}</h2>
          <div className="mt-4 w-24 h-[1px] bg-gold mx-auto"></div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {displayStories.map((story, index) => (
            <div 
              key={story.title || index}
              className={`group ${index % 2 === 1 ? 'md:mt-12' : ''}`}
            >
              {/* Image */}
              <div className="overflow-hidden rounded-sm mb-6 shadow-lg shadow-gray-500">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Text */}
              <h3 className="font-serif text-2xl text-burgundy mb-3">{story.title}</h3>
              <p className="text-gray-600 leading-relaxed">{story.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
