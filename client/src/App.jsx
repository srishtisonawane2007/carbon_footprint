import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ActivityLoggerModal from './components/ActivityLoggerModal';
import MyStats from './components/MyStats';
import GoalTracker from './components/GoalTracker';
import Leaderboard from './components/Leaderboard';
import CorporateDashboard from './components/CorporateDashboard';
import EcoTips from './components/EcoTips';
import { fetchDashboardSummary, logNewActivity, fetchLeaderboard, fetchOrgStats } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [orgStats, setOrgStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [summary, lb, org] = await Promise.all([
          fetchDashboardSummary(),
          fetchLeaderboard(),
          fetchOrgStats()
        ]);
        setDashboardData(summary);
        setLeaderboard(lb.leaderboard || []);
        setOrgStats(org);
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddLog = async (newLogData) => {
    const res = await logNewActivity(newLogData);
    if (res && res.log && dashboardData) {
      setDashboardData({
        ...dashboardData,
        recentLogs: [res.log, ...dashboardData.recentLogs]
      });
    }
  };

  if (loading || !dashboardData) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#f6f7fb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.5rem' }}>🌱 CarbonTrack</div>
          <div style={{ color: '#64748b' }}>Loading Sustainability Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLogger={() => setIsLoggerOpen(true)}
        />

        <div className="main-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="content-area">
            {activeTab === 'dashboard' && (
              <DashboardOverview
                data={dashboardData}
                onOpenLogger={() => setIsLoggerOpen(true)}
              />
            )}

            {activeTab === 'logger' && (
              <DashboardOverview
                data={dashboardData}
                onOpenLogger={() => setIsLoggerOpen(true)}
              />
            )}

            {activeTab === 'stats' && <MyStats />}

            {activeTab === 'goals' && (
              <GoalTracker goals={dashboardData.goalProgressList} />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard leaderboard={leaderboard} />
            )}

            {activeTab === 'corporate' && (
              <CorporateDashboard orgStats={orgStats} />
            )}

            {activeTab === 'tips' && <EcoTips />}

            {activeTab === 'settings' && (
              <div className="panel-card">
                <h2 className="panel-title">Sustainability Preference Settings</h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  Manage emission calculation factors, units (kg vs lbs CO₂e), and organization memberships.
                </p>
                <div className="form-group">
                  <label className="form-label">Default Target Daily CO₂ Limit (kg)</label>
                  <input type="number" className="form-input" defaultValue={6.0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Corporate Organization</label>
                  <input type="text" className="form-input" defaultValue="EcoCorp Technologies" readOnly />
                </div>
                <button className="btn-primary" onClick={() => alert('Settings Saved!')}>Save Preferences</button>
              </div>
            )}
          </main>
        </div>
      </div>

      <ActivityLoggerModal
        isOpen={isLoggerOpen || activeTab === 'logger'}
        onClose={() => {
          setIsLoggerOpen(false);
          if (activeTab === 'logger') setActiveTab('dashboard');
        }}
        onAddLog={handleAddLog}
      />
    </div>
  );
}
