export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="logo">
              <span>
                Degla
                <small>Maison des dattes</small>
              </span>
            </a>
            <p>
              Dattes Deglet Nour, Medjool, Alig et Kenta cultivées dans l’oasis de Tozeur et
              sélectionnées à la main depuis 1968.
            </p>
          </div>
          <div>
            <h5>Boutique</h5>
            <ul>
              <li><a href="#dattes">Deglet Nour</a></li>
              <li><a href="#dattes">Medjool</a></li>
              <li><a href="#dattes">Alig</a></li>
              <li><a href="#dattes">Kenta</a></li>
            </ul>
          </div>
          <div>
            <h5>La maison</h5>
            <ul>
              <li><a href="#histoire">Notre histoire</a></li>
              <li><a href="#savoir-faire">Savoir-faire</a></li>
              <li><a href="#bienfaits">Bienfaits</a></li>
              <li><a href="#avis">Avis clients</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href="#contact">Commander</a></li>
              <li><a href="mailto:bonjour@maison-degla.tn">bonjour@maison-degla.tn</a></li>
              <li><a href="tel:+21676000000">+216 76 000 000</a></li>
              <li>Tozeur, Tunisie</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Maison Degla. Tous droits réservés.</span>
          <span>Mentions légales · Confidentialité · CGV</span>
        </div>
      </div>
    </footer>
  )
}
