export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.46 0.08 150)" />
          <stop offset="100%" stopColor="oklch(0.30 0.06 150)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#lg-g)" />
      <path
        d="M16 7 L22 16 L19 16 L24 23 L8 23 L13 16 L10 16 Z"
        fill="var(--bone)"
        opacity="0.95"
      />
      <circle cx="16" cy="26" r="1.6" fill="var(--bone)" />
    </svg>
  );
}
