import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CasesList from './pages/CasesList.jsx';
import CaseDetail from './pages/CaseDetail.jsx';
import { getCurrentUser, logout } from './api/auth';

function RequireAuth({ children }) {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const user = getCurrentUser();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      {user && (
        <nav style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
          <Link to="/">Dashboard</Link>
          <Link to="/cases">Cases</Link>
          <span style={{ marginLeft: 'auto', color: '#666' }}>{user.name} ({user.role})</span>
          <button onClick={() => { logout(); window.location.href = '/login'; }}>Log out</button>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/cases" element={<RequireAuth><CasesList /></RequireAuth>} />
        <Route path="/cases/:id" element={<RequireAuth><CaseDetail /></RequireAuth>} />
      </Routes>
    </div>
  );
}
