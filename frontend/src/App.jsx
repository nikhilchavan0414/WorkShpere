import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CompanyRegister from './pages/auth/CompanyRegister';

import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Employees from './pages/Employees';
import HrManagers from './pages/HrManagers';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Holidays from './pages/Holidays';
import Profile from './pages/Profile';

function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      <Route path="/reset-password" element={<PublicOnly><ResetPassword /></PublicOnly>} />
      <Route path="/company-register" element={<PublicOnly><CompanyRegister /></PublicOnly>} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/companies"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={['ADMIN', 'COMPANY', 'HR']}>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-managers"
          element={
            <ProtectedRoute roles={['ADMIN', 'COMPANY']}>
              <HrManagers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute roles={['ADMIN', 'COMPANY', 'HR']}>
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['EMPLOYEE']}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
