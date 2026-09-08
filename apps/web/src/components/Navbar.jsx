import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DEMO_PERSONAS, switchPersona } from '../api/auth';

export default function Navbar({ currentUser, onUserChange, onOpenRaiseModal, alertCount = 3, onToggleAlerts }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handlePersonaChange(e) {
    const newRole = e.target.value;
    const switched = switchPersona(newRole);
    if (onUserChange) onUserChange(switched);
  }

  const navLinks = [
    { to: '/', label: 'Command Center', icon: '📊', match: (p) => p === '/' || p === '/dashboard' },
    { to: '/cases', label: 'Cases & Actions', icon: '📁', match: (p) => p.startsWith('/cases') },
    ...((currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'line_manager' || currentUser?.role === 'sys_admin') ? [
      { to: '/union', label: 'Union & JCC', icon: '🤝', match: (p) => p === '/union' }
    ] : []),
    ...((currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'sys_admin') ? [
      { to: '/redundancy', label: 'Exit & Restructure', icon: '⚖️', match: (p) => p === '/redundancy' }
    ] : []),
    { to: '/training', label: 'Training Hub', icon: '🎓', match: (p) => p === '/training' },
    ...((currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'sys_admin') ? [
      { to: '/reports', label: 'Q-Reports', icon: '📑', match: (p) => p === '/reports' }
    ] : []),
    ...(currentUser?.role === 'sys_admin' ? [
      { to: '/admin', label: 'Governance', icon: '⚙️', match: (p) => p === '/admin' }
    ] : [])
  ];

  return (
    <>
      {/* TOP COMMAND STRIP */}
      <div className="irms-topbar">
        <div className="irms-topbar-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className="pulse-dot"></span>
            <span style={{ fontWeight: 800, color: 'var(--dhl-yellow)', letterSpacing: '0.6px', fontSize: 11.5 }}>
              DHL IRMS LIVE
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span className="irms-tagline">
            Industrial Relations &amp; Workplace Harmony · Express Nigeria &amp; West Africa
          </span>
        </div>

        <div className="irms-topbar-right">
          <div className="persona-switcher" title="Switch active role context for preview">
            <span style={{ color: 'var(--slate-400)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em' }}>
              PERSONA:
            </span>
            <select value={currentUser?.role || 'er_manager'} onChange={handlePersonaChange}>
              {DEMO_PERSONAS.map(p => (
                <option key={p.role} value={p.role}>
                  {p.role_label} ({p.name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 11.5, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 6 }}>
            <span>📍</span>
            <strong>{currentUser?.location?.split('(')[0] || 'Lagos HQ'}</strong>
          </div>
        </div>
      </div>

      {/* PRIMARY DHL RED NAVBAR */}
      <nav className="irms-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" className="irms-brand">
            <span className="dhl-logo-badge">DHL</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="irms-brand-title">IR Command Portal</span>
              <span className="irms-brand-subtitle">
                People &amp; Workplace Harmony
              </span>
            </div>
          </Link>

          <div className="irms-nav-links">
            {navLinks.map((item) => {
              const active = item.match(location.pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`irms-nav-link ${active ? 'active' : ''}`}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="irms-nav-actions">
          <button
            onClick={onToggleAlerts}
            className="btn-icon"
            title="Live Operational Alerts"
            style={{ position: 'relative' }}
          >
            <span>🔔</span>
            <span>Alerts</span>
            {alertCount > 0 && (
              <span style={{
                background: 'var(--dhl-yellow)',
                color: 'var(--charcoal-950)',
                fontSize: 10.5,
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '10px',
                lineHeight: 1.2
              }}>
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenRaiseModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: 12.5 }}
          >
            <span style={{ fontSize: 15, fontWeight: 900 }}>+</span> Raise a Concern
          </button>

          <button
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="mobile-drawer">
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="dhl-logo-badge">DHL</span>
                <span style={{ fontWeight: 800, fontSize: 15 }}>IR Portal</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {navLinks.map((item) => {
                const active = item.match(location.pathname);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: active ? 'var(--dhl-yellow)' : '#E2E8F0',
                      background: active ? 'rgba(255,204,0,0.1)' : 'transparent',
                      fontWeight: active ? 800 : 600,
                      fontSize: 14
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginBottom: 6 }}>LOGGED IN AS:</div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{currentUser?.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--slate-300)' }}>{currentUser?.role_title || currentUser?.role}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
