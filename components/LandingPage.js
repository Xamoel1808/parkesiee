'use client';

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="landing-shell">
      <section className="landing-hero card">
        <div className="landing-hero-copy">
          <span className="landing-kicker">Park ESIEE-IT</span>
          <h1>Reservez votre place avant d'arriver sur le campus.</h1>
          <p className="landing-intro">
            Une application de reservation de parking pour les etudiants et l'administration.
            Park ESIEE donne de la visibilite sur les places disponibles, limite le stress des trajets
            et garde les profils PMR au centre du parcours.
          </p>

          <div className="landing-actions">
            <button className="btn btn-primary btn-lg" onClick={onRegister}>
              ✨ Creer un compte
            </button>
            <button className="btn btn-outline btn-lg" onClick={onLogin}>
              🔑 Se connecter
            </button>
            <a className="btn btn-outline btn-lg" href="/api-docs">
              📘 Voir l'API
            </a>
          </div>

          <div className="landing-metrics">
            <div className="landing-metric">
              <strong>24h</strong>
              <span>fenetre standard</span>
            </div>
            <div className="landing-metric">
              <strong>48h</strong>
              <span>priorite PMR</span>
            </div>
            <div className="landing-metric">
              <strong>ICS</strong>
              <span>export agenda</span>
            </div>
          </div>
        </div>

        <aside className="landing-panel">
          <div className="landing-panel-card">
            <div className="landing-panel-label">Parcours principal</div>
            <ol className="landing-flow">
              <li>
                <span>1</span>
                <div>
                  <strong>Enregistrer le vehicule</strong>
                  <p>La plaque est associee au compte et reutilisable sur les reservations futures.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Choisir une date</strong>
                  <p>La disponibilite et les regles PMR sont visibles avant la confirmation.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Confirmer et exporter</strong>
                  <p>La reservation est traçable et peut etre exportee dans l'agenda personnel.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="landing-panel-card landing-panel-card-accent">
            <div className="landing-panel-label">Acces de demonstration</div>
            <div className="landing-demo-grid">
              <div>
                <span>Admin</span>
                <strong>admin@esiee-it.fr</strong>
                <p>Mot de passe: admin123</p>
              </div>
              <div>
                <span>Agent</span>
                <strong>agent@esiee-it.fr</strong>
                <p>Mot de passe: agent123</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="landing-sections">
        <article className="card landing-section-card">
          <div className="landing-section-tag">Probleme</div>
          <h2>Eviter l'arrivee au hasard.</h2>
          <p>
            Le parking n'est pas une ressource infinie. Quand la capacite est incertaine, l'etudiant
            perd du temps et arrive sous pression. La solution reintroduit de la previsibilite.
          </p>
        </article>

        <article className="card landing-section-card">
          <div className="landing-section-tag">Benefices</div>
          <h2>Un parcours plus clair pour tous les roles.</h2>
          <ul className="landing-bullets">
            <li>Les etudiants reservent avant de partir.</li>
            <li>Les profils PMR obtiennent une priorite explicite.</li>
            <li>L'administration retrouve les reservations et les plaques rapidement.</li>
          </ul>
        </article>

        <article className="card landing-section-card">
          <div className="landing-section-tag">Usage</div>
          <h2>Un MVP focalise sur l'essentiel.</h2>
          <p>
            Le produit couvre l'inscription, la reservation, l'annulation, le controle de plaque,
            l'export ICS et le traitement no-show. Le reste est volontairement ecarte pour garder un
            produit demonstrable.
          </p>
        </article>

        <article className="card landing-section-card">
          <div className="landing-section-tag">Acces & contact</div>
          <h2>Entrer dans l'application.</h2>
          <p>
            Les etudiants peuvent creer leur compte depuis l'interface. Les comptes de demonstration
            admin et agent sont preconfigures pour les essais et la soutenance.
          </p>
          <div className="landing-links">
            <button className="btn btn-outline" onClick={onRegister}>
              Creer un compte etudiant
            </button>
            <button className="btn btn-outline" onClick={onLogin}>
              Ouvrir une session
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}