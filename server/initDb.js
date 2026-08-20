// =========================================================
// Dynamic MySQL Database Creation & Migration Script
// =========================================================

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'swara@123';

  console.log(`🔌 Connecting to MySQL server at ${host} as ${user}...`);

  try {
    // 1. Connect to MySQL without specifying database to create carbontrack_db
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server.');

    // 2. Read schema.sql & seed.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const seedPath = path.join(__dirname, '../database/seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('📦 Creating database carbontrack_db & tables...');
    await connection.query(schemaSql);
    console.log('✅ Schema created successfully.');

    console.log('🌱 Seeding initial activity logs, users, goals, and emission factors...');
    await connection.query(seedSql);
    console.log('✅ Database seeded successfully!');

    await connection.end();
    console.log('🎉 MySQL database initialization complete.');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

initializeDatabase();
