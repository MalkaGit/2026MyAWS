//4.0 - .env
//4.1  db.ts 

// Load environment variables if not already loaded (defensive: ensures .env is available)
// Note: dotenv.config() is idempotent - safe to call multiple times
import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

// Validate required environment variables
const requiredEnvVars = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingVars.join(", ")}\n` +
    `Please create a .env file in the project root with these variables.\n` +
    `See .env.example for a template.`
  );
}

const dbPort = Number(process.env.DB_PORT);
if (isNaN(dbPort)) {
  throw new Error(`Invalid DB_PORT: ${process.env.DB_PORT}. Must be a number.`);
}

// Connection pool configuration
// Note: For AWS RDS, SSL may be required. Set DB_SSL_REQUIRED=true in .env if needed
const poolConfig: mysql.PoolOptions = {
  host: requiredEnvVars.DB_HOST,
  user: requiredEnvVars.DB_USER,
  password: requiredEnvVars.DB_PASSWORD,
  database: requiredEnvVars.DB_NAME,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  // Connection timeout settings
  connectTimeout: 10000, // 10 seconds
  // Enable keep-alive to detect dead connections
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// SSL configuration for AWS RDS (if required)
// Set DB_SSL_REQUIRED=true in .env to enable SSL
if (process.env.DB_SSL_REQUIRED === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: false, // For AWS RDS, we trust the certificate
  };
}

export const pool = mysql.createPool(poolConfig);
