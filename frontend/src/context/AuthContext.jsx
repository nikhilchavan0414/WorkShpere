import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, employeeApi, companyApi, hrApi } from '../api/services';

const AuthContext = createContext(null);

async function resolveContext(user) {
  const ctx = { ...user, companyId: null, employeeId: null };

  if (user.role === 'EMPLOYEE') {
    const profile = await employeeApi.getProfile(user.userId);
    ctx.employeeId = profile.id;
    ctx.companyId = profile.companyId;
    ctx.profile = profile;
  } else if (user.role === 'COMPANY') {
    const companies = await companyApi.getAll();
    const company = companies.find((c) => c.email === user.email);
    if (company) ctx.companyId = company.id;
  } else if (user.role === 'HR') {
    const managers = await hrApi.getManagers();
    const manager = managers.find((m) => m.email === user.email);
    if (manager) ctx.companyId = manager.companyId;
  }

  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const needsContext = parsed.role !== 'ADMIN' && !parsed.companyId;

      if (!needsContext) {
        setUser(parsed);
        setLoading(false);
        return;
      }

      resolveContext(parsed)
        .then((enriched) => {
          localStorage.setItem('user', JSON.stringify(enriched));
          setUser(enriched);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const baseUser = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem('token', data.token);
    const enriched = await resolveContext(baseUser);
    localStorage.setItem('user', JSON.stringify(enriched));
    setUser(enriched);
    return enriched;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const refreshContext = useCallback(async () => {
    if (!user) return;
    const enriched = await resolveContext(user);
    localStorage.setItem('user', JSON.stringify(enriched));
    setUser(enriched);
    return enriched;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshContext, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function hasRole(user, ...roles) {
  return user && roles.includes(user.role);
}
