import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DEMO_PERSONAS, switchPersona } from '../api/auth';

export default function Navbar({ currentUser, onUserChange, onOpenRaiseModal, alertCount = 3, onToggleAlerts }) {
  const location = useLocation();

  function handlePersonaChange(e) {
    const newRole = e.target.value;
    const switched = switchPersona(newRole);
    if (onUserChange) onUserChange(switched);
  }

  return (
    <>
      {/* TOP COMMAND STRIP */}
      <div className="irms-topbar">
        <div className="irms-topbar-left">
          <span style={{ fontWeight: 800, color: '#FFCC00', letterSpacing: '0.5px' }}>DHL IRMS</span>
          <span style={{ color: '#475569' }}>|</span>
          <span className="irms-tagline">Bridging the Gap Between HR and the People</span>
        </div>
        <div className="irms-topbar-right">
          <div className="persona-switcher">
            <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>DEMO PERSONA:</span>
            <select value={currentUser?.role || 'er_manager'} onChange={handlePersonaChange}>
              {DEMO_PERSONAS.map(p => (
                <option key={p.role} value={p.role}>
                  {p.role_label}
                </option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: 12, color: '#CBD5E1' }}>
            📍 {currentUser?.location?.split('(')[0] || 'Lagos'}
          </span>
        </div>
      </div>

      {/* PRIMARY DHL NAVBAR */}
      <nav className="irms-navbar">
        <Link to="/" className="irms-brand">
          <span className="dhl-logo-badge">DHL</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="irms-brand-title">IRMS Command Center</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Industrial Relations Management
            </span>
          </div>
        </Link>

        <div className="irms-nav-links">
          <Link to="/" className={`irms-nav-link ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}>
            📊 Dashboard
          </Link>
          <Link to="/cases" className={`irms-nav-link ${location.pathname.startsWith('/cases') ? 'active' : ''}`}>
            📁 Cases &amp; Actions
          </Link>

          {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'line_manager') && (
            <Link to="/union" className={`irms-nav-link ${location.pathname === '/union' ? 'active' : ''}`}>
              🤝 Union &amp; JCC
            </Link>
          )}

          {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director') && (
            <Link to="/redundancy" className={`irms-nav-link ${location.pathname === '/redundancy' ? 'active' : ''}`}>
              ⚖️ Redundancy / Exit
            </Link>
          )}

          <Link to="/training" className={`irms-nav-link ${location.pathname === '/training' ? 'active' : ''}`}>
            🎓 Training
          </Link>

          {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director') && (
            <Link to="/reports" className={`irms-nav-link ${location.pathname === '/reports' ? 'active' : ''}`}>
              📑 Q-Reports
            </Link>
          )}

          {currentUser?.role === 'sys_admin' && (
            <Link to="/admin" className={`irms-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              ⚙️ Governance
            </Link>
          )}
        </div>

        <div className="irms-nav-actions">
          <button
            onClick={onToggleAlerts}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600
            }}
          >
            🔔 Alerts
            {alertCount > 0 && (
              <span style={{ background: '#FFCC00', color: '#0F172A', fontSize: 11, fontWeight: 800, padding: '1px 6px', borderRadius: '10px' }}>
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenRaiseModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            ➕ Raise a Concern
          </button>
        </div>
      </nav>
    </>
  );
}
