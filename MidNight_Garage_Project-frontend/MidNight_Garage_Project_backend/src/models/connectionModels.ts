import mysql from 'mysql2/promise'
import { config } from 'dotenv'
config()

export const connectionModel = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '8642B.f.t13062005',
  database: process.env.DB_NAME || 'garage',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});
