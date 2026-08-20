import React from 'react';
import { Lightbulb, Zap, Car, Utensils, ShoppingBag } from 'lucide-react';

export default function EcoTips() {
  const tips = [
    {
      category: 'Transport',
      icon: Car,
      color: '#ef4444',
      title: 'Switch 2 Commutes / Week to Metro or EV',
      impact: 'Saves ~1.8 kg CO₂e / day',
      desc: 'Commuting via metro emits 0.07 kg CO₂e/km compared to 0.21 kg CO₂e/km for petrol vehicles.'
    },
    {
      category: 'Electricity',
      icon: Zap,
      color: '#fbbf24',
      title: 'Rooftop Solar Installation',
      impact: 'Saves ~24.6 kg CO₂e / day',
      desc: 'Solar energy generates zero operational carbon emissions compared to 0.82 kg CO₂/kWh grid power.'
    },
    {
      category: 'Food',
      icon: Utensils,
      color: '#f97316',
      title: 'Adopt Plant-Based Meatless Days',
      impact: 'Saves ~4.1 kg CO₂e / meal',
      desc: 'Replacing beef meals (4.5 kg CO₂e) with plant-based vegan meals (0.4 kg CO₂e) dramatically cuts carbon emissions.'
    },
    {
      category: 'Shopping',
      icon: ShoppingBag,
      color: '#3b82f6',
      title: 'Choose Sustainable Packaging & Local Sourcing',
      impact: 'Saves ~1.2 kg CO₂e / item',
      desc: 'Local produce reduces supply chain freight emissions by over 60%.'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Personalized Reduction Recommendations</h1>
        <p>Targeted eco tips tailored to your top highest-emission activity categories</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {tips.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div key={idx} className="panel-card" style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              <div style={{ background: `${t.color}15`, padding: '0.8rem', borderRadius: '12px', color: t.color }}>
                <Icon size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="category-tag" style={{ background: `${t.color}20`, color: t.color }}>{t.category}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                    {t.impact}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>{t.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
