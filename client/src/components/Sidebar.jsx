import React from 'react';
import { LayoutDashboard, FileText, PieChart, Target, Award, Lightbulb, Building2, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'logger', label: 'Log Activity', icon: FileText },
    { id: 'stats', label: 'My Footprint', icon: PieChart },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'tips', label: 'Eco Tips', icon: Lightbulb },
    { id: 'corporate', label: 'Reports (CSR)', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`sidebar-menu-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
