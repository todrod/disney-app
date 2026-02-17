import Link from 'next/link';
import CrowdMeter from './CrowdMeter';

interface ParkCardProps {
  park: {
    park: 'MK' | 'EPCOT' | 'DHS' | 'AK';
    name: string;
    color: 'blue' | 'purple' | 'red' | 'green';
    headline: string;
    crowd: {
      score: number;
      label: string;
      generatedAt: string;
      note?: string;
    };
  };
}

const headerClass = {
  blue: 'bg-magic-kingdom/15 text-magic-kingdom',
  purple: 'bg-epcot-primary/15 text-epcot-primary',
  red: 'bg-hollywood-primary/15 text-hollywood-primary',
  green: 'bg-animal-primary/15 text-animal-primary',
};

export default function ParkCard({ park }: ParkCardProps) {
  const slug = park.park.toLowerCase();
  return (
    <Link href={`/daily-dashboard/${slug}`} className="block min-w-[260px] max-w-[320px] card-landio-mini p-4">
      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-3 ${headerClass[park.color]}`}>
        {park.name}
      </div>
      <CrowdMeter
        score={park.crowd.score}
        label={park.crowd.label}
        updatedAt={park.crowd.generatedAt}
        note={park.crowd.note}
      />
      <p className="mt-3 text-sm text-text leading-snug">{park.headline}</p>
    </Link>
  );
}
