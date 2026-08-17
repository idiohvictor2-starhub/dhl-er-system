import React from 'react';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="pulse-dot"></span>
            <span style={{ fontWeight: 800, color: '#FFCC00', letterSpacing: '0.6px' }}>DHL IRMS</span>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <span className="irms-tagline">Bridging the Gap Between HR and the People</span>
        </div>
        <div className="irms-topbar-right">
          <div className="persona-switcher">
            <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700 }}>DEMO PERSONA:</span>
            <select value={currentUser?.role || 'er_manager'} onChange={handlePersonaChange}>
              {DEMO_PERSONAS.map(p => (
                <option key={p.role} value={p.role}>
                  {p.role_label}
                </option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: 11.5, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 4 }}>
            📍 <strong>{currentUser?.location?.split('(')[0] || 'Lagos HQ'}</strong>
          </span>
        </div>
      </div>

      {/* PRIMARY DHL RED NAVBAR */}
      <nav className="irms-navbar">
        <Link to="/" className="irms-brand">
          <span className="dhl-logo-badge">DHL</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="irms-brand-title">Industrial Relations MS</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.6px', textTransform: 'uppercase', fontWeight: 600 }}>
              People &amp; Workplace Harmony Portal
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

          {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'line_manager' || currentUser?.role === 'sys_admin') && (
            <Link to="/union" className={`irms-nav-link ${location.pathname === '/union' ? 'active' : ''}`}>
              🤝 Union &amp; JCC
            </Link>
          )}

          {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'sys_admin') && (
            <Link to="/redundancy" className={`irms-nav-link ${location.pathname === '/redundancy' ? 'active' : ''}`}>
              ⚖️ Redundancy / Exit
            </Link>
          )}

          <Link to="/training" className={`irms-nav-link ${location.pathname === '/training' ? 'active' : ''}`}>
            🎓 Training Hub
          </Link>

          {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'sys_admin') && (
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
            className="btn-icon"
            title="View Live Alerts"
          >
            🔔 Alerts
            {alertCount > 0 && (
              <span style={{ background: '#FFCC00', color: '#0F172A', fontSize: 11, fontWeight: 900, padding: '1px 7px', borderRadius: '10px' }}>
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenRaiseModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ fontSize: 15, fontWeight: 900 }}>+</span> Raise a Concern
          </button>
        </div>
      </nav>
    </>
  );
}
