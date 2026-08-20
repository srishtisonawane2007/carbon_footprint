import React from 'react';
import { Leaf, PlusCircle, ShieldAlert, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenLogger, onOpenAuth, viewMode, setViewMode }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="top-navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Leaf size={20} />
        </div>
        <span>CarbonTrack</span>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-item ${activeTab === 'dashboard' && viewMode === 'user' ? 'active' : ''}`}
          onClick={() => {
            setViewMode('user');
            setActiveTab('dashboard');
          }}
        >
          User Dashboard
        </button>

        {isAdmin && (
          <button
            className={`nav-tab-item ${viewMode === 'admin' ? 'active' : ''}`}
            onClick={() => setViewMode('admin')}
            style={{ color: '#7c3aed', fontWeight: 800 }}
          >
            <ShieldAlert size={16} /> Admin Control Center
          </button>
        )}

        {viewMode === 'user' && (
          <>
            <button
              className={`nav-tab-item ${activeTab === 'logger' ? 'active' : ''}`}
              onClick={() => setActiveTab('logger')}
            >
              Log Activity
            </button>
            <button
              className={`nav-tab-item ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              My Stats
            </button>
            <button
              className={`nav-tab-item ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              Goals
            </button>
            <button
              className={`nav-tab-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              Leaderboard
            </button>
            <button
              className={`nav-tab-item ${activeTab === 'corporate' ? 'active' : ''}`}
              onClick={() => setActiveTab('corporate')}
            >
              CSR Org
            </button>
          </>
        )}
      </nav>

      <div className="nav-user-pill">
        {viewMode === 'user' && (
          <button className="btn-primary" onClick={onOpenLogger} style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
            <PlusCircle size={15} /> Log Entry
          </button>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '12px', background: user.role === 'ADMIN' ? '#f3e8ff' : '#dcfce7', color: user.role === 'ADMIN' ? '#6b21a8' : '#15803d' }}>
              {user.role}
            </span>
            <div className="avatar-circle" title={user.email}>
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <button className="btn-outline" onClick={logout} title="Sign Out" style={{ padding: '0.4rem 0.7rem' }}>
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onOpenAuth}>
            <LogIn size={15} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
