import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Arrow, Rotate } from './Icons'

// Three.js is heavy — load the 3D scene after the rest of the page has painted
const Date3D = lazy(() => import('./Date3D'))

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] },
})

export default function Hero() {
  return (
    <section className="hero" id="accueil">
      <div className="hero-grain" />
      <div className="hero-ring" />

      <div className="container hero-inner">
        <div>
          <motion.span className="hero-badge" {...fade(0.1)}>
            <i /> Récolte 2026 · Oasis de Tozeur
          </motion.span>

          <motion.h1 className="hero-title" {...fade(0.25)}>
            L'or des oasis, <br />
            <em>cueilli à la main.</em>
          </motion.h1>

          <motion.p className="hero-lead" {...fade(0.4)}>
            Depuis trois générations, la Maison Degla sélectionne les plus belles dattes
            Deglet Nour du Sud tunisien — fondantes, translucides, au goût de miel — et les
            livre chez vous, du palmier à la table.
          </motion.p>

          <motion.div className="hero-actions" {...fade(0.55)}>
            <a href="#dattes" className="btn btn-primary">
              Découvrir nos dattes <Arrow />
            </a>
            <a href="#histoire" className="btn btn-ghost">
              Notre histoire
            </a>
          </motion.div>

          <motion.div className="hero-stats" {...fade(0.7)}>
            <div className="hero-stat">
              <strong>1968</strong>
              <span>Année de la première récolte</span>
            </div>
            <div className="hero-stat">
              <strong>12 000</strong>
              <span>Palmiers dattiers cultivés</span>
            </div>
            <div className="hero-stat">
              <strong>30+</strong>
              <span>Pays livrés chaque saison</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-canvas"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Suspense fallback={null}>
            <Date3D />
          </Suspense>
          <span className="hero-hint">
            <Rotate /> Faites glisser pour tourner
          </span>
        </motion.div>
      </div>

      <div className="hero-scroll" aria-hidden="true" />
    </section>
  )
}
