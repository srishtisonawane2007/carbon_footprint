# CarbonTrack - Web Platform for Carbon Footprint Monitoring & Sustainability Analytics

A complete full-stack web application for tracking personal and corporate carbon footprints, visualizing CO₂ analytics, setting sustainability reduction goals, earning milestone badges, and generating CSR reports.

![CarbonTrack Dashboard Preview](https://img.shields.io/badge/Platform-CarbonTrack-059669?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)

---

## 🌟 Key Features

1. **User Profiles & Authentication**:
   - Secure JWT Authentication & User Profiles.
   - Preference settings & organization affiliation.

2. **Activity Logging & Emission Engine**:
   - **Transport**: Car commute (km), Flights (hours), Public Transit (km).
   - **Electricity**: kWh consumed, Energy Source (Grid, Solar, Wind, Coal).
   - **Food**: Meal types (Vegan, Vegetarian, Meat, Beef/Dairy servings).
   - **Shopping**: Product categories & spend amounts.
   - Rule-based emission factors derived from IPCC & EPA datasets.

3. **Sustainability Dashboard & Visualizations**:
   - Today's footprint summary & Active Users metrics.
   - Category-wise footprint breakdown bar & pie charts (Recharts).
   - Weekly trend line chart (Current vs. Last week).
   - Goal progress & recent activity logs table with `Under ✓` / `Over ✗` badges.

4. **Analytics, Goals & Peer Benchmarking**:
   - Personal footprint reduction goals (% target reduction).
   - Daily required reduction projections & timeline forecasting.
   - Peer benchmarking percentile standing against platform averages.

5. **Community Leaderboard & Badges**:
   - Top 50 anonymized low-footprint users leaderboard.
   - Streak badges (7-day streak, 10/25/50 kg CO₂e saved).
   - Habit tips & peer follow feature.

6. **Corporate / Organizational CSR Dashboard**:
   - Aggregated department emissions & month-over-month trends.
   - Per-employee comparison table for CSR & ESG reporting.

---

## 📁 Repository Structure

```
carbon_footprint/
├── database/
│   ├── schema.sql            # Complete MySQL database schema
│   └── seed.sql              # Initial seed data for MySQL Workbench
├── server/
│   ├── config/               # Database connection & env setup
│   ├── utils/                # Emission calculation engine (IPCC & EPA standards)
│   ├── routes/               # REST API endpoints
│   ├── server.js             # Express API Server
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/       # Dashboard, Logger, Goals, Leaderboard, CSR components
│   │   ├── context/          # Auth & State management
│   │   ├── services/         # API client handlers
│   │   ├── App.jsx           # Main React layout
│   │   └── index.css         # Glassmorphic CSS design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Quick Setup Instructions

### 1. MySQL Workbench Database Setup
1. Open **MySQL Workbench**.
2. Run `database/schema.sql` to create `carbontrack_db` and tables.
3. Run `database/seed.sql` to populate initial emission factors, users, goals, and logs.

### 2. Backend Server Setup
```bash
cd server
npm install
npm run dev
```
*(Server will run on `http://localhost:5000`)*

### 3. Frontend React App Setup
```bash
cd client
npm install
npm run dev
```
*(Frontend will run on `http://localhost:3000`)*

---

## 📊 Emission Factors (IPCC & EPA Standard Defaults)

| Category | Activity Type | Unit | kg CO₂e / unit |
| :--- | :--- | :--- | :--- |
| **Transport** | Car (Petrol/Diesel) | km | 0.210 |
| **Transport** | Electric Vehicle | km | 0.053 |
| **Transport** | Flight (Domestic/Intl) | hr | 90.000 |
| **Transport** | Metro / Bus | km | 0.070 |
| **Electricity**| Grid Power | kWh | 0.820 |
| **Electricity**| Solar / Wind | kWh | 0.000 |
| **Food** | Heavy Meat Meal | meal | 3.300 |
| **Food** | Vegetarian Meal | meal | 0.850 |
| **Food** | Vegan Meal | meal | 0.400 |
| **Shopping** | Clothing / Goods | $ spend | 0.450 |

---

## 🔗 Deployment & Repository

- **GitHub Repository**: [https://github.com/srishtisonawane2007/carbon_footprint.git](https://github.com/srishtisonawane2007/carbon_footprint.git)
- **License**: MIT
