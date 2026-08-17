import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <div>
      <nav className="navbar">
        <span className="brand">ER Case Management</span>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/cases">Cases</Link>
        <button onClick={logout}>Log out</button>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
