'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function AdminDashboard() {
  const { apiFetch } = useAuth();
  const [tab, setTab] = useState('reservations'); // 'reservations' | 'pmr'
  const [date, setDate] = useState('');
  const [reservations, setReservations] = useState([]);
  const [pmrRequests, setPmrRequests] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loadingRes, setLoadingRes] = useState(false);
  const [loadingPmr, setLoadingPmr] = useState(false);
  const [message, setMessage] = useState(null);

  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const today = todayStr();
    setDate(today);
    loadReservations(today);
    loadPmrRequests();
  }, []);

  const loadReservations = async (d) => {
    setLoadingRes(true);
    try {
      const [resRes, availRes] = await Promise.all([
        apiFetch(`/api/admin/reservations?date=${d}`),
        apiFetch(`/api/spots/availability?date=${d}`),
      ]);
      if (resRes.ok) {
        const data = await resRes.json();
        setReservations(data.reservations);
      }
      if (availRes.ok) {
        const data = await availRes.json();
        setAvailability(data);
      }
    } catch {}
    setLoadingRes(false);
  };

  const loadPmrRequests = async () => {
    setLoadingPmr(true);
    try {
      const res = await apiFetch('/api/admin/users?pmrPending=true');
      if (res.ok) {
        const data = await res.json();
        setPmrRequests(data.users);
      }
    } catch {}
    setLoadingPmr(false);
  };

  const handlePmrAction = async (userId, action, userName) => {
    const verb = action === 'approve' ? 'approuver' : 'rejeter';
    if (!confirm(`Êtes-vous sûr de vouloir ${verb} la demande PMR de ${userName} ?`)) return;

    try {
      const res = await apiFetch('/api/admin/users', {
        method: 'PUT',
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        loadPmrRequests();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    loadReservations(newDate);
  };

  const formatDate = (d) => {
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  const pctUsed = (avail, total) => total > 0 ? ((total - avail) / total) * 100 : 0;

  return (
    <div>
      <div className="page-header">
        <h1>📋 Administration du parking</h1>
        <p>Gérez les réservations et les demandes PMR</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${tab === 'reservations' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('reservations')}
        >
          📅 Réservations du jour
        </button>
        <button
          className={`btn ${tab === 'pmr' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('pmr')}
          style={{ position: 'relative' }}
        >
          ♿ Demandes PMR
          {pmrRequests.length > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--accent-rose)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {pmrRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Reservations tab */}
      {tab === 'reservations' && (
        <>
          {/* Date picker + stats */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label className="form-label" style={{ margin: 0 }}>Date :</label>
              <input
                type="date"
                className="form-input"
                style={{ maxWidth: 200 }}
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <button className="btn btn-outline btn-sm" onClick={() => handleDateChange(todayStr())}>
                Aujourd'hui
              </button>
            </div>
          </div>

          {/* Availability stats */}
          {availability && (
            <div className="card-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="stat-card">
                <div className="stat-icon blue">🚗</div>
                <div className="stat-info">
                  <h3>{reservations.length}</h3>
                  <p>Réservations confirmées</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon emerald">✅</div>
                <div className="stat-info">
                  <h3>{availability.standard.available}</h3>
                  <p>Places standard libres</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon amber">♿</div>
                <div className="stat-info">
                  <h3>{availability.pmr.available}</h3>
                  <p>Places PMR libres</p>
                </div>
              </div>
            </div>
          )}

          {/* Reservations table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Réservations — {formatDate(date)}</div>
            </div>
            {loadingRes ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
            ) : reservations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>Aucune réservation</h3>
                <p>Pas de réservations pour cette date.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Place</th>
                      <th>Type</th>
                      <th>Étudiant</th>
                      <th>Téléphone</th>
                      <th>Plaque(s)</th>
                      <th>PMR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>n°{r.spotNumber}</td>
                        <td>
                          <span className={`badge ${r.spotType === 'PMR' ? 'badge-pmr' : 'badge-standard'}`}>
                            {r.spotType}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{r.student.name}</td>
                        <td>{r.student.phone}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.student.licensePlates.join(', ')}</td>
                        <td>{r.student.isPmr ? '♿' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* PMR requests tab */}
      {tab === 'pmr' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">♿ Demandes de statut PMR en attente</div>
          </div>
          {loadingPmr ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
          ) : pmrRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h3>Aucune demande en attente</h3>
              <p>Toutes les demandes PMR ont été traitées.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pmrRequests.map((u) => (
                <div
                  key={u.id}
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {u.email} · {u.phone} · Plaque: {u.vehicles.join(', ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handlePmrAction(u.id, 'approve', u.name)}
                    >
                      ✓ Approuver
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handlePmrAction(u.id, 'reject', u.name)}
                    >
                      ✕ Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
