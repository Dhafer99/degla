# Maison Degla — Site vitrine

Site vitrine en français pour un vendeur de dattes (Deglet Nour de Tozeur), avec une datte 3D interactive dans l'en-tête.

## Stack

- **React 19** + **Vite**
- **Three.js** via `@react-three/fiber` et `@react-three/drei` — la datte est générée procéduralement (sphère déformée : rides, pincement, pli), sans modèle externe ni texture à télécharger.
- **framer-motion** pour les animations d'apparition au défilement.
- Polices Google : Cormorant Garamond (titres) et Manrope (texte).

## Lancer le projet

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

## Structure

```
src/
  App.jsx                    assemblage des sections
  index.css                  design system (variables, sections, responsive)
  components/
    Date3D.jsx               scène 3D (datte, lumières, ombres, contrôles)
    Hero.jsx                 en-tête avec la datte 3D (chargée en lazy)
    Navbar.jsx               navigation fixe + menu mobile
    Marquee.jsx              bandeau défilant
    Story.jsx                « Notre histoire » — présentation du vendeur
    Products.jsx             les 4 variétés (Deglet Nour, Medjool, Alig, Kenta)
    Benefits.jsx             bienfaits + valeurs nutritionnelles
    Process.jsx              savoir-faire en 4 étapes
    Testimonials.jsx         avis clients
    Contact.jsx              formulaire de commande / devis
    Footer.jsx
    DateIllustration.jsx     datte SVG teintée pour les fiches produit
    Reveal.jsx               wrapper d'animation au scroll
    Icons.jsx                icônes SVG
```

## À personnaliser

- Textes, prix et coordonnées : directement dans chaque composant (`Products.jsx`, `Contact.jsx`, `Footer.jsx`).
- Le formulaire de contact n'est pas relié à un backend : brancher `onSubmit` dans `Contact.jsx` (Formspree, EmailJS, API maison…).
- Couleurs et polices : variables CSS en haut de `src/index.css`.
