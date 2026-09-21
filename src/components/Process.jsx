import Reveal from './Reveal'

const steps = [
  {
    title: 'La récolte',
    text: 'D’octobre à décembre, nos cueilleurs grimpent au sommet des palmiers et coupent les régimes à maturité parfaite.',
    meta: 'Octobre → Décembre',
  },
  {
    title: 'Le tri',
    text: 'Chaque datte passe entre les mains de nos trieuses : calibre, couleur, brillance et taux d’humidité sont contrôlés.',
    meta: '100 % manuel',
  },
  {
    title: 'Le conditionnement',
    text: 'Sans additif ni sirop, les dattes sont mises en coffret sous 48 heures, dans nos ateliers de Tozeur.',
    meta: 'Sous 48 heures',
  },
  {
    title: 'L’expédition',
    text: 'Stockées au frais puis expédiées en circuit court, elles arrivent chez vous aussi fondantes qu’au pied du palmier.',
    meta: '30+ pays livrés',
  },
]

export default function Process() {
  return (
    <section className="section process" id="savoir-faire">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Savoir-faire</span>
            <h2 className="title">
              Du palmier <em>à votre table</em>
            </h2>
          </div>
          <p className="lead">
            Quatre étapes, aucune machine entre le fruit et vous. C’est plus lent, mais c’est ce
            qui fait la différence.
          </p>
        </Reveal>

        <div className="steps">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} className="step">
              <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
              <div className="step-meta">{s.meta}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
