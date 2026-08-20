import React from 'react';
import { Award, Zap, Heart } from 'lucide-react';

export default function Leaderboard({ leaderboard = [] }) {
  return (
    <div>
      <div className="page-header">
        <h1>Community Leaderboard</h1>
        <p>Top 50 lowest-footprint users anonymized by username with badges & primary habit strengths</p>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={22} color="#f59e0b" /> Sustainability Leaderboard Rankings
            </h2>
            <span className="panel-sub">Ranked by lowest 30-day average daily CO₂ footprint</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {leaderboard.map((u) => (
            <div key={u.rank} className="leader-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`rank-badge rank-${u.rank}`}>#{u.rank}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{u.username}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Strength: <strong style={{ color: '#10b981' }}>{u.primary_strength}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                    {u.co2_avg.toFixed(2)} kg/day
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                    <Zap size={13} color="#f59e0b" /> {u.streak_days}-day streak
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {u.badges.map((b, idx) => (
                    <span key={idx} style={{ background: '#f3e8ff', color: '#7c3aed', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      {b}
                    </span>
                  ))}
                </div>

                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                  <Heart size={13} color="#ef4444" /> Follow Habits
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
