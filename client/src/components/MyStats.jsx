import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function MyStats() {
  const pieData = [
    { name: 'Transport', value: 42, color: '#ef4444' },
    { name: 'Food', value: 28, color: '#f97316' },
    { name: 'Electricity', value: 18, color: '#fbbf24' },
    { name: 'Shopping', value: 8, color: '#3b82f6' },
    { name: 'Travel', value: 4, color: '#06b6d4' }
  ];

  const weeklyTrendData = [
    { day: 'Mon', currentWeek: 5.2, lastWeek: 7.1 },
    { day: 'Tue', currentWeek: 4.8, lastWeek: 6.8 },
    { day: 'Wed', currentWeek: 3.9, lastWeek: 6.2 },
    { day: 'Thu', currentWeek: 4.1, lastWeek: 5.9 },
    { day: 'Fri', currentWeek: 5.6, lastWeek: 8.0 },
    { day: 'Sat', currentWeek: 2.8, lastWeek: 4.5 },
    { day: 'Sun', currentWeek: 2.2, lastWeek: 3.8 }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>My Footprint Analytics</h1>
        <p>Personal breakdown, weekly trend line chart & peer benchmarking standing</p>
      </div>

      <div className="dashboard-grid">
        {/* Recharts Pie Chart Breakdown */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Category-wise Footprint Breakdown</h2>
              <span className="panel-sub">Percentage of total monthly CO₂ output</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Weekly Trend Comparison</h2>
              <span className="panel-sub">Current Week vs. Last Week (kg CO₂/day)</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="currentWeek" name="This Week" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="lastWeek" name="Last Week" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peer Benchmarking Standing */}
      <div className="panel-card" style={{ marginTop: '1.5rem' }}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Peer Benchmarking Standing</h2>
            <span className="panel-sub">Comparing your daily average against platform benchmarks</span>
          </div>
          <span className="badge-status badge-on-track" style={{ fontSize: '0.85rem' }}>Top 18% Eco Rating</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginTop: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Your Avg Footprint</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>4.1 kg/day</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Platform Average</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>8.4 kg/day</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Global Target (Paris)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6' }}>5.5 kg/day</div>
          </div>
        </div>
      </div>
    </div>
  );
}
