'use client';

import { useAuth } from '@/lib/AuthContext';

export default function Navbar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();

  const roleBadge = () => {
    if (user.role === 'ADMIN') return <span className="nav-badge admin">Admin</span>;
    if (user.role === 'AGENT') return <span className="nav-badge agent">Agent</span>;
    if (user.isPmr) return <span className="nav-badge pmr">PMR ♿</span>;
    return null;
  };

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
        <div className="brand-icon">🅿️</div>
        <span>Parking ESIEE-IT</span>
      </a>

      <div className="navbar-nav">
        {user.role === 'STUDENT' && (
          <>
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              👤 Profil
            </button>
            <button
              className={`nav-link ${currentPage === 'reglement' ? 'active' : ''}`}
              onClick={() => onNavigate('reglement')}
            >
              📜 Règlement
            </button>
            <button
              className={`nav-link ${currentPage === 'tickets' ? 'active' : ''}`}
              onClick={() => onNavigate('tickets')}
            >
              🎫 Réclamations
            </button>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              📋 Gestion
            </button>
            <button
              className={`nav-link ${currentPage === 'lookup' ? 'active' : ''}`}
              onClick={() => onNavigate('lookup')}
            >
              🔍 Vérification
            </button>
            <button
              className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              👤 Profil
            </button>
            <button
              className={`nav-link ${currentPage === 'reglement' ? 'active' : ''}`}
              onClick={() => onNavigate('reglement')}
            >
              📜 Règlement
            </button>
            <button
              className={`nav-link ${currentPage === 'tickets' ? 'active' : ''}`}
              onClick={() => onNavigate('tickets')}
            >
              🎫 Réclamations
            </button>
          </>
        )}

        {user.role === 'AGENT' && (
          <>
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              🔍 Vérification
            </button>
            <button
              className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              👤 Profil
            </button>
            <button
              className={`nav-link ${currentPage === 'reglement' ? 'active' : ''}`}
              onClick={() => onNavigate('reglement')}
            >
              📜 Règlement
            </button>
          </>
        )}

        <div className="nav-user">
          <span className="nav-user-name">{user.name}</span>
          {roleBadge()}
          <button className="btn-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
