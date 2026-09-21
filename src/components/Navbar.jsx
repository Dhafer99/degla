import { useEffect, useState } from 'react'

const links = [
  { href: '#histoire', label: 'Notre histoire' },
  { href: '#dattes', label: 'Nos dattes' },
  { href: '#bienfaits', label: 'Bienfaits' },
  { href: '#savoir-faire', label: 'Savoir-faire' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled || open ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          <a href="#" className="logo" aria-label="Maison Degla — accueil">
            <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
              <ellipse cx="32" cy="36" rx="13" ry="22" fill="#c47a2c" />
              <ellipse cx="27" cy="28" rx="3.5" ry="9" fill="#f2c27a" opacity="0.6" />
              <rect x="30" y="10" width="4" height="7" rx="2" fill="#c9a06a" />
            </svg>
            <span>
              Degla
              <small>Maison des dattes</small>
            </span>
          </a>

          <nav aria-label="Navigation principale">
            <ul className="nav-links">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#contact" className="btn btn-primary">
            Commander
          </a>

          <button
            className={`nav-burger ${open ? 'open' : ''}`}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {open && (
          <ul className="nav-mobile">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
