-- =========================================================
-- CarbonTrack - MySQL Database Schema
-- Standardized for MySQL Workbench
-- =========================================================

CREATE DATABASE IF NOT EXISTS carbontrack_db;
USE carbontrack_db;

-- 1. ORGANIZATIONS TABLE (For Corporate CSR Reporting)
CREATE TABLE IF NOT EXISTS organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    domain VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'CSR_MANAGER') DEFAULT 'USER',
    organization_id INT DEFAULT NULL,
    daily_target_co2_kg DECIMAL(8,2) DEFAULT 6.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. EMISSION FACTORS TABLE (Configurable kg CO2e per unit)
CREATE TABLE IF NOT EXISTS emission_factors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('Transport', 'Electricity', 'Food', 'Shopping', 'Travel', 'Other') NOT NULL,
    activity_type VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(30) NOT NULL,
    kg_co2_per_unit DECIMAL(10,4) NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    category ENUM('Transport', 'Electricity', 'Food', 'Shopping', 'Travel', 'Other') NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    co2_kg DECIMAL(10,2) NOT NULL,
    vs_goal_status ENUM('Under', 'Over') DEFAULT 'Under',
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. GOALS TABLE
CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_name VARCHAR(150) NOT NULL,
    target_reduction_pct DECIMAL(5,2) NOT NULL,
    period ENUM('Weekly', 'Monthly', 'Annual') DEFAULT 'Monthly',
    status ENUM('On Track', 'Missed', 'In-Progress', 'Exceeded') DEFAULT 'In-Progress',
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. BADGES & ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_code VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INDEXES FOR FAST ANALYTICS
CREATE INDEX idx_logs_user_date ON activity_logs(user_id, log_date);
CREATE INDEX idx_logs_category ON activity_logs(category);
