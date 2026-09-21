const items = [
  'Deglet Nour',
  'Medjool',
  'Alig',
  'Kenta',
  'Sans conservateurs',
  'Récolte à la main',
  'Agriculture biologique',
  'Tozeur · Tunisie',
]

export default function Marquee() {
  // The list is doubled so the track can loop seamlessly
  const doubled = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}
