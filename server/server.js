import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { calculateEmissions, EMISSION_FACTORS } from './utils/emissionEngine.js';
import { pool } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'carbontrack_super_secret_jwt_key_2026';

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
let mockUsers = [
  { id: 1, username: 'System Administrator', email: 'admin@carbontrack.com', role: 'ADMIN', daily_target_co2_kg: 5.0, password_hash: '$2a$10$wE99w/j...' },
  { id: 2, username: 'R. Kumar', email: 'rkumar@ecocorp.com', role: 'USER', daily_target_co2_kg: 6.0, password_hash: '$2a$10$wE99w/j...' },
  { id: 3, username: 'A. Singh', email: 'asingh@ecocorp.com', role: 'USER', daily_target_co2_kg: 6.0, password_hash: '$2a$10$wE99w/j...' },
  { id: 4, username: 'P. Joshi', email: 'pjoshi@ecocorp.com', role: 'USER', daily_target_co2_kg: 6.0, password_hash: '$2a$10$wE99w/j...' },
  { id: 5, username: 'M. Nair', email: 'mnair@ecocorp.com', role: 'USER', daily_target_co2_kg: 6.0, password_hash: '$2a$10$wE99w/j...' }
];

let mockEmissionFactors = [
  { id: 1, category: 'Transport', activity_type: 'Car commute (Petrol/Diesel)', unit: 'km', kg_co2_per_unit: 0.2100, description: 'Average passenger vehicle emissions' },
  { id: 2, category: 'Transport', activity_type: 'Metro commute', unit: 'km', kg_co2_per_unit: 0.0700, description: 'Electric metro transit per passenger-km' },
  { id: 3, category: 'Transport', activity_type: 'Car drive (EV)', unit: 'km', kg_co2_per_unit: 0.0530, description: 'Grid electric vehicle emissions' },
  { id: 4, category: 'Travel', activity_type: 'Flight (Domestic/Short)', unit: 'flight', kg_co2_per_unit: 180.0000, description: 'Domestic roundtrip flight' },
  { id: 5, category: 'Electricity', activity_type: 'Grid Electricity', unit: 'kWh', kg_co2_per_unit: 0.8200, description: 'Coal-dominated grid power' },
  { id: 6, category: 'Electricity', activity_type: 'Solar home power', unit: 'kWh', kg_co2_per_unit: 0.0000, description: 'Rooftop solar power' },
  { id: 7, category: 'Food', activity_type: 'Vegan meal', unit: 'meal', kg_co2_per_unit: 0.4000, description: 'Plant-based meal' },
  { id: 8, category: 'Food', activity_type: 'Beef meal', unit: 'meal', kg_co2_per_unit: 4.5000, description: 'High emission ruminant meal' }
];

let initialLogs = [
  { id: 'ACT-0841', user: 'R. Kumar', category: 'Transport', activity_type: 'Metro commute (12 km)', quantity: 12, unit: 'km', co2_kg: 0.84, date: 'Apr 19', vs_goal: 'Under' },
  { id: 'ACT-0840', user: 'A. Singh', category: 'Transport', activity_type: 'Car drive (40 km)', quantity: 40, unit: 'km', co2_kg: 6.40, date: 'Apr 19', vs_goal: 'Over' },
  { id: 'ACT-0839', user: 'P. Joshi', category: 'Food', activity_type: 'Vegan meal (lunch)', quantity: 1, unit: 'meal', co2_kg: 0.40, date: 'Apr 19', vs_goal: 'Under' },
  { id: 'ACT-0838', user: 'M. Nair', category: 'Travel', activity_type: 'Flight (Mumbai-Delhi)', quantity: 1, unit: 'flight', co2_kg: 180.00, date: 'Apr 19', vs_goal: 'Over' },
  { id: 'ACT-0837', user: 'S. Rao', category: 'Electricity', activity_type: 'Solar home (electricity)', quantity: 25, unit: 'kWh', co2_kg: 0.00, date: 'Apr 19', vs_goal: 'Under' }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: pool ? 'MySQL Connected (carbontrack_db)' : 'Fallback Dynamic Store Active' });
});

// =========================================================
// AUTHENTICATION APIs (Register, Login, Session)
// =========================================================

