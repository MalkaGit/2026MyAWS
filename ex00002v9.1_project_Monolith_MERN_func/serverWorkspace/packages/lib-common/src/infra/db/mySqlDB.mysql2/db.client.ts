//3 
// File module exporting functions
// Goal: 
//    create connection pool to MySQL using mysql2 library
// configuration:
//    read configuration from .env file
// dependenies:
// install packages:
//      cd inserverWorkspace/packages/lib-common
//      npm install mysql2
// Requiremetns: 


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
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
});
