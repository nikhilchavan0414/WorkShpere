import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'COMPANY', 'HR', 'EMPLOYEE'] },
  { path: '/companies', label: 'Companies', icon: '🏢', roles: ['ADMIN'] },
  { path: '/employees', label: 'Employees', icon: '👥', roles: ['ADMIN', 'COMPANY', 'HR'] },
  { path: '/hr-managers', label: 'HR Managers', icon: '🧑‍💼', roles: ['ADMIN', 'COMPANY'] },
  { path: '/departments', label: 'Departments', icon: '🏛️', roles: ['ADMIN', 'COMPANY', 'HR'] },
  { path: '/attendance', label: 'Attendance', icon: '🕐', roles: ['ADMIN', 'COMPANY', 'HR', 'EMPLOYEE'] },
  { path: '/leaves', label: 'Leave Management', icon: '📅', roles: ['ADMIN', 'COMPANY', 'HR', 'EMPLOYEE'] },
  { path: '/payroll', label: 'Payroll', icon: '💰', roles: ['ADMIN', 'COMPANY', 'HR', 'EMPLOYEE'] },
  { path: '/holidays', label: 'Holidays', icon: '🎉', roles: ['ADMIN', 'COMPANY', 'HR', 'EMPLOYEE'] },
  { path: '/profile', label: 'My Profile', icon: '👤', roles: ['EMPLOYEE'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>WorkSphere</h2>
        <small>Human Resource Management</small>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="mb-2">
          <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{user?.username}</strong>
          <div><span className="role-badge">{user?.role}</span></div>
        </div>
        <button type="button" className="btn btn-outline-light btn-sm w-100" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
