-- =========================================================
-- CarbonTrack - MySQL Database Seed Data
-- =========================================================

USE carbontrack_db;

-- 1. SEED ORGANIZATIONS
INSERT INTO organizations (id, name, domain) VALUES
(1, 'EcoCorp Tech', 'ecocorp.com'),
(2, 'GreenGrid Solutions', 'greengrid.org')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED EMISSION FACTORS (IPCC & EPA Standards)
INSERT INTO emission_factors (category, activity_type, unit, kg_co2_per_unit, description) VALUES
('Transport', 'Car commute (Petrol/Diesel)', 'km', 0.2100, 'Average passenger vehicle emissions'),
('Transport', 'Metro commute', 'km', 0.0700, 'Electric metro transit per passenger-km'),
('Transport', 'Car drive (EV)', 'km', 0.0530, 'Grid electric vehicle emissions'),
('Travel', 'Flight (Domestic/Short)', 'flight', 180.0000, 'Domestic roundtrip flight per passenger'),
('Electricity', 'Grid Electricity', 'kWh', 0.8200, 'Standard coal-dominated grid power'),
('Electricity', 'Solar home power', 'kWh', 0.0000, 'Zero-emissions rooftop solar'),
('Food', 'Vegan meal', 'meal', 0.4000, 'Plant-based diet meal'),
('Food', 'Vegetarian meal', 'meal', 0.8500, 'Dairy inclusive vegetarian meal'),
('Food', 'Meat / Poultry meal', 'meal', 2.3000, 'Poultry or pork based meal'),
('Food', 'Beef meal', 'meal', 4.5000, 'High emission ruminant meat meal'),
('Shopping', 'Clothing / Retail', '$', 0.4500, 'Textile and consumer goods carbon footprint'),
('Shopping', 'Electronics', '$', 0.8000, 'Consumer hardware carbon footprint')
ON DUPLICATE KEY UPDATE kg_co2_per_unit=VALUES(kg_co2_per_unit);

-- 3. SEED USERS
INSERT INTO users (id, username, email, password_hash, role, organization_id, daily_target_co2_kg) VALUES
(1, 'R. Kumar', 'rkumar@ecocorp.com', '$2b$10$wN310...hashedpass', 'USER', 1, 6.00),
(2, 'A. Singh', 'asingh@ecocorp.com', '$2b$10$wN310...hashedpass', 'USER', 1, 6.00),
(3, 'P. Joshi', 'pjoshi@ecocorp.com', '$2b$10$wN310...hashedpass', 'USER', 1, 6.00),
(4, 'M. Nair', 'mnair@ecocorp.com', '$2b$10$wN310...hashedpass', 'USER', 1, 6.00),
(5, 'S. Rao', 'srao@greengrid.org', '$2b$10$wN310...hashedpass', 'CSR_MANAGER', 2, 5.00)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- 4. SEED ACTIVITY LOGS (Matching PDF Screenshot ACT-0841 to ACT-0837)
INSERT INTO activity_logs (id, user_id, category, activity_type, quantity, unit, co2_kg, vs_goal_status, log_date) VALUES
('ACT-0841', 1, 'Transport', 'Metro commute (12 km)', 12.00, 'km', 0.84, 'Under', '2026-04-19'),
('ACT-0840', 2, 'Transport', 'Car drive (40 km)', 40.00, 'km', 6.40, 'Over', '2026-04-19'),
('ACT-0839', 3, 'Food', 'Vegan meal (lunch)', 1.00, 'meal', 0.40, 'Under', '2026-04-19'),
('ACT-0838', 4, 'Travel', 'Flight (Mumbai-Delhi)', 1.00, 'flight', 180.00, 'Over', '2026-04-19'),
('ACT-0837', 5, 'Electricity', 'Solar home (electricity)', 25.00, 'kWh', 0.00, 'Under', '2026-04-19')
ON DUPLICATE KEY UPDATE co2_kg=VALUES(co2_kg);

-- 5. SEED GOALS
INSERT INTO goals (id, user_id, goal_name, target_reduction_pct, period, status, start_date, target_date) VALUES
(1, 1, 'Goal: <5kg/day • Today: 5.80g', 15.00, 'Monthly', 'On Track', '2026-04-01', '2026-04-30'),
(2, 2, 'Goal: No Car Mon • Missed today', 20.00, 'Weekly', 'Missed', '2026-04-15', '2026-04-22'),
(3, 3, 'Goal: Vegan Week • Day 5/7', 25.00, 'Weekly', 'In-Progress', '2026-04-14', '2026-04-21'),
(4, 4, 'Goal: <6kg/day • Today: 9.25g', 10.00, 'Monthly', 'Exceeded', '2026-04-01', '2026-04-30')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 6. SEED BADGES
INSERT INTO badges (user_id, badge_code, badge_name, description) VALUES
(1, 'STREAK_7', '7-Day Eco Streak', 'Logged low emissions for 7 consecutive days'),
(3, 'VEGAN_WARRIOR', 'Plant-Based Hero', 'Logged 10 plant-based meals in a row'),
(5, 'SOLAR_PIONEER', 'Solar Pioneer', '100% solar powered home electricity')
ON DUPLICATE KEY UPDATE badge_name=VALUES(badge_name);
