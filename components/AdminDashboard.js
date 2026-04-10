'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function AdminDashboard() {
  const { apiFetch } = useAuth();
  const [tab, setTab] = useState('reservations'); // 'reservations' | 'pmr' | 'closures'
  const [date, setDate] = useState('');
  const [reservations, setReservations] = useState([]);
  const [pmrRequests, setPmrRequests] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loadingRes, setLoadingRes] = useState(false);
  const [loadingPmr, setLoadingPmr] = useState(false);
  const [message, setMessage] = useState(null);

  // Closures state
  const [closures, setClosures] = useState([]);
  const [loadingClosures, setLoadingClosures] = useState(false);
  const [closureForm, setClosureForm] = useState({ startDate: '', endDate: '', reason: '', notifyUsers: true });
  const [savingClosure, setSavingClosure] = useState(false);

  // All Users state
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const today = todayStr();
    setDate(today);
    loadReservations(today);
    loadPmrRequests();
    loadClosures();
    loadAllUsers();
  }, []);

  const loadReservations = async (d) => {
    setLoadingRes(true);
    try {
      const [resRes, availRes] = await Promise.all([
        apiFetch(`/api/admin/reservations?date=${d}`),
        apiFetch(`/api/spots/availability?date=${d}`),
      ]);
      if (resRes.ok) { const data = await resRes.json(); setReservations(data.reservations); }
      if (availRes.ok) { const data = await availRes.json(); setAvailability(data); }
    } catch {}
    setLoadingRes(false);
  };

  const loadPmrRequests = async () => {
    setLoadingPmr(true);
    try {
      const res = await apiFetch('/api/admin/users?pmrPending=true');
      if (res.ok) { const data = await res.json(); setPmrRequests(data.users); }
    } catch {}
    setLoadingPmr(false);
  };

  const loadClosures = async () => {
    setLoadingClosures(true);
    try {
      const res = await apiFetch('/api/admin/closures');
      if (res.ok) { const data = await res.json(); setClosures(data.closures); }
    } catch {}
    setLoadingClosures(false);
  };

  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await apiFetch('/api/admin/users');
      if (res.ok) { const data = await res.json(); setAllUsers(data.users); }
    } catch {}
    setLoadingUsers(false);
  };

  const handleUserAction = async (userId, action, userName) => {
    let verb = 'traiter';
    if (action === 'approve') verb = 'approuver la demande PMR de';
    if (action === 'reject') verb = 'rejeter la demande PMR de';
    if (action === 'ban') verb = 'bloquer (blacklist)';
    if (action === 'pardon') verb = 'débloquer';

    if (!confirm(`Êtes-vous sûr de vouloir ${verb} ${userName} ?`)) return;
    try {
      const res = await apiFetch('/api/admin/users', {
        method: 'PUT',
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (res.ok) { 
        setMessage({ type: 'success', text: data.message }); 
        loadPmrRequests();
        loadAllUsers();
      }
      else setMessage({ type: 'error', text: data.error });
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
  };

  const handleAddClosure = async () => {
    if (!closureForm.startDate || !closureForm.endDate || !closureForm.reason.trim()) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs.' });
      return;
    }
    setSavingClosure(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/admin/closures', {
        method: 'POST',
        body: JSON.stringify(closureForm),
      });
      const data = await res.json();
      if (res.ok) {
        let successMsg = data.message;
        if (data.email?.sent) {
          successMsg += ` 📧 ${data.email.sent} email(s) envoyé(s).`;
        } else if (data.email?.error) {
          successMsg += ` ⚠️ Erreur email : ${data.email.error}`;
        }
        setMessage({ type: 'success', text: successMsg });
        setClosureForm({ startDate: '', endDate: '', reason: '', notifyUsers: true });
        loadClosures();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
    setSavingClosure(false);
  };

  const handleDeleteClosure = async (id, reason) => {
    if (!confirm(`Supprimer la fermeture "${reason}" ?`)) return;
    try {
      const res = await apiFetch(`/api/admin/closures?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) { setMessage({ type: 'success', text: data.message }); loadClosures(); }
      else setMessage({ type: 'error', text: data.error });
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
  };

  const handleDateChange = (newDate) => { setDate(newDate); loadReservations(newDate); };
  const formatDate = (d) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };
  const isClosedDate = (d) => closures.some(c => d >= c.startDate && d <= c.endDate);

  return (
    <div>
      <div className="page-header">
        <h1>📋 Administration du parking</h1>
        <p>Gérez les réservations, demandes PMR et fermetures planifiées</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} role="status" aria-live="polite">
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
              position: 'absolute', top: -6, right: -6,
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--accent-rose)', color: 'white',
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {pmrRequests.length}
            </span>
          )}
        </button>
        <button
          className={`btn ${tab === 'closures' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('closures')}
          style={{ position: 'relative' }}
        >
          🔒 Fermetures planifiées
          {closures.filter(c => c.endDate >= todayStr()).length > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--accent-amber)', color: 'white',
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {closures.filter(c => c.endDate >= todayStr()).length}
            </span>
          )}
        </button>
        <button
          className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('users')}
        >
          👥 Tous les Étudiants
        </button>
      </div>

      {/* Reservations tab */}
      {tab === 'reservations' && (
        <>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label className="form-label" htmlFor="admin-date" style={{ margin: 0 }}>Date :</label>
              <input
                id="admin-date"
                type="date"
                className="form-input"
                style={{ maxWidth: 200 }}
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <button className="btn btn-outline btn-sm" onClick={() => handleDateChange(todayStr())}>
                Aujourd'hui
              </button>
              {date && isClosedDate(date) && (
                <span style={{
                  padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245,158,11,0.15)', border: '1px solid var(--accent-amber)',
                  color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 600,
                }}>
                  🔒 Parking fermé ce jour
                </span>
              )}
            </div>
          </div>

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

          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Réservations — {date ? formatDate(date) : '...'}</div>
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
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {u.email} · {u.phone} · Plaque: {u.vehicles.join(', ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleUserAction(u.id, 'approve', u.name)}>
                      ✓ Approuver
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleUserAction(u.id, 'reject', u.name)}>
                      ✕ Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab - Blacklist Management */}
      {tab === 'users' && (
        <div className="card">
          <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div className="card-title">👥 Gestion et Blacklist des Étudiants</div>
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher par nom, email ou plaque..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
          </div>
          {loadingUsers ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Plaque(s)</th>
                    <th>Rôle & PMR</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers
                    .filter((u) => 
                      u.name.toLowerCase().includes(searchUser.toLowerCase()) || 
                      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                      u.vehicles.some(v => v.toLowerCase().includes(searchUser.toLowerCase()))
                    )
                    .map((u) => {
                      const isBanned = u.penaltyUntil && new Date(u.penaltyUntil) > new Date();
                      
                      return (
                      <tr key={u.id} style={{ opacity: isBanned ? 0.7 : 1 }}>
                        <td>
                          <strong>{u.name}</strong><br/>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          {u.vehicles.length > 0 ? u.vehicles.join(', ') : '—'}
                        </td>
                        <td>
                          <span className="badge badge-standard" style={{ marginRight: 4 }}>{u.role}</span>
                          {u.isPmr && <span className="badge badge-pmr">PMR</span>}
                        </td>
                        <td>
                          {isBanned ? (
                            <span className="badge" style={{ background: 'var(--accent-rose)', color: '#fff' }}>⛔ Bloqué</span>
                          ) : (
                            <span className="badge" style={{ background: 'var(--accent-emerald)', color: '#fff' }}>✅ Actif</span>
                          )}
                        </td>
                        <td>
                          {isBanned ? (
                            <button className="btn btn-outline btn-sm" onClick={() => handleUserAction(u.id, 'pardon', u.name)}>
                              🔓 Débloquer
                            </button>
                          ) : (
                            <button className="btn btn-danger btn-sm" onClick={() => handleUserAction(u.id, 'ban', u.name)}>
                              ⛔ Bloquer
                            </button>
                          )}
                        </td>
                      </tr>
                    )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Closures tab */}
      {tab === 'closures' && (
        <>
          {/* Form */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <div className="card-title">🔒 Planifier une fermeture</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date de début</label>
                <input
                  type="date"
                  className="form-input"
                  value={closureForm.startDate}
                  min={todayStr()}
                  onChange={e => setClosureForm({ ...closureForm, startDate: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date de fin</label>
                <input
                  type="date"
                  className="form-input"
                  value={closureForm.endDate}
                  min={closureForm.startDate || todayStr()}
                  onChange={e => setClosureForm({ ...closureForm, endDate: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label">Motif de fermeture</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex : Vacances de Noël, Travaux de réfection…"
                  value={closureForm.reason}
                  onChange={e => setClosureForm({ ...closureForm, reason: e.target.value })}
                />
              </div>
              <div style={{ margin: 0, gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '0.25rem' }}>
                <input
                  id="notify-users-checkbox"
                  type="checkbox"
                  checked={closureForm.notifyUsers}
                  onChange={e => setClosureForm({ ...closureForm, notifyUsers: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                />
                <label
                  htmlFor="notify-users-checkbox"
                  style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)', userSelect: 'none' }}
                >
                  📧 Notifier tous les étudiants par email
                </label>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddClosure}
              disabled={savingClosure}
            >
              {savingClosure ? <span className="spinner"></span> : '🔒 Planifier la fermeture'}
            </button>
          </div>

          {/* List */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Fermetures planifiées</div>
            </div>
            {loadingClosures ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
            ) : closures.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✅</div>
                <h3>Aucune fermeture planifiée</h3>
                <p>Le parking est ouvert en permanence.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {closures.map((c) => {
                  const today = todayStr();
                  const isPast = c.endDate < today;
                  const isActive = c.startDate <= today && c.endDate >= today;
                  return (
                    <div
                      key={c.id}
                      style={{
                        padding: '1rem 1.25rem',
                        background: isActive ? 'rgba(245,158,11,0.08)' : 'var(--bg-glass)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isActive ? 'var(--accent-amber)' : 'var(--border-color)'}`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
                        opacity: isPast ? 0.55 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {isActive ? '🔒' : isPast ? '📁' : '📅'}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.reason}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Du {formatDate(c.startDate)} au {formatDate(c.endDate)}
                            {isActive && (
                              <span style={{ marginLeft: '0.5rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                                — En cours
                              </span>
                            )}
                            {isPast && (
                              <span style={{ marginLeft: '0.5rem', fontStyle: 'italic' }}>
                                — Terminée
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClosure(c.id, c.reason)}
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
