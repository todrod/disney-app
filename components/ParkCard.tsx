"use client";

interface Park {
  id: string;
  name: string;
  slug: string;
  color: string;
  emoji: string;
  image?: string;
}

interface ParkCardProps {
  park: Park;
}

export default function ParkCard({ park }: ParkCardProps) {
  if (park.image) {
    return (
      <article className="card-landio card-park cursor-pointer hover-lift overflow-hidden relative group">
        {/* Park Image */}
        <div className="relative h-48 md:h-56 lg:h-64 w-full">
          <img
            src={park.image}
            alt={`View of ${park.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

          {/* Landio-style pill label */}
          <span className={`absolute top-4 left-4 ${park.color} pill-landio`} aria-hidden="true">
            Explore
          </span>
        </div>

        {/* Card Content */}
        <div className="p-5 md:p-6 flex flex-col flex-1">
          <div className="text-5xl md:text-6xl mb-4 flex-1 flex items-center justify-center" aria-hidden="true">
            {park.emoji}
          </div>
          <h3 className="text-display-xl font-bold font-display text-text mb-2">
            {park.name}
          </h3>
          <p className="text-sm text-text-muted font-medium flex items-center gap-2">
            Tap to explore <span aria-hidden="true">→</span>
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="card-landio card-park cursor-pointer hover-lift flex flex-col items-center justify-center p-8 md:p-10 text-center relative group">
      {/* Landio-style pill label */}
      <span className={`absolute top-4 left-4 ${park.color} pill-landio`} aria-hidden="true">
        Explore
      </span>

      {/* Large Emoji Icon */}
      <div className="text-6xl md:text-7xl lg:text-8xl mb-6 flex-1 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
        {park.emoji}
      </div>

      {/* Park Name */}
      <h3 className="text-display-xl font-bold font-display text-text mb-2">
        {park.name}
      </h3>

      {/* Call to Action */}
      <p className="text-sm text-text-muted font-medium flex items-center gap-2">
        Tap to explore <span aria-hidden="true">→</span>
      </p>
    </article>
  );
}
