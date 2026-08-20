import React from 'react';
import { Building2, Download, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CorporateDashboard({ orgStats }) {
  if (!orgStats) return null;

  const { orgName, totalEmployees, avgFootprintPerEmployee, teamEmissions, employeeRoster } = orgStats;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 color="#7c3aed" /> {orgName} — Corporate Sustainability Dashboard
          </h1>
          <p>Aggregated organization-wide footprint analytics for CSR & ESG reporting</p>
        </div>
        <button className="btn-primary" onClick={() => alert('CSR Report PDF Generated & Downloaded!')}>
          <Download size={16} /> Export CSR Report (PDF)
        </button>
      </div>

      {/* Top CSR Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-purple"></span>
            <span>Total Enrolled Employees</span>
          </div>
          <div className="metric-value">{totalEmployees}</div>
          <div className="metric-sub">Active corporate accounts</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-amber"></span>
            <span>Avg Footprint / Employee</span>
          </div>
          <div className="metric-value">{avgFootprintPerEmployee} kg/day</div>
          <div className="metric-sub">Target threshold: 7.0 kg/day</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-green"></span>
            <span>Month-over-Month Reduction</span>
          </div>
          <div className="metric-value">-10.4%</div>
          <div className="metric-sub">Compared to March 2026</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-blue"></span>
            <span>ESG Compliance Rating</span>
          </div>
          <div className="metric-value">Grade A</div>
          <div className="metric-sub">GRI & IPCC Compliant</div>
        </div>
      </div>

      {/* Corporate Team Emissions Breakdown */}
      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Team Emissions by Category (CO₂ kg)</h2>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamEmissions}>
                <XAxis dataKey="category" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="emissions" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Category Distribution (%)</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
            {teamEmissions.map((item) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <span>{item.category}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', background: '#7c3aed' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Employee CSR Comparison Table */}
      <div className="table-panel" style={{ marginTop: '1.5rem' }}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Employee Sustainability Roster</h2>
            <span className="panel-sub">Individual footprint monitoring for ESG reporting</span>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Avg CO₂ (kg/day)</th>
              <th>CSR Status</th>
            </tr>
          </thead>
          <tbody>
            {employeeRoster.map((emp) => (
              <tr key={emp.id}>
                <td className="log-id-tag">{emp.id}</td>
                <td style={{ fontWeight: 700 }}>{emp.name}</td>
                <td>{emp.dept}</td>
                <td style={{ fontWeight: 700 }}>{emp.avg_co2.toFixed(2)}</td>
                <td>
                  <span className={`badge-status ${emp.status === 'Under Target' ? 'badge-on-track' : 'badge-missed'}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
