'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function StudentDashboard() {
  const { user, apiFetch } = useAuth();
  const [availability, setAvailability] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState(null); // { type, text }
  const [reserving, setReserving] = useState(false);
  const [loadingAvail, setLoadingAvail] = useState(false);

  // Compute tomorrow and day after
  const getDateStr = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const tomorrow = getDateStr(1);
  const dayAfter = getDateStr(2);

  // Active reservation (future or today)
  const activeReservation = reservations.find(
    (r) => r.status === 'CONFIRMED' && r.date >= getDateStr(0)
  );

  const loadReservations = useCallback(async () => {
    try {
      const res = await apiFetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations);
      }
    } catch {}
  }, [apiFetch]);

  const loadAvailability = useCallback(async (date) => {
    setLoadingAvail(true);
    try {
      const res = await apiFetch(`/api/spots/availability?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setAvailability(data);
      }
    } catch {}
    setLoadingAvail(false);
  }, [apiFetch]);

  useEffect(() => {
    loadReservations();
    const defaultDate = tomorrow;
    setSelectedDate(defaultDate);
    loadAvailability(defaultDate);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadAvailability(date);
    setMessage(null);
  };

  const handleReserve = async () => {
    if (!selectedDate) return;
    setReserving(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/reservations', {
        method: 'POST',
        body: JSON.stringify({ date: selectedDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: 'success',
          text: `✅ ${data.message} — Place n°${data.reservation.spotNumber} (${data.reservation.spotType})`,
        });
        loadReservations();
        loadAvailability(selectedDate);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    }
    setReserving(false);
  };

  const handleCancel = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    try {
      const res = await apiFetch(`/api/reservations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Réservation annulée.' });
        loadReservations();
        loadAvailability(selectedDate);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
  };

  const formatDate = (d) => {
    const [y, m, day] = d.split('-');
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janv.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
    return `${days[date.getDay()]} ${parseInt(day)} ${months[date.getMonth()]} ${y}`;
  };

  const pctUsed = (avail, total) => total > 0 ? ((total - avail) / total) * 100 : 0;

  return (
    <div>
      <div className="page-header">
        <h1>👋 Bonjour, {user.name}</h1>
        <p>Gérez vos réservations de parking ESIEE-IT</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert alert-${message.type}`} role="status" aria-live="polite">
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="card-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">🚗</div>
          <div className="stat-info">
            <h3>{user.vehicles?.[0]?.licensePlate || '—'}</h3>
            <p>Mon véhicule</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">📋</div>
          <div className="stat-info">
            <h3>{activeReservation ? 'Active' : 'Aucune'}</h3>
            <p>Réservation en cours</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon violet">📊</div>
          <div className="stat-info">
            <h3>{reservations.filter((r) => r.status === 'CONFIRMED').length}</h3>
            <p>Total réservations</p>
          </div>
        </div>

        {user.isPmr && (
          <div className="stat-card">
            <div className="stat-icon amber">♿</div>
            <div className="stat-info">
              <h3>PMR</h3>
              <p>Statut validé — Priorité 48h</p>
            </div>
          </div>
        )}
      </div>

      {/* Active reservation */}
      {activeReservation && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className="card-header">
            <div className="card-title">🎫 Réservation Active</div>
            <span className="badge badge-confirmed">Confirmée</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                📅 {formatDate(activeReservation.date)}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Place n°{activeReservation.spotNumber} —{' '}
                <span className={`badge ${activeReservation.spotType === 'PMR' ? 'badge-pmr' : 'badge-standard'}`}>
                  {activeReservation.spotType}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={async () => {
                  const res = await apiFetch(`/api/reservations/ics?id=${activeReservation.id}`);
                  if (!res.ok) return alert('Erreur lors de la génération du fichier ICS.');
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `reservation-${activeReservation.date}.ics`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                }}
              >
                📅 Exporter ICS
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleCancel(activeReservation.id)}>
                ✕ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-title">🗓️ Réserver une place</div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${selectedDate === tomorrow ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleDateChange(tomorrow)}
          >
            Demain ({tomorrow.split('-').reverse().join('/')})
          </button>
          {(user.isPmr) && (
            <button
              className={`btn ${selectedDate === dayAfter ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleDateChange(dayAfter)}
            >
              Après-demain ({dayAfter.split('-').reverse().join('/')}) ♿
            </button>
          )}
        </div>

        {/* Availability bars */}
        {availability && !loadingAvail ? (
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="availability-display">
              <div className="availability-bar">
                <div className="availability-bar-header">
                  <span className="availability-bar-label">🚗 Places Standard</span>
                  <span className="availability-bar-count">
                    {availability.standard.available} / {availability.standard.total} libres
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${pctUsed(availability.standard.available, availability.standard.total) > 80 ? 'rose' : 'blue'}`}
                    style={{ width: `${pctUsed(availability.standard.available, availability.standard.total)}%` }}
                  ></div>
                </div>
              </div>

              <div className="availability-bar">
                <div className="availability-bar-header">
                  <span className="availability-bar-label">♿ Places PMR</span>
                  <span className="availability-bar-count">
                    {availability.pmr.available} / {availability.pmr.total} libres
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${pctUsed(availability.pmr.available, availability.pmr.total) > 80 ? 'amber' : 'emerald'}`}
                    style={{ width: `${pctUsed(availability.pmr.available, availability.pmr.total)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : loadingAvail ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div className="spinner"></div>
          </div>
        ) : null}

        <button
          className="btn btn-success btn-lg"
          onClick={handleReserve}
          disabled={reserving || !!activeReservation || !availability || availability.totalAvailable === 0}
          style={{ width: '100%' }}
        >
          {reserving ? (
            <span className="spinner"></span>
          ) : activeReservation ? (
            '⛔ Vous avez déjà une réservation active'
          ) : availability && availability.totalAvailable === 0 ? (
            '⛔ Parking complet pour cette date'
          ) : (
            `🅿️ Réserver pour le ${selectedDate ? selectedDate.split('-').reverse().join('/') : '...'}`
          )}
        </button>
      </div>

      {/* History */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📜 Historique</div>
        </div>
        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Aucune réservation</h3>
            <p>Votre historique apparaîtra ici</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Place</th>
                  <th>Type</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{formatDate(r.date)}</td>
                    <td>n°{r.spotNumber}</td>
                    <td>
                      <span className={`badge ${r.spotType === 'PMR' ? 'badge-pmr' : 'badge-standard'}`}>
                        {r.spotType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {r.status === 'CONFIRMED' ? '✓ Confirmée' : '✕ Annulée'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
