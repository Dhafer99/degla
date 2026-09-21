import Reveal from './Reveal'

const testimonials = [
  {
    quote:
      'Je n’avais jamais goûté une Deglet Nour aussi fondante. On sent le miel, le soleil… et zéro sucre ajouté. Le coffret est magnifique.',
    name: 'Claire Moreau',
    role: 'Cliente · Lyon',
  },
  {
    quote:
      'Nous servons les dattes Degla dans notre restaurant depuis deux saisons. Régularité de calibre impeccable, livraison toujours à l’heure.',
    name: 'Karim Benali',
    role: 'Chef · Restaurant Le Palmier, Paris',
  },
  {
    quote:
      'Parfaites pour mes pâtisseries : la variété Alig se travaille très bien et ma pâte de dattes n’a jamais été aussi parfumée.',
    name: 'Sonia Trabelsi',
    role: 'Pâtissière · Tunis',
  },
]

export default function Testimonials() {
  return (
    <section className="section" id="avis">
      <div className="container">
        <Reveal style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Ils nous font confiance
          </span>
          <h2 className="title">
            Des sourires <em>à chaque bouchée</em>
          </h2>
        </Reveal>

        <div className="testis">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="testi">
              <div className="stars" aria-label="5 étoiles">
                ★★★★★
              </div>
              <blockquote>« {t.quote} »</blockquote>
              <div className="testi-author">
                <div className="avatar">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
