import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import bgImage from "../../assets/layoutt.jpg";

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />

      <div
        className="main-content"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        <header className="topbar">
          <div>
            <strong>Welcome, {user?.username}</strong>
          </div>
          <span className="role-badge">{user?.role}</span>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}