import Reveal from './Reveal'

function OasisArt() {
  // Stylised palm grove at sunset
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <circle cx="200" cy="170" r="70" fill="#fff1d6" opacity="0.9" />
      <circle cx="200" cy="170" r="95" fill="#fff1d6" opacity="0.18" />
      {/* dunes */}
      <path d="M0 360 C 90 320, 160 380, 260 340 C 330 315, 380 340, 400 335 L 400 500 L 0 500 Z" fill="#6b3a1c" opacity="0.7" />
      <path d="M0 400 C 120 370, 200 420, 400 380 L 400 500 L 0 500 Z" fill="#3a1d0e" />
      {/* palms */}
      {[
        [70, 500, 0.9],
        [330, 500, 1.05],
        [200, 500, 0.75],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 0 C -6 -80, 4 -160, 0 -230" stroke="#1b0f08" strokeWidth="9" fill="none" strokeLinecap="round" />
          {[-70, -35, 0, 35, 70].map((a) => (
            <path
              key={a}
              d="M0 0 C 20 -30, 60 -40, 100 -20 C 60 -25, 30 -15, 0 0 Z"
              fill="#1b0f08"
              transform={`translate(0 -230) rotate(${a - 90}) `}
            />
          ))}
          {[-55, -20, 20, 55].map((a) => (
            <path
              key={`b${a}`}
              d="M0 0 C 20 -30, 60 -40, 100 -20 C 60 -25, 30 -15, 0 0 Z"
              fill="#2c1810"
              transform={`translate(0 -230) rotate(${a - 90}) scale(0.8)`}
            />
          ))}
          <circle cx="-8" cy="-215" r="7" fill="#c47a2c" />
          <circle cx="8" cy="-212" r="6" fill="#e09a45" />
        </g>
      ))}
    </svg>
  )
}

export default function Story() {
  return (
    <section className="section" id="histoire">
      <div className="container story-grid">
        <Reveal className="story-visual">
          <OasisArt />
          <div className="story-card">
            <div>
              <strong>3</strong>
              <span>Générations</span>
            </div>
            <div>
              <strong>140 ha</strong>
              <span>De palmeraie</span>
            </div>
            <div>
              <strong>100 %</strong>
              <span>Tri à la main</span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Notre histoire</span>
            <h2 className="title">
              Une famille, une oasis, <em>une passion</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="lead">
              Tout commence en 1968, lorsque Hadj Ali plante ses premiers palmiers au bord de
              l'oasis de Tozeur. Aujourd'hui, ses petits-enfants perpétuent le même geste :
              grimper au sommet des palmiers, cueillir les régimes à maturité parfaite et trier
              chaque datte une à une.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <blockquote className="story-quote">
              « Une bonne datte ne se fabrique pas. Elle se mérite, avec de la patience, de l'eau
              et du soleil. »
              <cite>Hadj Ali — Fondateur</cite>
            </blockquote>
          </Reveal>

          <Reveal delay={0.3} className="story-values">
            <div className="story-value">
              <h4>Terroir</h4>
              <p>Un sol sablonneux et un microclimat unique qui donnent à la Deglet Nour sa transparence.</p>
            </div>
            <div className="story-value">
              <h4>Patience</h4>
              <p>Une seule récolte par an, d'octobre à décembre, quand le fruit est gorgé de soleil.</p>
            </div>
            <div className="story-value">
              <h4>Respect</h4>
              <p>Zéro traitement chimique, une irrigation raisonnée et un commerce juste avec nos cueilleurs.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
