// app/api/sql/db.js
import { Pool } from 'pg';

let pool;

// Initialize the pool on the server side only
if (typeof window === 'undefined') {
  pool = new Pool({
    user: 'neondb_owner',
    password: 'npg_MeNquUJG41LH',
    host: 'ep-rapid-thunder-a5ca2i7g-pooler.us-east-2.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    ssl: { rejectUnauthorized: false },
  });
}

export default pool;