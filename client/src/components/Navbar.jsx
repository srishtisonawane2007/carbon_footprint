import React from 'react';
import { Leaf, PlusCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenLogger }) {
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
          className={`nav-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
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
      </nav>

      <div className="nav-user-pill">
        <button className="btn-primary" onClick={onOpenLogger} style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
          <PlusCircle size={15} /> Log Entry
        </button>
        <span className="month-badge">April 2026</span>
        <div className="avatar-circle" title="User Profile">TN</div>
      </div>
    </header>
  );
}
