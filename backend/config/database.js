const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 20,
  connectTimeout: 15000,
  ssl: process.env.DB_SSL !== 'false' ? {
    rejectUnauthorized: false
  } : false,
});

module.exports = {
  pool
};
