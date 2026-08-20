import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { calculateEmissions, EMISSION_FACTORS } from '../utils/emissionEngine.js';

export default function ActivityLoggerModal({ isOpen, onClose, onAddLog }) {
  const [category, setCategory] = useState('Transport');
  const [activityType, setActivityType] = useState('Car commute (Petrol/Diesel)');
  const [quantity, setQuantity] = useState(25);
  const [user, setUser] = useState('R. Kumar');

  if (!isOpen) return null;

  const availableTypes = EMISSION_FACTORS[category] ? Object.keys(EMISSION_FACTORS[category]) : [];
  const currentUnit = EMISSION_FACTORS[category]?.[activityType]?.unit || 'units';
  const estimatedCo2 = calculateEmissions(category, activityType, parseFloat(quantity) || 0);

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    const firstType = Object.keys(EMISSION_FACTORS[newCat] || {})[0] || '';
    setActivityType(firstType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLog({
      user,
      category,
      activity_type: activityType,
      quantity: parseFloat(quantity)
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="panel-header" style={{ marginBottom: '1.2rem' }}>
          <div>
            <h2 className="panel-title" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} color="#7c3aed" /> Log Activity & Calculate CO₂
            </h2>
            <span className="panel-sub">Powered by IPCC & EPA Emission Calculation Engine</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User Profile</label>
            <select className="form-select" value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="R. Kumar">R. Kumar (Engineering)</option>
              <option value="A. Singh">A. Singh (Marketing)</option>
              <option value="P. Joshi">P. Joshi (Design)</option>
              <option value="M. Nair">M. Nair (Sales)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Emission Category</label>
            <select className="form-select" value={category} onChange={handleCategoryChange}>
              <option value="Transport">Transport (Vehicle / Transit)</option>
              <option value="Electricity">Electricity & Energy</option>
              <option value="Food">Food & Diet</option>
              <option value="Travel">Travel & Flights</option>
              <option value="Shopping">Shopping & Goods</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Type</label>
            <select className="form-select" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
              {availableTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity ({currentUnit})</label>
            <input
              type="number"
              className="form-input"
              value={quantity}
              min="0.1"
              step="any"
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div style={{ background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6b21a8', fontWeight: 700 }}>Calculated CO₂ Output</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7c3aed' }}>
                {estimatedCo2.toFixed(2)} <span style={{ fontSize: '0.9rem' }}>kg CO₂e</span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '12px', background: estimatedCo2 <= 5 ? '#dcfce7' : '#fee2e2', color: estimatedCo2 <= 5 ? '#15803d' : '#b91c1c' }}>
              {estimatedCo2 <= 5 ? 'Under Target' : 'High Footprint'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Log Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}
