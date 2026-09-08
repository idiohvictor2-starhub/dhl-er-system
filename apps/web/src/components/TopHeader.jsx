import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DEMO_PERSONAS, switchPersona } from '../api/auth';
import { Search, Bell, Plus, ChevronDown, Check, UserCheck } from 'lucide-react';

export default function TopHeader({ currentUser, onUserChange, onOpenRaiseModal, alertCount = 3, onToggleAlerts }) {
  const location = useLocation();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  function getPageHeaderInfo() {
    const p = location.pathname;
    if (p === '/' || p === '/dashboard') {
      return { title: 'Command Center', subtitle: 'Real-time Industrial Relations executive intelligence & operational monitoring' };
    }
    if (p.startsWith('/cases')) {
      return { title: 'Case Tracker', subtitle: 'Central dispute management, grievance tracking & disciplinary workflow' };
    }
    if (p === '/union') {
      return { title: 'Union / JCC', subtitle: 'Bilateral negotiations, collective bargaining agreements & joint actions' };
    }
    if (p === '/training') {
      return { title: 'Capability Academy', subtitle: 'Manager training compliance & policy certification registry' };
    }
    if (p === '/reports') {
      return { title: 'Analytics & Insights', subtitle: 'Executive quarterly reports, risk radar & operational trends' };
    }
    if (p === '/redundancy') {
      return { title: 'Exit & Governance', subtitle: 'Statutory compliance, exit tracker & redundancy governance' };
    }
    if (p === '/admin') {
      return { title: 'Audit Log & Administration', subtitle: 'Immutable audit trail, system activity logs & user role management' };
    }
    return { title: 'DHL IRMS', subtitle: 'Industrial Relations Management System' };
  }

  const { title, subtitle } = getPageHeaderInfo();
  const userInitial = (currentUser?.name || 'I').charAt(0).toUpperCase();

  function handleSelectPersona(role) {
    const switched = switchPersona(role);
    if (onUserChange) onUserChange(switched);
    setIsPersonaMenuOpen(false);
  }

  return (
    <header className="app-topbar">
      {/* LEFT: PAGE TITLE & SUBTITLE */}
      <div className="topbar-left">
        <h2 className="topbar-page-title">{title}</h2>
        <span className="topbar-page-subtitle">{subtitle}</span>
      </div>

      {/* RIGHT: SEARCH, RAISE CASE, ALERTS & USER PERSONA */}
      <div className="topbar-right">
        {/* QUICK SEARCH */}
        <div className="topbar-search-box">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search cases, employees..." 
            className="topbar-search-input"
          />
          <span className="kbd-shortcut">⌘K</span>
        </div>

        {/* RAISE CONCERN PRIMARY CTA */}
        <button
          onClick={onOpenRaiseModal}
          className="btn btn-primary"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Raise Concern</span>
        </button>

        {/* ALERTS BELL */}
        <button
          onClick={onToggleAlerts}
          className="notification-bell-btn"
          title="Operational Alerts"
          aria-label="View live operational alerts"
        >
          <Bell size={19} />
          {alertCount > 0 && <span className="bell-badge-dot" />}
        </button>

        {/* USER PROFILE PILL / PERSONA SELECTOR */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-pill"
            onClick={() => setIsPersonaMenuOpen(prev => !prev)}
            title="Click to switch persona role"
          >
            <div className="user-avatar-circle">
              {userInitial}
            </div>
            <div className="user-pill-info">
              <span className="user-pill-name">{currentUser?.name || 'Idioh Victor'}</span>
              <span className="user-pill-role">
                {currentUser?.role === 'er_manager' ? 'IR HR Admin' : currentUser?.role_title || currentUser?.role}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />
          </div>

          {/* PERSONA DROPDOWN MENU */}
          {isPersonaMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 60 }}
                onClick={() => setIsPersonaMenuOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 280,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border-light)',
                  zIndex: 70,
                  padding: '12px',
                  animation: 'slideUp 0.15s ease-out'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  padding: '4px 8px 10px', 
                  fontSize: 11, 
                  fontWeight: 800, 
                  color: 'var(--text-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: 8
                }}>
                  <UserCheck size={14} />
                  <span>Switch Demo Persona</span>
                </div>
                {DEMO_PERSONAS.map(p => {
                  const isCurrent = (currentUser?.role || 'er_manager') === p.role;
                  return (
                    <div
                      key={p.role}
                      onClick={() => handleSelectPersona(p.role)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: isCurrent ? 'var(--dhl-yellow-subtle)' : 'transparent',
                        border: isCurrent ? '1px solid var(--dhl-yellow)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: isCurrent ? '#000000' : 'var(--text-main)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                          {p.role_label}
                        </div>
                      </div>
                      {isCurrent && <Check size={16} style={{ color: '#000000', strokeWidth: 3 }} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
