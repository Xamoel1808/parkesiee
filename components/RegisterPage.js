'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function RegisterPage({ onSwitch, onBack }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    licensePlate: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        licensePlate: form.licensePlate.toUpperCase(),
        password: form.password,
      });
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
          <h1>Créer un compte</h1>
          <p>Inscrivez-vous pour réserver votre place</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" aria-live="assertive">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Nom complet</label>
            <input
              id="reg-name"
              className="form-input"
              name="name"
              type="text"
              placeholder="Jean Dupont"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Adresse email</label>
            <input
              id="reg-email"
              className="form-input"
              name="email"
              type="email"
              placeholder="prenom.nom@edu.esiee-it.fr"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Numéro de téléphone</label>
            <input
              id="reg-phone"
              className="form-input"
              name="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-plate">Plaque d'immatriculation</label>
            <input
              id="reg-plate"
              className="form-input"
              name="licensePlate"
              type="text"
              placeholder="AA-123-BB"
              value={form.licensePlate}
              onChange={handleChange}
              required
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Mot de passe</label>
            <input
              id="reg-password"
              className="form-input"
              name="password"
              type="password"
              placeholder="Min. 6 caractères"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirmer le mot de passe</label>
            <input
              id="reg-confirm"
              className="form-input"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : '✨ Créer mon compte'}
          </button>
        </form>

        <div className="auth-footer">
          Déjà un compte ?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Se connecter
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
