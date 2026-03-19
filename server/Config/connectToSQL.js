const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DATABASE_SERVER ,
  user: process.env.SQL_USER ,
  password: process.env.SQL_PASSWORD ,
  database: process.env.DATABASE ,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database Connected");
    conn.release();
  } catch (err) {
    console.error("Database Connection Failed:", err);
  }
})();

module.exports = pool;
