//4.0 - .env
//4.1  db.ts 

// Load environment variables if not already loaded (defensive: ensures .env is available)
// Note: dotenv.config() is idempotent - safe to call multiple times
import { config } from "dotenv";
config();

import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10
});