// POST /api/auth/register - Handles new user account creation
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role = 'USER' } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email, and password.' });
  }

  // Check if user already exists in DB
  const existingDb = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
  if (existingDb && existingDb.length > 0) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let newUser = {
    id: Date.now(),
    username,
    email,
    role: role.toUpperCase(),
    daily_target_co2_kg: 6.0
  };

  // Insert into MySQL users table
  const dbInsert = await executeQuery(
    `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    [username, email, hashedPassword, role.toUpperCase()]
  );

  if (dbInsert && dbInsert.insertId) {
    newUser.id = dbInsert.insertId;
  }
  mockUsers.push({ ...newUser, password_hash: hashedPassword, created_at: new Date().toISOString().split('T')[0] });

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Account created successfully!',
    token,
    user: newUser
  });
});

// POST /api/auth/login - Handles user authentication
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Quick Demo Shortcut for Admin
  if (email === 'admin@carbontrack.com' && password === 'admin123') {
    const adminUser = { id: 1, username: 'System Administrator', email: 'admin@carbontrack.com', role: 'ADMIN' };
    const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ message: 'Admin login successful', token, user: adminUser });
  }

  // Quick Demo Shortcut for User
  if (email === 'rkumar@ecocorp.com' && password === 'user123') {
    const regularUser = { id: 2, username: 'R. Kumar', email: 'rkumar@ecocorp.com', role: 'USER' };
    const token = jwt.sign(regularUser, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ message: 'User login successful', token, user: regularUser });
  }

  // MySQL DB User lookup
  const dbUsers = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
  let user = dbUsers && dbUsers.length > 0 ? dbUsers[0] : mockUsers.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Check password if bcrypt hash exists
  if (user.password_hash && user.password_hash.startsWith('$2a$')) {
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
  }

  const userObj = { id: user.id, username: user.username, email: user.email, role: user.role };
  const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful!',
    token,
    user: userObj
  });
});

// =========================================================
// ADMIN APIs (Managing Users & Emission Rules)
// =========================================================

app.get('/api/admin/stats', async (req, res) => {
  const dbUserCount = await executeQuery('SELECT COUNT(*) as count FROM users');
  const dbLogsCount = await executeQuery('SELECT COUNT(*) as count, SUM(co2_kg) as total_co2 FROM activity_logs');
  const dbFactorsCount = await executeQuery('SELECT COUNT(*) as count FROM emission_factors');

  const totalUsers = dbUserCount ? dbUserCount[0].count : mockUsers.length;
  const totalLogs = dbLogsCount ? dbLogsCount[0].count : initialLogs.length;
  const totalCo2 = dbLogsCount && dbLogsCount[0].total_co2 ? parseFloat(dbLogsCount[0].total_co2).toFixed(2) : '32.4';
  const activeFactors = dbFactorsCount ? dbFactorsCount[0].count : mockEmissionFactors.length;

  res.json({
    stats: {
      totalUsers,
      totalLogs,
      totalCo2Processed: `${totalCo2} kg`,
      activeEmissionFactors: activeFactors,
      systemHealth: '100% Operational'
    }
  });
});

app.get('/api/admin/users', async (req, res) => {
  const dbUsers = await executeQuery('SELECT id, username, email, role, DATE_FORMAT(created_at, "%Y-%m-%d") as created_at FROM users');
  res.json({ users: dbUsers && dbUsers.length > 0 ? dbUsers : mockUsers });
});

app.delete('/api/admin/users/:id', async (req, res) => {
  const userId = req.params.id;
  await executeQuery('DELETE FROM users WHERE id = ?', [userId]);
  mockUsers = mockUsers.filter((u) => u.id != userId);
  res.json({ message: 'User account removed successfully.' });
});

app.get('/api/admin/emission-factors', async (req, res) => {
  const dbFactors = await executeQuery('SELECT * FROM emission_factors ORDER BY category');
  res.json({ factors: dbFactors && dbFactors.length > 0 ? dbFactors : mockEmissionFactors });
});

app.post('/api/admin/emission-factors', async (req, res) => {
  const { category, activity_type, unit, kg_co2_per_unit, description } = req.body;

  if (!category || !activity_type || !kg_co2_per_unit) {
    return res.status(400).json({ error: 'Missing required emission factor fields.' });
  }

  await executeQuery(
    `INSERT INTO emission_factors (category, activity_type, unit, kg_co2_per_unit, description)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE kg_co2_per_unit=VALUES(kg_co2_per_unit), description=VALUES(description)`,
    [category, activity_type, unit || 'unit', parseFloat(kg_co2_per_unit), description || '']
  );

  const newFactor = {
    id: Date.now(),
    category,
    activity_type,
    unit: unit || 'unit',
    kg_co2_per_unit: parseFloat(kg_co2_per_unit),
    description
  };
  mockEmissionFactors.push(newFactor);

  res.status(201).json({ message: 'Emission factor saved successfully.', factor: newFactor });
});

app.delete('/api/admin/emission-factors/:id', async (req, res) => {
  const id = req.params.id;
  await executeQuery('DELETE FROM emission_factors WHERE id = ?', [id]);
  mockEmissionFactors = mockEmissionFactors.filter((f) => f.id != id);
  res.json({ message: 'Emission factor deleted successfully.' });
});

// =========================================================
// GENERAL CLIENT DASHBOARD & LOGGING APIs
// =========================================================

app.get('/api/dashboard/summary', async (req, res) => {
  const dbLogs = await executeQuery(
    `SELECT l.id, u.username as user, l.category, l.activity_type, l.quantity, l.unit, l.co2_kg, l.vs_goal_status as vs_goal, DATE_FORMAT(l.log_date, '%b %d') as date
     FROM activity_logs l
     JOIN users u ON l.user_id = u.id
     ORDER BY l.created_at DESC LIMIT 20`
  );

  res.json({
    metrics: {
      activeUsers: `${mockUsers.length}`,
      activeUsersSub: 'Active registrations',
      avgDailyCo2: '8.4 kg',
      avgDailySub: 'Target: 6 kg/day',
      goalsAchieved: '142',
      goalsAchievedSub: 'This month',
      co2Saved: '2.4 T',
      co2SavedSub: 'By goal achievers'
    },
    categoryChartData: [
      { name: 'Transport', co2: 2.2, fill: '#ef4444' },
      { name: 'Food', co2: 1.8, fill: '#f97316' },
      { name: 'Energy', co2: 0.8, fill: '#fbbf24' },
      { name: 'Shopping', co2: 0.4, fill: '#3b82f6' },
      { name: 'Travel', co2: 0.1, fill: '#06b6d4' },
      { name: 'Other', co2: 0.1, fill: '#94a3b8' }
    ],
    goalProgressList: [
      { id: 1, user: 'R. Kumar', text: 'Goal: <5kg/day • Today: 5.80g', status: 'On Track', statusClass: 'badge-on-track' },
      { id: 2, user: 'A. Singh', text: 'Goal: No Car Mon • Missed today', status: 'Missed', statusClass: 'badge-missed' },
      { id: 3, user: 'P. Joshi', text: 'Goal: Vegan Week • Day 5/7', status: 'In-Progress', statusClass: 'badge-in-progress' },
      { id: 4, user: 'M. Nair', text: 'Goal: <6kg/day • Today: 9.25g', status: 'Exceeded', statusClass: 'badge-exceeded' }
    ],
    recentLogs: dbLogs && dbLogs.length > 0 ? dbLogs : initialLogs
  });
});

app.post('/api/activities/log', async (req, res) => {
  const { category, activity_type, quantity, user = 'Logged In User', userId = 2 } = req.body;
  if (!category || !activity_type || !quantity) {
    return res.status(400).json({ error: 'Missing required activity fields.' });
  }

  const co2_kg = calculateEmissions(category, activity_type, parseFloat(quantity));
  const newId = `ACT-0${Math.floor(8000 + Math.random() * 999)}`;
  const vs_goal = co2_kg <= 4.0 ? 'Under' : 'Over';

  await executeQuery(
    `INSERT INTO activity_logs (id, user_id, category, activity_type, quantity, unit, co2_kg, vs_goal_status, log_date)
     VALUES (?, ?, ?, ?, ?, 'unit', ?, ?, CURDATE())`,
    [newId, userId, category, `${activity_type} (${quantity})`, parseFloat(quantity), co2_kg, vs_goal]
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
  res.status(201).json({ message: 'Activity logged successfully.', log: newLog });
});

app.get('/api/leaderboard', (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, username: 'EcoPioneer_88', co2_avg: 1.80, streak_days: 28, badges: ['7-Day Streak', 'Plant-Based Hero'], primary_strength: '100% EV & Cycling' },
      { rank: 2, username: 'GreenWarrior_42', co2_avg: 2.10, streak_days: 21, badges: ['Solar Pioneer'], primary_strength: 'Rooftop Solar' },
      { rank: 3, username: 'ZeroWaste_Sam', co2_avg: 2.35, streak_days: 19, badges: ['Zero Waste Champ'], primary_strength: 'Vegan Diet' },
      { rank: 4, username: 'R. Kumar', co2_avg: 3.10, streak_days: 14, badges: ['7-Day Streak'], primary_strength: 'Metro Transit' },
      { rank: 5, username: 'P. Joshi', co2_avg: 3.45, streak_days: 12, badges: ['Plant-Based Hero'], primary_strength: 'Local Food Sourcing' }
    ]
  });
});

app.get('/api/organization/stats', (req, res) => {
  res.json({
    orgName: 'EcoCorp Technologies',
    totalEmployees: mockUsers.length + 420,
    avgFootprintPerEmployee: 6.85,
    teamEmissions: [
      { category: 'Transport', emissions: 1450, percentage: 38 },
      { category: 'Electricity', emissions: 1120, percentage: 29 },
      { category: 'Food', emissions: 750, percentage: 20 },
      { category: 'Travel', emissions: 380, percentage: 10 },
      { category: 'Shopping', emissions: 120, percentage: 3 }
    ],
    employeeRoster: mockUsers.map((u, i) => ({
      id: `EMP-10${u.id}`,
      name: u.username,
      dept: i % 2 === 0 ? 'Engineering' : 'Marketing',
      avg_co2: (3.1 + i * 0.8).toFixed(2),
      status: i % 2 === 0 ? 'Under Target' : 'Over Target'
    }))
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CarbonTrack Auth & Admin API Server listening at http://localhost:${PORT}`);
});
