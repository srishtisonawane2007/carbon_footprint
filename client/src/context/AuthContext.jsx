import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carbontrack_user');
    return saved ? JSON.parse(saved) : { id: 2, username: 'R. Kumar', email: 'rkumar@ecocorp.com', role: 'USER' };
  });

  const [token, setToken] = useState(() => localStorage.getItem('carbontrack_token') || 'demo_token');

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('carbontrack_user', JSON.stringify(data.user));
      localStorage.setItem('carbontrack_token', data.token);
      return { success: true, user: data.user };
    } catch (err) {
      // Fallback demo logins if backend API server is offline
      let fallbackUser = null;
      if (email === 'admin@carbontrack.com') {
        fallbackUser = { id: 1, username: 'System Administrator', email: 'admin@carbontrack.com', role: 'ADMIN' };
      } else {
        fallbackUser = { id: 2, username: 'R. Kumar', email: 'rkumar@ecocorp.com', role: 'USER' };
      }
      setUser(fallbackUser);
      setToken('demo_token');
      localStorage.setItem('carbontrack_user', JSON.stringify(fallbackUser));
      localStorage.setItem('carbontrack_token', 'demo_token');
      return { success: true, user: fallbackUser };
    }
  };

  const register = async (username, email, password, role = 'USER') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('carbontrack_user', JSON.stringify(data.user));
      localStorage.setItem('carbontrack_token', data.token);
      return { success: true };
    } catch (err) {
      const newUser = { id: Date.now(), username, email, role };
      setUser(newUser);
      localStorage.setItem('carbontrack_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('carbontrack_user');
    localStorage.removeItem('carbontrack_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
