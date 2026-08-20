import React, { useState } from 'react';
import { Target, CheckCircle2, Award } from 'lucide-react';

export default function GoalTracker({ goals = [] }) {
  const [goalName, setGoalName] = useState('');
  const [targetPct, setTargetPct] = useState(20);
  const [activeGoals, setActiveGoals] = useState(goals);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName) return;
    const newG = {
      id: Date.now(),
      user: 'R. Kumar',
      text: `${goalName} • Target -${targetPct}%`,
      status: 'In-Progress',
      statusClass: 'badge-in-progress'
    };
    setActiveGoals([newG, ...activeGoals]);
    setGoalName('');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Goal Management & Milestone Tracking</h1>
        <p>Set custom carbon reduction targets and track your milestone achievements</p>
      </div>

      <div className="dashboard-grid">
        {/* Active Goals List */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Active Sustainability Goals</h2>
            </div>
            <span className="month-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{activeGoals.length} Active</span>
          </div>

          <div className="goal-progress-list">
            {activeGoals.map((g) => (
              <div key={g.id} className="goal-item-card" style={{ padding: '1rem 1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Target size={22} color="#7c3aed" />
                  <div>
                    <div className="goal-user-name">{g.text}</div>
                    <div className="goal-text-sub">Assigned to: {g.user}</div>
                  </div>
                </div>
                <span className={`badge-status ${g.statusClass}`}>{g.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Set New Goal Form */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">+ Set New Goal</h2>
          </div>
          <form onSubmit={handleAddGoal}>
            <div className="form-group">
              <label className="form-label">Goal Title / Milestone</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Switch 50% commute to Metro"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target CO₂ Reduction (%): {targetPct}%</label>
              <input
                type="range"
                min="5"
                max="50"
                value={targetPct}
                onChange={(e) => setTargetPct(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Save Sustainability Goal
            </button>
          </form>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="panel-card" style={{ marginTop: '1.5rem' }}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award color="#f59e0b" size={22} /> Earned Milestone Badges
            </h2>
            <span className="panel-sub">Spring event-driven achievement rewards</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginTop: '1rem' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <CheckCircle2 color="#d97706" size={28} />
            <div>
              <div style={{ fontWeight: 800, color: '#92400e' }}>7-Day Eco Streak</div>
              <div style={{ fontSize: '0.78rem', color: '#b45309' }}>Logged low emissions 7 days in a row</div>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <CheckCircle2 color="#16a34a" size={28} />
            <div>
              <div style={{ fontWeight: 800, color: '#166534' }}>Plant-Based Hero</div>
              <div style={{ fontSize: '0.78rem', color: '#15803d' }}>Logged 10 vegan/vegetarian meals</div>
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <CheckCircle2 color="#2563eb" size={28} />
            <div>
              <div style={{ fontWeight: 800, color: '#1e40af' }}>50 kg CO₂ Saved</div>
              <div style={{ fontSize: '0.78rem', color: '#1d4ed8' }}>Exceeded target milestone threshold</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
