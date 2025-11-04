const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DATABASE_SERVER || "127.0.0.1",
  user: process.env.SQL_USER || "root",
  password: process.env.SQL_PASSWORD || "",
  database: process.env.DATABASE || "product_db",
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
