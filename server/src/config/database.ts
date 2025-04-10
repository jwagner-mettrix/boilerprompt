import { Pool } from 'pg';
import environment from './environment';

let pool: Pool | null = null;

const connectDB = async () => {
  if (pool) {
    console.log('Database connection already established.');
    return pool;
  }

  if (!environment.DATABASE_URL) {
    console.warn('DATABASE_URL is not defined. Skipping database connection.');
    return null;
  }

  try {
    pool = new Pool({
      connectionString: environment.DATABASE_URL,
      // Optional: Add SSL configuration for production
      // ssl: environment.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });

    // Test the connection
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully.');
    client.release();
    return pool;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    // Optional: Implement retry logic or exit based on requirements
    // process.exit(1);
    pool = null; // Ensure pool is null if connection fails
    return null;
  }
};

const getDBPool = (): Pool | null => {
  if (!pool) {
    console.warn('Attempted to get DB pool before connection was established or it failed.');
  }
  return pool;
};

export { connectDB, getDBPool };
