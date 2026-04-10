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
  const [showStats, setShowStats] = useState(false);

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
            {user?.vehicles?.length > 1 ? (
              <select 
                defaultValue={user.vehicles[0].id}
                style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)',
                  padding: '4px 8px',
                  marginBottom: '4px',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                {user.vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.licensePlate}</option>
                ))}
              </select>
            ) : (
              <h3>{user?.vehicles?.[0]?.licensePlate || '—'}</h3>
            )}
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

        <div
          className="stat-card"
          onClick={() => setShowStats(true)}
          style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,92,246,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          title="Voir mes statistiques détaillées"
        >
          <div className="stat-icon violet">📊</div>
          <div className="stat-info">
            <h3>{reservations.filter((r) => r.status === 'CONFIRMED').length}</h3>
            <p>Total réservations <span style={{ fontSize: '0.7rem', opacity: 0.65 }}>— voir stats →</span></p>
          </div>
        </div>

      {/* ── Modal Stats ── */}
      {showStats && (() => {
        const confirmed = reservations.filter(r => r.status === 'CONFIRMED');
        const cancelled = reservations.filter(r => r.status === 'CANCELLED');
        const noShow    = reservations.filter(r => r.status === 'NO_SHOW');
        const total     = reservations.length;
        const presenceRate = total > 0 ? Math.round((confirmed.length / total) * 100) : 0;

        // Jour favori
        const dayCount = {};
        const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
        confirmed.forEach(r => {
          const d = new Date(r.date + 'T00:00:00');
          const name = dayNames[d.getDay()];
          dayCount[name] = (dayCount[name] || 0) + 1;
        });
        const favDay = Object.entries(dayCount).sort((a,b)=>b[1]-a[1])[0];

        // Mois le plus actif
        const monthCount = {};
        const monthNames = ['Janv','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'];
        confirmed.forEach(r => {
          const m = monthNames[parseInt(r.date.split('-')[1]) - 1];
          monthCount[m] = (monthCount[m] || 0) + 1;
        });
        const favMonth = Object.entries(monthCount).sort((a,b)=>b[1]-a[1])[0];

        return (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowStats(false)}
          >
            <div
              style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                maxWidth: 480, width: '100%',
                padding: '2rem', position: 'relative',
                animation: 'slideUp 0.2s ease'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>📊 Mes Statistiques</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Basées sur votre historique complet</p>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  style={{
                    background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                    borderRadius: '50%', width: 32, height: 32,
                    cursor: 'pointer', color: 'var(--text-secondary)',
                    fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >✕</button>
              </div>

              {/* Stat grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                  { icon: '✅', label: 'Confirmées', value: confirmed.length, color: 'var(--emerald)' },
                  { icon: '✕',  label: 'Annulées',   value: cancelled.length, color: 'var(--rose)' },
                  { icon: '🚫', label: 'No-show',    value: noShow.length,    color: 'var(--amber)' },
                  { icon: '📁', label: 'Total',       value: total,            color: 'var(--violet)' },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} style={{
                    background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)', padding: '1rem',
                    display: 'flex', flexDirection: 'column', gap: '0.25rem'
                  }}>
                    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Taux de présence */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Taux de présence</span>
                  <span style={{ fontWeight: 700 }}>{presenceRate}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div style={{
                    height: '100%', width: `${presenceRate}%`,
                    background: presenceRate >= 80 ? 'var(--emerald)' : presenceRate >= 50 ? 'var(--amber)' : 'var(--rose)',
                    borderRadius: 99, transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>

              {/* Infos fun */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {favDay && (
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '0.6rem 0.8rem', background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>📅 Jour favori</span>
                    <span style={{ fontWeight: 600 }}>{favDay[0]} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({favDay[1]}x)</span></span>
                  </div>
                )}
                {favMonth && (
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '0.6rem 0.8rem', background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>📆 Mois le plus actif</span>
                    <span style={{ fontWeight: 600 }}>{favMonth[0]} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({favMonth[1]} rés.)</span></span>
                  </div>
                )}
                {total === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', fontSize: '0.875rem' }}>
                    📭 Aucune réservation pour le moment
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

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
                  try {
                    const res = await apiFetch(`/api/reservations/ics?id=${activeReservation.id}`);
                    if (!res.ok) {
                      setMessage({ type: 'error', text: 'Erreur lors de la génération du fichier ICS.' });
                      return;
                    }

                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `reservation-${activeReservation.date}.ics`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    setMessage({ type: 'success', text: 'Fichier ICS généré et téléchargé.' });
                  } catch {
                    setMessage({ type: 'error', text: 'Erreur de connexion lors de la génération du fichier ICS.' });
                  }
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
