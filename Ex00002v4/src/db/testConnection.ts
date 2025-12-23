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