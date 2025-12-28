//4a - .env
//4b  db.ts
//Best practices:
//  Works locally & in AWS RDS (with MySQL)
//  Credentials read from environment variables (.env file). 
//  use connection pool for  efficient queries
 

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10
});
