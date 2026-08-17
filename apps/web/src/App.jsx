import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import CasesList from './pages/CasesList.jsx';
import CaseDetail from './pages/CaseDetail.jsx';
import { getCurrentUser, logout } from './api/auth';

export default function App() {
  const user = getCurrentUser();

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: 1100, margin: '0 auto', padding: '20px 24px', minHeight: '100vh', color: '#1f2937' }}>
      {user && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#d40511', borderRadius: 10, color: '#fff', marginBottom: 28, boxShadow: '0 4px 12px rgba(212,5,17,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#ffcc00', color: '#d40511', padding: '2px 8px', borderRadius: 4, fontWeight: 900 }}>DHL</span>
              ER Management
            </span>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.18)' }}>📊 Dashboard</Link>
            <Link to="/cases" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.18)' }}>📁 Cases</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 13, background: 'rgba(0,0,0,0.2)', padding: '5px 14px', borderRadius: 20, fontWeight: 500 }}>
              👤 {user.name} <span style={{ opacity: 0.85 }}>({user.role})</span>
            </span>
            <button onClick={() => { logout(); window.location.reload(); }} style={{ background: '#fff', color: '#d40511', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Reset Session</button>
          </div>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<CasesList />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

