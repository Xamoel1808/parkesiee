'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function AgentLookup() {
  const { apiFetch } = useAuth();
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!plate.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await apiFetch(`/api/admin/lookup?plate=${encodeURIComponent(plate.toUpperCase())}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Erreur de connexion au serveur.');
    }
    setLoading(false);
  };

  const todayFormatted = () => {
    const d = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janv.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div>
      <div className="page-header">
        <h1>🔍 Vérification de plaque</h1>
        <p>Contrôlez les réservations à partir d'une plaque d'immatriculation — {todayFormatted()}</p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch}>
          <div className="card-header">
            <div className="card-title">🚗 Recherche par plaque</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label className="form-label" htmlFor="plate-input">Plaque d'immatriculation</label>
              <input
                id="plate-input"
                className="form-input"
                type="text"
                placeholder="AA-123-BB"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 700 }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !plate.trim()}
              style={{ marginBottom: 0 }}
            >
              {loading ? <span className="spinner"></span> : '🔍 Vérifier'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">
              {result.found
                ? result.todayReservation?.valid
                  ? '✅ Réservation valide'
                  : '⚠️ Véhicule identifié — Pas de réservation'
                : '❌ Véhicule non reconnu'
              }
            </div>
          </div>

          {!result.found ? (
            <div className={`lookup-result not-found`}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚫</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  Plaque non enregistrée
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Cette plaque d'immatriculation n'est associée à aucun profil étudiant.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Owner info */}
              <div style={{
                padding: '1rem',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Propriétaire du véhicule
                </div>
                <div className="lookup-detail">
                  <span className="lookup-detail-label">Nom</span>
                  <span style={{ fontWeight: 600 }}>{result.vehicle.owner.name}</span>
                </div>
                <div className="lookup-detail">
                  <span className="lookup-detail-label">Email</span>
                  <span>{result.vehicle.owner.email}</span>
                </div>
                <div className="lookup-detail">
                  <span className="lookup-detail-label">Téléphone</span>
                  <span>{result.vehicle.owner.phone}</span>
                </div>
                <div className="lookup-detail">
                  <span className="lookup-detail-label">Plaque</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}>
                    {result.vehicle.licensePlate}
                  </span>
                </div>
                <div className="lookup-detail">
                  <span className="lookup-detail-label">PMR</span>
                  <span>{result.vehicle.owner.isPmr ? '♿ Oui' : 'Non'}</span>
                </div>
              </div>

              {/* Reservation status */}
              <div className={`lookup-result ${result.todayReservation?.valid ? 'valid' : 'invalid'}`}>
                {result.todayReservation?.valid ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '2rem' }}>✅</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>
                          Réservation valide pour aujourd'hui
                        </div>
                      </div>
                    </div>
                    <div className="lookup-detail">
                      <span className="lookup-detail-label">Place n°</span>
                      <span style={{ fontWeight: 700 }}>{result.todayReservation.spotNumber}</span>
                    </div>
                    <div className="lookup-detail">
                      <span className="lookup-detail-label">Type</span>
                      <span className={`badge ${result.todayReservation.spotType === 'PMR' ? 'badge-pmr' : 'badge-standard'}`}>
                        {result.todayReservation.spotType}
                      </span>
                    </div>
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={async () => {
                          if (!confirm("Voulez-vous signaler cet étudiant absent (No-show) ? Une pénalité de 7 jours sera appliquée.")) return;
                          try {
                            const res = await apiFetch('/api/agent/no-show', {
                              method: 'POST',
                              body: JSON.stringify({ reservationId: result.todayReservation.id })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              alert("Penalité appliquée avec succès.");
                              setResult({ ...result, todayReservation: { ...result.todayReservation, valid: false } }); // Hide green bar since invalidated
                            } else {
                              alert("Erreur: " + data.error);
                            }
                          } catch (err) {
                            alert("Erreur réseau");
                          }
                        }}
                      >
                        ⚠️ Signaler "No-Show" (Pénalité)
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>⛔</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-rose)' }}>
                        Aucune réservation pour aujourd'hui
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Ce véhicule n'a pas de réservation valide pour ce jour.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
