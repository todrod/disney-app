interface TileProps {
  title: string;
  text: string;
  icon: string;
}

export default function Tile({ title, text, icon }: TileProps) {
  return (
    <article className="card-landio-mini p-4 min-h-[120px]">
      <p className="text-sm font-semibold text-text-muted mb-2">{icon} {title}</p>
      <p className="text-base font-semibold text-text leading-snug">{text}</p>
    </article>
  );
}
