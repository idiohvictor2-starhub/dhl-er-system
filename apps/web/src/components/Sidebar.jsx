import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ currentUser }) {
  const location = useLocation();

  const mainNavItems = [
    {
      to: '/',
      label: 'Command Center',
      icon: <LayoutDashboard size={18} />,
      active: location.pathname === '/' || location.pathname === '/dashboard'
    },
    {
      to: '/cases',
      label: 'Case Tracker',
      icon: <FolderKanban size={18} />,
      active: location.pathname.startsWith('/cases')
    }
  ];

  const managementNavItems = [
    ...((currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'line_manager' || currentUser?.role === 'sys_admin') ? [
      {
        to: '/union',
        label: 'Union / JCC',
        icon: <Users size={18} />,
        active: location.pathname === '/union'
      }
    ] : []),
    {
      to: '/training',
      label: 'Capability Academy',
      icon: <GraduationCap size={18} />,
      active: location.pathname === '/training'
    },
    ...((currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'sys_admin') ? [
      {
        to: '/reports',
        label: 'Analytics & Insights',
        icon: <BarChart3 size={18} />,
        active: location.pathname === '/reports'
      },
      {
        to: '/redundancy',
        label: 'Exit & Governance',
        icon: <Scale size={18} />,
        active: location.pathname === '/redundancy'
      }
    ] : [])
  ];

  const adminNavItems = [
    ...(currentUser?.role === 'sys_admin' ? [
      {
        to: '/admin',
        label: 'Audit & Governance',
        icon: <ShieldCheck size={18} />,
        active: location.pathname === '/admin'
      }
    ] : [])
  ];

  const userInitial = (currentUser?.name || 'I').charAt(0).toUpperCase();

  return (
    <aside className="app-sidebar">
      <div>
        {/* BRAND HEADER */}
        <Link to="/" className="sidebar-header" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-badge">
            IR
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">DHL IRMS</span>
            <span className="sidebar-brand-subtitle">Express Industrial Relations</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-label">MAIN WORKSPACE</div>
          {mainNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
            >
              <div className="sidebar-nav-item-left">
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}

          {managementNavItems.length > 0 && (
            <>
              <div className="sidebar-nav-section-label" style={{ marginTop: 8 }}>MANAGEMENT</div>
              {managementNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-item-left">
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </>
          )}

          {adminNavItems.length > 0 && (
            <>
              <div className="sidebar-nav-section-label" style={{ marginTop: 8 }}>SYSTEM ADMINISTRATION</div>
              {adminNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-item-left">
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>

      {/* SIGNED IN USER FOOTER */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {userInitial}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser?.name || 'Idioh Victor'}</div>
            <div className="sidebar-user-role">
              {currentUser?.role === 'er_manager' ? 'IR HR Admin' : currentUser?.role_title || currentUser?.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
