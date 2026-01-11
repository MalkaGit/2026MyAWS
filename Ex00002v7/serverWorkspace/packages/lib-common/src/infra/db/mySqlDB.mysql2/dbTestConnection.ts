//4.2
//Run:  
// c:\Repos\LearningAWS2026\Ex00002v7\serverWorkspace\packages\lib-common> npx ts-node src/infra/db/mySqlDB.mysql2/dbTestConnection.ts


import { pool } from "./db";

async function testConnection() { 
    try { 
        const [rows] = await pool.query("SELECT NOW() as now"); 
        console.log("DB connected:", rows); 
    } catch (err) {
         console.error("DB connection error:", err);
    } finally { 
        await pool.end(); 
    } 
} 

testConnection();  