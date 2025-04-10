import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the root directory (one level up from src)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Environment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string | undefined;
  CORS_ORIGIN: string | undefined;
  SESSION_SECRET: string | undefined;
}

const environment: Environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

// Basic validation
if (!environment.SESSION_SECRET && environment.NODE_ENV === 'production') {
  console.error('FATAL ERROR: SESSION_SECRET is not defined in environment variables.');
  process.exit(1);
}
// Add more critical variable checks as needed

export default environment;
