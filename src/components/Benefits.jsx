import Reveal from './Reveal'
import { Bolt, Leaf, Heart, Shield } from './Icons'

const benefits = [
  {
    icon: Bolt,
    title: 'Énergie naturelle',
    text: 'Glucose et fructose à assimilation rapide : le carburant idéal des sportifs et des matins pressés.',
  },
  {
    icon: Leaf,
    title: 'Riche en fibres',
    text: 'Près de 7 g de fibres pour 100 g, pour une digestion douce et une satiété durable.',
  },
  {
    icon: Heart,
    title: 'Potassium & magnésium',
    text: 'Deux fois plus de potassium qu’une banane, pour le cœur, les muscles et la récupération.',
  },
  {
    icon: Shield,
    title: 'Antioxydants',
    text: 'Flavonoïdes, caroténoïdes et acides phénoliques qui protègent les cellules du vieillissement.',
  },
]

const nutrition = [
  { label: 'Énergie', value: '282 kcal', w: '70%' },
  { label: 'Glucides', value: '75 g', w: '92%' },
  { label: 'Fibres', value: '6,7 g', w: '45%' },
  { label: 'Potassium', value: '656 mg', w: '62%' },
  { label: 'Magnésium', value: '43 mg', w: '30%' },
  { label: 'Protéines', value: '2,5 g', w: '18%' },
]

export default function Benefits() {
  return (
    <section className="section" id="bienfaits">
      <div className="container benefits-grid">
        <div>
          <Reveal>
            <span className="eyebrow">Bienfaits</span>
            <h2 className="title">
              Un fruit millénaire, <em>un allié quotidien</em>
            </h2>
            <p className="lead">
              Trois dattes par jour suffisent pour faire le plein de minéraux et de douceur, sans
              sucre ajouté ni conservateur.
            </p>
          </Reveal>

          <div className="benefit-list">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={0.1 + i * 0.08} className="benefit">
                <div className="benefit-icon">
                  <b.icon />
                </div>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="nutrition">
          <h3>Valeurs nutritionnelles</h3>
          <p className="sub">POUR 100 G DE DEGLET NOUR · ENVIRON 4 À 5 DATTES</p>
          <div className="nutrition-rows">
            {nutrition.map((n, i) => (
              <div className="nrow" key={n.label}>
                <span>{n.label}</span>
                <strong>{n.value}</strong>
                <div className="bar">
                  <i style={{ '--w': n.w, animationDelay: `${i * 0.1}s` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="nutrition-foot">
            Valeurs moyennes indicatives. Naturellement sans gluten, sans lactose et sans sucre
            ajouté.
          </div>
        </Reveal>
      </div>
    </section>
  )
}
