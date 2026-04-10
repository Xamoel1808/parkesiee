'use client';

export default function ReglementPage() {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Règlement Intérieur du Parking ESIEE-IT</h2>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Pour garantir un accès juste et équitable aux places de parking pour tous les étudiants, 
        l'utilisation de l'application <strong>ParkESIEE</strong> et l'accès au parking sont soumis au présent règlement. 
        Tout manquement entraînera des pénalités sur votre droit de réservation.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        1. Validité de la Réservation et Retards
      </h3>
      <p>Les réservations sont limitées à <strong>une réservation active par étudiant</strong>.</p>
      <ul>
        <li>
          <strong>Retard :</strong> Si vous arrivez en retard de plus d'une <strong>1 heure</strong> par rapport 
          au début de la journée d'ouverture, <strong>votre réservation est automatiquement annulée</strong>. 
          La place sera remise à disposition d'un autre étudiant.
        </li>
      </ul>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        2. Règle de Rotation et Monopolisation
      </h3>
      <p>Dans un souci d'équité, il est interdit de monopoliser les places de parking.</p>
      <ul>
        <li>
          <strong>Dépassement de stationnement :</strong> Si l'Agent de parking constate (lors de sa ronde de contrôle ou via le panneau d'administration) que <strong>vous avez laissé votre voiture sur le parking à la même place plus de 24H</strong>, une pénalité vous sera infligée : <strong>vous ne pourrez plus réserver pendant 3 jours ouvrés</strong>. 
          <br /><br />
          <em style={{color: 'var(--text-muted)'}}>(Exemple : si l'infraction est constatée un vendredi, la pénalité s'étendra jusqu'au mercredi suivant inclus. Vous ne pourrez de nouveau réserver que pour le jeudi).</em>
        </li>
      </ul>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        3. Absence non justifiée (No-Show)
      </h3>
      <ul>
        <li>
          Si vous avez réservé une place mais que vous ne vous présentez pas (statut <em>No-Show</em> constaté par l'agent) sans avoir annulé votre réservation au préalable, 
          une <strong>pénalité stricte de 7 jours</strong> sera appliquée sur votre compte.
        </li>
      </ul>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        4. Usage et Citoyenneté
      </h3>
      <ul>
        <li>Vous devez avoir votre plaque d'immatriculation correctement renseignée dans l'application.</li>
        <li>Les places marquées <strong>PMR</strong> sont strictement réservées aux étudiants dont le statut PMR a été formellement validé par un administrateur du campus.</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px', fontSize: '0.9rem' }}>
        <em>Ce règlement est applicable dès sa publication. L'administration se réserve le droit de modifier les périodes de pénalité en cas d'abus répétés.</em>
      </div>
    </div>
  );
}
