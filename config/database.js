// Make sure to install the 'pg' package 
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "./env.js";

import * as schema from "./schema.js";

if(!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const isLocalhost = DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1");

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: isLocalhost
        ? false
        : {
            rejectUnauthorized: false,
        },
});

const db = drizzle({ client: pool, schema });

const ConnectDB = async() => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully");
        client.release();
    } catch (error) {
        console.error("Error connecting to Postgresql:", error);
        process.exit(1);
    }
};

export {
    ConnectDB, 
    db,
    pool
};
