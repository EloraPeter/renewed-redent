import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optional: max: 20, idleTimeoutMillis: 30000, etc.
});

export default pool;