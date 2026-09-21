import { useState } from 'react'
import Reveal from './Reveal'
import { Arrow, Clock, Mail, Phone, Pin } from './Icons'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    // No backend yet: acknowledge the request locally.
    setSent(true)
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal className="contact-card">
          <div className="contact-info">
            <span className="eyebrow">Commander</span>
            <h3>Parlons dattes.</h3>
            <p>
              Particuliers, épiceries fines, restaurants ou grossistes : dites-nous ce dont vous
              avez besoin, nous vous répondons sous 24 h avec un devis personnalisé.
            </p>

            <div className="contact-lines">
              <div className="contact-line">
                <Pin />
                <div>
                  <strong>Maison Degla</strong>
                  Route de l’Oasis, 2200 Tozeur, Tunisie
                </div>
              </div>
              <div className="contact-line">
                <Phone />
                <div>
                  <strong>+216 76 000 000</strong>
                  Du lundi au samedi
                </div>
              </div>
              <div className="contact-line">
                <Mail />
                <div>
                  <strong>bonjour@maison-degla.tn</strong>
                  Réponse sous 24 h
                </div>
              </div>
              <div className="contact-line">
                <Clock />
                <div>
                  <strong>Boutique</strong>
                  8 h – 19 h, visite de la palmeraie sur rendez-vous
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            {sent ? (
              <div className="form-success">
                <h4>Merci, c’est noté !</h4>
                <p>Nous revenons vers vous très vite avec une proposition sur mesure.</p>
                <button className="btn btn-dark" style={{ marginTop: 24 }} onClick={() => setSent(false)}>
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="nom">Nom</label>
                    <input id="nom" name="nom" placeholder="Votre nom" required />
                  </div>
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
                  </div>
                  <div className="field">
                    <label htmlFor="type">Vous êtes</label>
                    <select id="type" name="type" defaultValue="particulier">
                      <option value="particulier">Particulier</option>
                      <option value="epicerie">Épicerie fine</option>
                      <option value="restaurant">Restaurant / Hôtel</option>
                      <option value="grossiste">Grossiste / Export</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="quantite">Quantité souhaitée</label>
                    <input id="quantite" name="quantite" placeholder="ex. 5 kg, 200 coffrets…" />
                  </div>
                  <div className="field full">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Variétés, conditionnement, délais… dites-nous tout."
                    />
                  </div>
                </div>
                <div className="form-foot">
                  <small>Vos données ne sont utilisées que pour répondre à votre demande.</small>
                  <button type="submit" className="btn btn-primary">
                    Envoyer ma demande <Arrow />
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
