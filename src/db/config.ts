import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config';

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});

// Create a Drizzle instance
export const db = drizzle(pool);

// Export pool for use in transactions or direct queries if needed
export { pool }; 