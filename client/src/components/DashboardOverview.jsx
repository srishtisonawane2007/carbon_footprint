import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardOverview({ data, onOpenLogger }) {
  const { metrics, categoryChartData, goalProgressList, recentLogs } = data;

  const categoryColors = {
    Transport: '#ef4444', // Orange/red bar as in PDF screenshot
    Food: '#f97316',
    Energy: '#fbbf24',
    Shopping: '#3b82f6',
    Travel: '#06b6d4',
    Other: '#94a3b8'
  };

  return (
    <div className="dashboard-overview">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Carbon Footprint Tracker — Personal Sustainability Dashboard</p>
        </div>
      </div>

      {/* 1. Metrics Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-green"></span>
            <span>Active Users</span>
          </div>
          <div className="metric-value">{metrics.activeUsers}</div>
          <div className="metric-sub">{metrics.activeUsersSub}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-amber"></span>
            <span>Avg Daily CO₂</span>
          </div>
          <div className="metric-value">{metrics.avgDailyCo2}</div>
          <div className="metric-sub">{metrics.avgDailySub}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-purple"></span>
            <span>Goals Achieved</span>
          </div>
          <div className="metric-value">{metrics.goalsAchieved}</div>
          <div className="metric-sub">{metrics.goalsAchievedSub}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-blue"></span>
            <span>CO₂ Saved</span>
          </div>
          <div className="metric-value">{metrics.co2Saved}</div>
          <div className="metric-sub">{metrics.co2SavedSub}</div>
        </div>
      </div>

      {/* 2. Middle Row: Category Chart & Goal Progress */}
      <div className="dashboard-grid">
        {/* Category Emissions Bar Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Avg Emissions by Category (kg CO₂/day)</h2>
              <span className="panel-sub">Community-wide average carbon contribution per activity type</span>
            </div>
          </div>

          <div style={{ width: '100%', height: 230, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val} kg CO₂/day`, 'Emissions']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="co2" radius={[6, 6, 0, 0]} barSize={38}>
                  {categoryChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={categoryColors[entry.name] || '#7c3aed'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Progress Sidebar Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Goal Progress</h2>
            </div>
            <span className="month-badge" style={{ background: '#dcfce7', color: '#15803d' }}>142 achieved</span>
          </div>

          <div className="goal-progress-list">
            {goalProgressList.map((item) => (
              <div key={item.id} className="goal-item-card">
                <div className="goal-item-info">
                  <span className="goal-user-name">{item.user}</span>
                  <span className="goal-text-sub">{item.text}</span>
                </div>
                <span className={`badge-status ${item.statusClass}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Table: Recent Activity Logs */}
      <div className="table-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Recent Activity Logs</h2>
            <span className="panel-sub">Latest carbon footprint entries by platform users</span>
          </div>
          <button className="btn-primary" onClick={onOpenLogger}>+ Log New Activity</button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>User</th>
              <th>Activity</th>
              <th>Category</th>
              <th>CO₂ (kg)</th>
              <th>Date</th>
              <th>vs Goal</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log) => (
              <tr key={log.id}>
                <td className="log-id-tag">{log.id}</td>
                <td style={{ fontWeight: 700 }}>{log.user}</td>
                <td>{log.activity_type}</td>
                <td>
                  <span className="category-tag">{log.category}</span>
                </td>
                <td style={{ fontWeight: 700 }}>{parseFloat(log.co2_kg).toFixed(2)}</td>
                <td style={{ color: '#64748b' }}>{log.date}</td>
                <td>
                  {log.vs_goal === 'Under' ? (
                    <span className="vs-goal-under">Under ✓</span>
                  ) : (
                    <span className="vs-goal-over">Over ✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
