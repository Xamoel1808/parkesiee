'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function StudentProfile() {
  const { user, apiFetch, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [requestingPmr, setRequestingPmr] = useState(false);
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [pmrFile, setPmrFile] = useState(null);
  const [pmrFileError, setPmrFileError] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
        setEditing(false);
        refreshUser();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
    setSaving(false);
  };

  const handlePmrRequest = async () => {
    if (!pmrFile) {
      setPmrFileError('Veuillez sélectionner un fichier.');
      return;
    }
    setRequestingPmr(true);
    setMessage(null);
    setPmrFileError(null);
    try {
      // Convert file to Base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(pmrFile);
      });

      const base64File = await base64Promise;

      const res = await apiFetch('/api/users/pmr-request', { 
        method: 'POST',
        body: JSON.stringify({ pmrProof: base64File })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setPmrFile(null);
        refreshUser();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erreur de connexion ou de lecture du fichier.' });
    }
    setRequestingPmr(false);
  };

  const handleAddVehicle = async () => {
    if (!newPlate.trim()) return;
    setAddingVehicle(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/users/vehicles', {
        method: 'POST',
        body: JSON.stringify({ licensePlate: newPlate }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setNewPlate('');
        refreshUser();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    }
    setAddingVehicle(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>👤 Mon Profil</h1>
        <p>Gérez vos informations personnelles et votre statut</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} role="status" aria-live="polite">
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="card-grid">
        {/* Personal info */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📝 Informations personnelles</div>
            {!editing && (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                ✏️ Modifier
              </button>
            )}
          </div>

          {editing ? (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Nom complet</label>
                <input
                  id="profile-name"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-phone">Téléphone</label>
                <input
                  id="profile-phone"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner"></span> : '💾 Enregistrer'}
                </button>
                <button className="btn btn-outline" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone }); }}>
                  Annuler
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Nom</span>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Email</span>
                <div style={{ fontWeight: 500 }}>{user.email}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Téléphone</span>
                <div style={{ fontWeight: 500 }}>{user.phone}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Rôle</span>
                <div style={{ fontWeight: 500 }}>{user.role}</div>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🚗 Mes véhicules</div>
          </div>
          {user.vehicles?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {user.vehicles.map((v) => (
                <div key={v.id} style={{
                  padding: '1rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🚗</span>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      letterSpacing: '1px',
                      fontFamily: 'monospace',
                    }}>
                      {v.licensePlate}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plaque enregistrée</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginBottom: '1rem' }}>
              <p>Aucun véhicule enregistré</p>
            </div>
          )}

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label className="form-label" htmlFor="profile-new-plate" style={{ fontSize: '0.9rem' }}>Ajouter une nouvelle plaque</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  id="profile-new-plate"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Ex: AB-123-CD"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddVehicle}
                  disabled={addingVehicle || !newPlate.trim()}
                >
                  {addingVehicle ? <span className="spinner"></span> : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PMR Section */}
      {user.role === 'STUDENT' && (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <div className="card-header">
            <div className="card-title">♿ Statut PMR (Handicap)</div>
            {user.isPmr && user.pmrValidatedAt && (
              <span className="badge badge-confirmed">✓ Validé</span>
            )}
            {user.pmrRequested && !user.pmrValidatedAt && (
              <span className="badge badge-pending">⏳ En attente</span>
            )}
          </div>

          {user.isPmr && user.pmrValidatedAt ? (
            <div className="alert alert-success" style={{ margin: 0 }}>
              <span className="alert-icon">✅</span>
              <div>
                <strong>Statut PMR validé</strong>
                <p style={{ marginTop: '0.25rem', opacity: 0.85 }}>
                  Vous bénéficiez d'un accès prioritaire aux places PMR et d'une fenêtre de réservation étendue à 48h
                  lorsque les places PMR sont complètes.
                </p>
              </div>
            </div>
          ) : user.pmrRequested ? (
            <div className="alert alert-warning" style={{ margin: 0 }}>
              <span className="alert-icon">⏳</span>
              <div>
                <strong>Demande en cours de traitement</strong>
                <p style={{ marginTop: '0.25rem', opacity: 0.85 }}>
                  Votre demande de statut PMR a été soumise et est en attente de validation par un administrateur.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Si vous êtes titulaire d'une carte de mobilité inclusion (CMI) ou d'une carte européenne de
                stationnement, vous pouvez soumettre une demande pour bénéficier du statut PMR.
              </p>
              
              <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.25rem' }}>
                <label className="form-label">Justificatif (Photo ou PDF)</label>
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={(e) => setPmrFile(e.target.files[0])}
                  />
                  <div style={{ color: 'var(--text-muted)' }}>
                    {pmrFile ? (
                      <div style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
                        📄 {pmrFile.name}
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📁</div>
                        Cliquez ou glissez un fichier ici
                      </>
                    )}
                  </div>
                </div>
                {pmrFileError && <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{pmrFileError}</div>}
              </div>

              <button
                className="btn btn-primary"
                onClick={handlePmrRequest}
                disabled={requestingPmr || !pmrFile}
              >
                {requestingPmr ? <span className="spinner"></span> : '♿ Envoyer ma demande PMR'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
