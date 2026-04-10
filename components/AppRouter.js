'use client';

import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import LandingPage from './LandingPage';
import StudentDashboard from './StudentDashboard';
import StudentProfile from './StudentProfile';
import AdminDashboard from './AdminDashboard';
import AgentLookup from './AgentLookup';
import Navbar from './Navbar';
import ReglementPage from './ReglementPage';

export default function AppRouter() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('landing'); // 'landing' | 'login' | 'register'

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    if (authMode === 'landing') {
      return (
        <LandingPage
          onLogin={() => setAuthMode('login')}
          onRegister={() => setAuthMode('register')}
        />
      );
    }

    if (authMode === 'register') {
      return (
        <RegisterPage
          onSwitch={() => setAuthMode('login')}
          onBack={() => setAuthMode('landing')}
        />
      );
    }
    return (
      <LoginPage
        onSwitch={() => setAuthMode('register')}
        onBack={() => setAuthMode('landing')}
      />
    );
  }

  // Logged in — render app shell
  const renderPage = () => {
    if (user.role === 'ADMIN') {
      switch (page) {
        case 'lookup': return <AgentLookup />;
        case 'profile': return <StudentProfile />;
        case 'reglement': return <ReglementPage />;
        default: return <AdminDashboard />;
      }
    }
    if (user.role === 'AGENT') {
      switch (page) {
        case 'profile': return <StudentProfile />;
        case 'reglement': return <ReglementPage />;
        default: return <AgentLookup />;
      }
    }
    // STUDENT
    switch (page) {
      case 'profile': return <StudentProfile />;
      case 'reglement': return <ReglementPage />;
      default: return <StudentDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={page} onNavigate={setPage} />
      <main className="main-content slide-up">
        {renderPage()}
      </main>
    </div>
  );
}
