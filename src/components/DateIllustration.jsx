/**
 * Flat SVG illustration of a date, tinted per variety.
 * Used on product cards so we don't spin up a WebGL context per card.
 */
export default function DateIllustration({ light = '#e09a45', dark = '#5a2a10', id }) {
  const gid = `date-grad-${id}`
  const hid = `date-hl-${id}`
  return (
    <svg viewBox="0 0 120 200" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={gid} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={dark} />
          <stop offset="1" stopColor="#1b0f08" />
        </radialGradient>
        <linearGradient id={hid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6e6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6e6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* stem */}
      <rect x="56" y="8" width="8" height="18" rx="4" fill="#8c6a3d" />
      <ellipse cx="60" cy="27" rx="12" ry="5" fill="#c9a06a" />
      {/* body */}
      <path
        d="M60 26 C 92 34, 104 90, 96 140 C 90 178, 74 194, 60 194 C 46 194, 30 178, 24 140 C 16 90, 28 34, 60 26 Z"
        fill={`url(#${gid})`}
      />
      {/* wrinkles */}
      <g fill="none" stroke="#1b0f08" strokeOpacity="0.28" strokeWidth="1.4" strokeLinecap="round">
        <path d="M44 48 C 38 90, 40 130, 48 170" />
        <path d="M58 40 C 56 95, 58 140, 62 180" />
        <path d="M74 48 C 82 92, 80 135, 72 172" />
      </g>
      {/* highlight */}
      <path d="M46 44 C 38 70, 38 100, 42 120 C 50 100, 50 70, 46 44 Z" fill={`url(#${hid})`} />
    </svg>
  )
}
