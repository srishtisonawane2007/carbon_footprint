// =========================================================
// CarbonTrack - Frontend API Service Layer
// =========================================================

const API_BASE = '/api';

export async function fetchDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend server offline, serving standalone local store:', err);
    return {
      metrics: {
        activeUsers: '4,280',
        activeUsersSub: '16% this month',
        avgDailyCo2: '8.4 kg',
        avgDailySub: 'Target: 6 kg/day',
        goalsAchieved: '142',
        goalsAchievedSub: 'This month',
        co2Saved: '2.4 T',
        co2SavedSub: 'By goal achievers'
      },
      categoryEmissions: { Transport: 2.2, Food: 1.8, Energy: 0.8, Shopping: 0.4, Travel: 0.1, Other: 0.1 },
      categoryChartData: [
        { name: 'Transport', co2: 2.2, fill: '#3b82f6' },
        { name: 'Food', co2: 1.8, fill: '#f59e0b' },
        { name: 'Energy', co2: 0.8, fill: '#8b5cf6' },
        { name: 'Shopping', co2: 0.4, fill: '#ec4899' },
        { name: 'Travel', co2: 0.1, fill: '#06b6d4' },
        { name: 'Other', co2: 0.1, fill: '#94a3b8' }
      ],
      goalProgressList: [
        { id: 1, user: 'R. Kumar', text: 'Goal: <5kg/day • Today: 5.80g', status: 'On Track', statusClass: 'badge-on-track' },
        { id: 2, user: 'A. Singh', text: 'Goal: No Car Mon • Missed today', status: 'Missed', statusClass: 'badge-missed' },
        { id: 3, user: 'P. Joshi', text: 'Goal: Vegan Week • Day 5/7', status: 'In-Progress', statusClass: 'badge-in-progress' },
        { id: 4, user: 'M. Nair', text: 'Goal: <6kg/day • Today: 9.25g', status: 'Exceeded', statusClass: 'badge-exceeded' }
      ],
      recentLogs: [
        { id: 'ACT-0841', user: 'R. Kumar', category: 'Transport', activity_type: 'Metro commute (12 km)', quantity: 12, unit: 'km', co2_kg: 0.84, date: 'Apr 19', vs_goal: 'Under' },
        { id: 'ACT-0840', user: 'A. Singh', category: 'Transport', activity_type: 'Car drive (40 km)', quantity: 40, unit: 'km', co2_kg: 6.40, date: 'Apr 19', vs_goal: 'Over' },
        { id: 'ACT-0839', user: 'P. Joshi', category: 'Food', activity_type: 'Vegan meal (lunch)', quantity: 1, unit: 'meal', co2_kg: 0.40, date: 'Apr 19', vs_goal: 'Under' },
        { id: 'ACT-0838', user: 'M. Nair', category: 'Travel', activity_type: 'Flight (Mumbai-Delhi)', quantity: 1, unit: 'flight', co2_kg: 180.00, date: 'Apr 19', vs_goal: 'Over' },
        { id: 'ACT-0837', user: 'S. Rao', category: 'Electricity', activity_type: 'Solar home (electricity)', quantity: 25, unit: 'kWh', co2_kg: 0.00, date: 'Apr 19', vs_goal: 'Under' }
      ]
    };
  }
}

export async function logNewActivity(activityData) {
  try {
    const res = await fetch(`${API_BASE}/activities/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Logging activity locally:', activityData);
    return {
      message: 'Logged locally',
      log: {
        id: `ACT-0${Math.floor(8000 + Math.random() * 999)}`,
        user: 'R. Kumar',
        category: activityData.category,
        activity_type: `${activityData.activity_type} (${activityData.quantity})`,
        co2_kg: parseFloat((activityData.quantity * 0.21).toFixed(2)),
        date: 'Today',
        vs_goal: 'Under'
      }
    };
  }
}

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return await res.json();
  } catch (err) {
    return {
      leaderboard: [
        { rank: 1, username: 'EcoPioneer_88', co2_avg: 1.80, streak_days: 28, badges: ['7-Day Streak', 'Plant-Based Hero'], primary_strength: '100% EV & Cycling' },
        { rank: 2, username: 'GreenWarrior_42', co2_avg: 2.10, streak_days: 21, badges: ['Solar Pioneer'], primary_strength: 'Rooftop Solar' },
        { rank: 3, username: 'ZeroWaste_Sam', co2_avg: 2.35, streak_days: 19, badges: ['Zero Waste Champ'], primary_strength: 'Vegan Diet' },
        { rank: 4, username: 'R. Kumar', co2_avg: 3.10, streak_days: 14, badges: ['7-Day Streak'], primary_strength: 'Metro Transit' },
        { rank: 5, username: 'P. Joshi', co2_avg: 3.45, streak_days: 12, badges: ['Plant-Based Hero'], primary_strength: 'Local Food Sourcing' }
      ]
    };
  }
}

export async function fetchOrgStats() {
  try {
    const res = await fetch(`${API_BASE}/organization/stats`);
    return await res.json();
  } catch (err) {
    return {
      orgName: 'EcoCorp Technologies',
      totalEmployees: 428,
      avgFootprintPerEmployee: 6.85,
      teamEmissions: [
        { category: 'Transport', emissions: 1450, percentage: 38 },
        { category: 'Electricity', emissions: 1120, percentage: 29 },
        { category: 'Food', emissions: 750, percentage: 20 },
        { category: 'Travel', emissions: 380, percentage: 10 },
        { category: 'Shopping', emissions: 120, percentage: 3 }
      ],
      monthlyTrend: [
        { month: 'Jan', co2_tons: 42.5 },
        { month: 'Feb', co2_tons: 39.8 },
        { month: 'Mar', co2_tons: 36.2 },
        { month: 'Apr', co2_tons: 32.4 }
      ],
      employeeRoster: [
        { id: 'EMP-101', name: 'R. Kumar', dept: 'Engineering', avg_co2: 3.10, status: 'Under Target' },
        { id: 'EMP-102', name: 'A. Singh', dept: 'Marketing', avg_co2: 6.40, status: 'Over Target' },
        { id: 'EMP-103', name: 'P. Joshi', dept: 'Design', avg_co2: 3.45, status: 'Under Target' },
        { id: 'EMP-104', name: 'M. Nair', dept: 'Sales', avg_co2: 12.80, status: 'High Travel' }
      ]
    };
  }
}
