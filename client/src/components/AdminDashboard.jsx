import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Database, Plus, Trash2, Edit, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 428, totalLogs: 8940, totalCo2Processed: '32.4 T', activeEmissionFactors: 12 });
  const [users, setUsers] = useState([
    { id: 1, username: 'System Administrator', email: 'admin@carbontrack.com', role: 'ADMIN', created_at: '2026-01-01' },
    { id: 2, username: 'R. Kumar', email: 'rkumar@ecocorp.com', role: 'USER', created_at: '2026-02-14' },
    { id: 3, username: 'A. Singh', email: 'asingh@ecocorp.com', role: 'USER', created_at: '2026-03-01' },
    { id: 4, username: 'P. Joshi', email: 'pjoshi@ecocorp.com', role: 'USER', created_at: '2026-03-10' },
    { id: 5, username: 'M. Nair', email: 'mnair@ecocorp.com', role: 'USER', created_at: '2026-04-05' }
  ]);

  const [emissionFactors, setEmissionFactors] = useState([
    { id: 1, category: 'Transport', activity_type: 'Car commute (Petrol/Diesel)', unit: 'km', kg_co2_per_unit: 0.2100, description: 'Average passenger vehicle emissions' },
    { id: 2, category: 'Transport', activity_type: 'Metro commute', unit: 'km', kg_co2_per_unit: 0.0700, description: 'Electric metro transit per passenger-km' },
    { id: 3, category: 'Transport', activity_type: 'Car drive (EV)', unit: 'km', kg_co2_per_unit: 0.0530, description: 'Grid electric vehicle emissions' },
    { id: 4, category: 'Travel', activity_type: 'Flight (Domestic/Short)', unit: 'flight', kg_co2_per_unit: 180.0000, description: 'Domestic roundtrip flight' },
    { id: 5, category: 'Electricity', activity_type: 'Grid Electricity', unit: 'kWh', kg_co2_per_unit: 0.8200, description: 'Coal-dominated grid power' },
    { id: 6, category: 'Electricity', activity_type: 'Solar home power', unit: 'kWh', kg_co2_per_unit: 0.0000, description: 'Rooftop solar power' },
    { id: 7, category: 'Food', activity_type: 'Vegan meal', unit: 'meal', kg_co2_per_unit: 0.4000, description: 'Plant-based meal' },
    { id: 8, category: 'Food', activity_type: 'Beef meal', unit: 'meal', kg_co2_per_unit: 4.5000, description: 'High emission ruminant meal' }
  ]);

  const [isAddFactorOpen, setIsAddFactorOpen] = useState(false);
  const [newCat, setNewCat] = useState('Transport');
  const [newActivity, setNewActivity] = useState('');
  const [newUnit, setNewUnit] = useState('km');
  const [newFactor, setNewFactor] = useState(0.25);
  const [newDesc, setNewDesc] = useState('');

  const handleAddFactor = (e) => {
    e.preventDefault();
    if (!newActivity) return;
    const factorObj = {
      id: Date.now(),
      category: newCat,
      activity_type: newActivity,
      unit: newUnit,
      kg_co2_per_unit: parseFloat(newFactor),
      description: newDesc || 'Custom factor'
    };
    setEmissionFactors([factorObj, ...emissionFactors]);
    setIsAddFactorOpen(false);
    setNewActivity('');
  };

  const handleDeleteFactor = (id) => {
    setEmissionFactors(emissionFactors.filter((f) => f.id !== id));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck color="#7c3aed" size={28} /> Admin Control Center
          </h1>
          <p>System-wide CarbonTrack Administration & Emission Factors Configuration</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddFactorOpen(true)}>
          <Plus size={16} /> Add Emission Factor
        </button>
      </div>

      {/* Admin Stats Overview */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-purple"></span>
            <span>Total System Users</span>
          </div>
          <div className="metric-value">{users.length} Users</div>
          <div className="metric-sub">Active platform registrations</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-green"></span>
            <span>Total Logged Activities</span>
          </div>
          <div className="metric-value">8,940</div>
          <div className="metric-sub">Logged across 4 categories</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-amber"></span>
            <span>Active Emission Factors</span>
          </div>
          <div className="metric-value">{emissionFactors.length} Rules</div>
          <div className="metric-sub">IPCC & EPA Standards</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="indicator-dot dot-blue"></span>
            <span>Total CO₂ Processed</span>
          </div>
          <div className="metric-value">32.4 T</div>
          <div className="metric-sub">Lifetime engine metric</div>
        </div>
      </div>

      {/* Emission Factors Management Table */}
      <div className="table-panel" style={{ marginBottom: '1.8rem' }}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="#7c3aed" /> Configurable IPCC & EPA Emission Factors
            </h2>
            <span className="panel-sub">Used by the emission calculation engine to convert user quantities to kg CO₂e</span>
          </div>
          <button className="btn-primary" onClick={() => setIsAddFactorOpen(true)}>+ Add Rule</button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Activity Type</th>
              <th>Unit</th>
              <th>kg CO₂e / unit</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emissionFactors.map((f) => (
              <tr key={f.id}>
                <td className="log-id-tag">EF-{f.id}</td>
                <td><span className="category-tag">{f.category}</span></td>
                <td style={{ fontWeight: 700 }}>{f.activity_type}</td>
                <td><code>{f.unit}</code></td>
                <td style={{ fontWeight: 800, color: '#7c3aed' }}>{parseFloat(f.kg_co2_per_unit).toFixed(4)}</td>
                <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{f.description}</td>
                <td>
                  <button
                    onClick={() => handleDeleteFactor(f.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    title="Delete Emission Factor"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Management Table */}
      <div className="table-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#7c3aed" /> System Registered Users & Roles
            </h2>
            <span className="panel-sub">Manage platform user permissions and roles</span>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="log-id-tag">USR-{u.id}</td>
                <td style={{ fontWeight: 700 }}>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge-status ${u.role === 'ADMIN' ? 'badge-missed' : 'badge-on-track'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ color: '#64748b' }}>{u.created_at}</td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      title="Remove User Account"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to Add New Emission Factor */}
      {isAddFactorOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h2 className="panel-title">+ Add New IPCC/EPA Emission Factor</h2>
            </div>
            <form onSubmit={handleAddFactor}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
                  <option value="Transport">Transport</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Type Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CNG Bus Commute"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit of Measurement</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. km, kWh, meal, $"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">kg CO₂e per Unit Factor</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={newFactor}
                  onChange={(e) => setNewFactor(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Source</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. EPA 2026 GHG Emission Standards"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn-outline" onClick={() => setIsAddFactorOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Emission Factor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
