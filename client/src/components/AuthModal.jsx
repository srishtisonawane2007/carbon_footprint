import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      const res = await register(username, email, password, role);
      if (res.success) onClose();
      else setError('Registration failed');
    } else {
      const res = await login(email, password);
      if (res.success) onClose();
      else setError('Invalid email or password');
    }
  };

  const handleQuickDemoAdmin = async () => {
    await login('admin@carbontrack.com', 'admin123');
    onClose();
  };

  const handleQuickDemoUser = async () => {
    await login('rkumar@ecocorp.com', 'user123');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="panel-header" style={{ marginBottom: '1.2rem' }}>
          <div>
            <h2 className="panel-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isRegisterMode ? <UserPlus size={22} color="#7c3aed" /> : <LogIn size={22} color="#7c3aed" />}
              {isRegisterMode ? 'Create CarbonTrack Account' : 'User & Admin Authentication'}
            </h2>
            <span className="panel-sub">Sign in to access personal or admin dashboard</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="USER">Regular User (Carbon Footprint Logger)</option>
                <option value="ADMIN">System Administrator (Full Control)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {isRegisterMode ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Buttons */}
        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.6rem', textAlign: 'center' }}>
            ⚡ Quick Demo Login Shortcuts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={handleQuickDemoAdmin}
              style={{ background: '#f3e8ff', borderColor: '#d8b4fe', color: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <ShieldAlert size={14} /> Login as ADMIN
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={handleQuickDemoUser}
              style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <UserCheck size={14} /> Login as USER
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
