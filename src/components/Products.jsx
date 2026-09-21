import Reveal from './Reveal'
import DateIllustration from './DateIllustration'
import { Plus } from './Icons'

const products = [
  {
    id: 'deglet',
    name: 'Deglet Nour',
    origin: 'Tozeur · Branchée',
    tag: 'Signature',
    desc: 'La « doigt de lumière » : chair translucide, texture fondante et notes de miel et de caramel.',
    price: '24',
    light: '#f2b76a',
    dark: '#8a3f14',
    tint: 'rgba(224, 154, 69, 0.22)',
  },
  {
    id: 'medjool',
    name: 'Medjool',
    origin: 'Kébili · Calibre XL',
    tag: 'Généreuse',
    desc: 'Grosse, charnue et moelleuse, la reine des dattes au goût profond de sucre roux.',
    price: '32',
    light: '#a55a2a',
    dark: '#3a1a0c',
    tint: 'rgba(120, 60, 24, 0.22)',
  },
  {
    id: 'alig',
    name: 'Alig',
    origin: 'Nefta · Dénoyautée',
    tag: 'Gourmande',
    desc: 'Plus foncée et plus sucrée, parfaite pour la pâtisserie, les smoothies et les pâtes de dattes.',
    price: '16',
    light: '#7a3a1c',
    dark: '#26110a',
    tint: 'rgba(90, 42, 16, 0.22)',
  },
  {
    id: 'kenta',
    name: 'Kenta',
    origin: 'Degache · Précoce',
    tag: 'Primeur',
    desc: 'La première de la saison : ferme, légèrement croquante, au sucre délicat et peu prononcé.',
    price: '14',
    light: '#e8c27a',
    dark: '#a3652a',
    tint: 'rgba(232, 194, 122, 0.3)',
  },
]

export default function Products() {
  return (
    <section className="section products" id="dattes">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Nos dattes</span>
            <h2 className="title">
              Quatre variétés, <em>un seul terroir</em>
            </h2>
          </div>
          <p className="lead">
            Chaque variété est récoltée à la main puis triée selon son calibre, sa couleur et sa
            teneur en humidité. Conditionnée sous 48 h pour préserver tout son moelleux.
          </p>
        </Reveal>

        <div className="products-grid">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} as="article" className="product" style={{ '--tint': p.tint }}>
              <div className="product-fig">
                <span className="product-tag">{p.tag}</span>
                <DateIllustration id={p.id} light={p.light} dark={p.dark} />
              </div>
              <h3>{p.name}</h3>
              <div className="product-origin">{p.origin}</div>
              <p className="desc">{p.desc}</p>
              <div className="product-foot">
                <div className="price">
                  {p.price} DT <small>/ kg</small>
                </div>
                <button className="add" aria-label={`Ajouter ${p.name} au panier`}>
                  <Plus />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
