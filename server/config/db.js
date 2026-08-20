// =========================================================
// MySQL Database Pool & In-Memory Fallback Manager
// =========================================================

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'swara@123',
  database: process.env.DB_NAME || 'carbontrack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

try {
  pool = mysql.createPool(dbConfig);
  // Soft check connection
  pool.getConnection()
    .then(conn => {
      console.log('✅ Connected to MySQL Database (carbontrack_db)');
      isConnected = true;
      conn.release();
    })
    .catch(err => {
      console.log('⚠️ MySQL Connection Notice: Running with Standalone Dynamic Store (Fallback Mode).');
      isConnected = false;
    });
} catch (e) {
  console.log('⚠️ MySQL setup deferred. Standalone store active.');
}

export { pool, isConnected };
