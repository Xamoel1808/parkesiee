'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage({ onSwitch, onBack }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="brand-icon">🅿️</div>
          <h1>Parking ESIEE-IT</h1>
          <p>Connectez-vous pour gérer vos réservations</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" aria-live="assertive">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Adresse email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="prenom.nom@edu.esiee-it.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Mot de passe</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : '🔑 Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Pas encore de compte ?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Créer un compte
          </a>
          {onBack && (
            <>
              {' '}
              ·{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                Retour a la presentation
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
