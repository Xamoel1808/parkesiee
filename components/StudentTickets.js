'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function StudentTickets() {
  const { apiFetch } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch {}
    setLoading(false);
  }, [apiFetch]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await apiFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', text: data.message });
        setSubject('');
        setMessage('');
        loadTickets();
      } else {
        setFeedback({ type: 'error', text: data.error });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur de connexion.' });
    }
    setSubmitting(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="badge badge-pending">Ouvert</span>;
      case 'IN_PROGRESS': return <span className="badge badge-standard">En cours</span>;
      case 'RESOLVED': return <span className="badge badge-confirmed">Résolu</span>;
      case 'CLOSED': return <span className="badge badge-cancelled">Fermé</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🎫 Mes Réclamations</h1>
        <p>Signalez un problème ou posez une question à l'administration</p>
      </div>

      <div className="card-grid">
        {/* Nouveau ticket */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📝 Nouvelle réclamation</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Sujet</label>
              <input
                className="form-input"
                placeholder="Ex: Problème avec ma place, Erreur de plaque..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                placeholder="Décrivez votre problème en détail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            {feedback && (
              <div className={`alert alert-${feedback.type}`} style={{ marginBottom: '1rem' }}>
                {feedback.text}
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <span className="spinner"></span> : 'Envoyer'}
            </button>
          </form>
        </div>

        {/* Historique */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📜 Historique</div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <p>Aucune réclamation envoyée.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets.map((t) => (
                <div key={t.id} style={{
                  padding: '1rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{t.subject}</div>
                    {getStatusBadge(t.status)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Envoyé le {new Date(t.createdAt).toLocaleDateString('fr-FR')} à {new Date(t.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>{t.message}</div>
                  
                  {t.adminResponse && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: 'var(--radius-xs)',
                      borderLeft: '3px solid var(--accent-blue)',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.25rem' }}>Réponse de l'admin :</div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{t.adminResponse}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
