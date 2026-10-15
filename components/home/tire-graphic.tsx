// Original decorative tire illustration (pure SVG, no external image).
export function TireGraphic({ className = "" }: { className?: string }) {
  const treads = Array.from({ length: 36 });
  const spokes = Array.from({ length: 5 });
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="195" fill="#1a1a1c" />
      {treads.map((_, i) => (
        <rect
          key={i}
          x="193"
          y="6"
          width="14"
          height="34"
          rx="3"
          fill="#2d2d31"
          transform={`rotate(${i * 10} 200 200)`}
        />
      ))}
      <circle cx="200" cy="200" r="150" fill="#111113" />
      <circle cx="200" cy="200" r="122" fill="#d7141a" />
      <circle cx="200" cy="200" r="112" fill="#141416" />
      {spokes.map((_, i) => (
        <path
          key={i}
          d="M188 200 L176 96 Q200 86 224 96 L212 200 Z"
          fill="#d7141a"
          transform={`rotate(${i * 72} 200 200)`}
        />
      ))}
      <circle cx="200" cy="200" r="34" fill="#d7141a" />
      <circle cx="200" cy="200" r="14" fill="#141416" />
    </svg>
  );
}
