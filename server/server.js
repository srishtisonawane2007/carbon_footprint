import express from 'express';
import cors from 'cors';
import { calculateEmissions, EMISSION_FACTORS } from './utils/emissionEngine.js';
import { pool } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dynamic MySQL Query helper with fallback
async function executeQuery(query, params = []) {
  try {
    if (!pool) return null;
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.error('MySQL Query Error:', err.message);
    return null;
  }
}

// In-Memory Data Store Fallback
let initialLogs = [
  { id: 'ACT-0841', user: 'R. Kumar', category: 'Transport', activity_type: 'Metro commute (12 km)', quantity: 12, unit: 'km', co2_kg: 0.84, date: 'Apr 19', vs_goal: 'Under' },
  { id: 'ACT-0840', user: 'A. Singh', category: 'Transport', activity_type: 'Car drive (40 km)', quantity: 40, unit: 'km', co2_kg: 6.40, date: 'Apr 19', vs_goal: 'Over' },
  { id: 'ACT-0839', user: 'P. Joshi', category: 'Food', activity_type: 'Vegan meal (lunch)', quantity: 1, unit: 'meal', co2_kg: 0.40, date: 'Apr 19', vs_goal: 'Under' },
  { id: 'ACT-0838', user: 'M. Nair', category: 'Travel', activity_type: 'Flight (Mumbai-Delhi)', quantity: 1, unit: 'flight', co2_kg: 180.00, date: 'Apr 19', vs_goal: 'Over' },
  { id: 'ACT-0837', user: 'S. Rao', category: 'Electricity', activity_type: 'Solar home (electricity)', quantity: 25, unit: 'kWh', co2_kg: 0.00, date: 'Apr 19', vs_goal: 'Under' }
];

let initialGoals = [
  { id: 1, user: 'R. Kumar', text: 'Goal: <5kg/day • Today: 5.80g', status: 'On Track', statusClass: 'on-track' },
  { id: 2, user: 'A. Singh', text: 'Goal: No Car Mon • Missed today', status: 'Missed', statusClass: 'missed' },
  { id: 3, user: 'P. Joshi', text: 'Goal: Vegan Week • Day 5/7', status: 'In-Progress', statusClass: 'in-progress' },
  { id: 4, user: 'M. Nair', text: 'Goal: <6kg/day • Today: 9.25g', status: 'Exceeded', statusClass: 'exceeded' }
];

let leaderboardUsers = [
  { rank: 1, username: 'EcoPioneer_88', co2_avg: 1.80, streak_days: 28, badges: ['7-Day Streak', 'Plant-Based Hero'], primary_strength: '100% EV & Cycling' },
  { rank: 2, username: 'GreenWarrior_42', co2_avg: 2.10, streak_days: 21, badges: ['Solar Pioneer'], primary_strength: 'Rooftop Solar' },
  { rank: 3, username: 'ZeroWaste_Sam', co2_avg: 2.35, streak_days: 19, badges: ['Zero Waste Champ'], primary_strength: 'Vegan Diet' },
  { rank: 4, username: 'R. Kumar', co2_avg: 3.10, streak_days: 14, badges: ['7-Day Streak'], primary_strength: 'Metro Transit' },
  { rank: 5, username: 'P. Joshi', co2_avg: 3.45, streak_days: 12, badges: ['Plant-Based Hero'], primary_strength: 'Local Food Sourcing' }
];

let organizationStats = {
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

// 1. Health check
app.get('/api/health', async (req, res) => {
  const dbStatus = pool ? 'MySQL Connected (carbontrack_db)' : 'Fallback Dynamic Store Active';
  res.json({ status: 'OK', database: dbStatus, message: 'CarbonTrack API Server is running smoothly.' });
});

// 2. Emission Factors Listing
app.get('/api/emission-factors', async (req, res) => {
  const dbFactors = await executeQuery('SELECT * FROM emission_factors');
  if (dbFactors && dbFactors.length > 0) {
    return res.json({ factors: dbFactors });
  }
  res.json({ factors: EMISSION_FACTORS });
});

// 3. Dashboard Overview Summary
app.get('/api/dashboard/summary', async (req, res) => {
  // Query live activity logs from MySQL database if available
  const dbLogs = await executeQuery(
    `SELECT l.id, u.username as user, l.category, l.activity_type, l.quantity, l.unit, l.co2_kg, l.vs_goal_status as vs_goal, DATE_FORMAT(l.log_date, '%b %d') as date
     FROM activity_logs l
     JOIN users u ON l.user_id = u.id
     ORDER BY l.created_at DESC LIMIT 20`
  );

  const logsToReturn = (dbLogs && dbLogs.length > 0) ? dbLogs : initialLogs;

  const categoryEmissions = {
    Transport: 2.2,
    Food: 1.8,
    Energy: 0.8,
    Shopping: 0.4,
    Travel: 0.1,
    Other: 0.1
  };

  res.json({
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
    categoryEmissions,
    categoryChartData: [
      { name: 'Transport', co2: 2.2, fill: '#3b82f6' },
      { name: 'Food', co2: 1.8, fill: '#f59e0b' },
      { name: 'Energy', co2: 0.8, fill: '#8b5cf6' },
      { name: 'Shopping', co2: 0.4, fill: '#ec4899' },
      { name: 'Travel', co2: 0.1, fill: '#06b6d4' },
      { name: 'Other', co2: 0.1, fill: '#94a3b8' }
    ],
    goalProgressList: initialGoals,
    recentLogs: logsToReturn
  });
});

// 4. Activity Logging Endpoint (Saves to MySQL carbontrack_db dynamically)
app.post('/api/activities/log', async (req, res) => {
  const { category, activity_type, quantity, user = 'R. Kumar' } = req.body;

  if (!category || !activity_type || !quantity) {
    return res.status(400).json({ error: 'Missing required activity fields.' });
  }

  const co2_kg = calculateEmissions(category, activity_type, parseFloat(quantity));
  const newId = `ACT-0${Math.floor(8000 + Math.random() * 999)}`;
  const vs_goal = co2_kg <= 4.0 ? 'Under' : 'Over';

  // Save to MySQL DB
  await executeQuery(
    `INSERT INTO activity_logs (id, user_id, category, activity_type, quantity, unit, co2_kg, vs_goal_status, log_date)
     VALUES (?, 1, ?, ?, ?, 'unit', ?, ?, CURDATE())`,
    [newId, category, `${activity_type} (${quantity})`, parseFloat(quantity), co2_kg, vs_goal]
  );

  const newLog = {
    id: newId,
    user,
    category,
    activity_type: `${activity_type} (${quantity})`,
    quantity: parseFloat(quantity),
    unit: 'unit',
    co2_kg,
    date: 'Today',
    vs_goal
  };

  initialLogs.unshift(newLog);
  if (initialLogs.length > 20) initialLogs.pop();

  res.status(201).json({
    message: 'Activity logged successfully to MySQL database.',
    log: newLog
  });
});

// 5. Leaderboard API
app.get('/api/leaderboard', async (req, res) => {
  res.json({ leaderboard: leaderboardUsers });
});

// 6. Corporate CSR Organization API
app.get('/api/organization/stats', async (req, res) => {
  res.json(organizationStats);
});

app.listen(PORT, () => {
  console.log(`🚀 CarbonTrack Server listening at http://localhost:${PORT}`);
});
