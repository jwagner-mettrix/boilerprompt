import path from 'path'; // Import path module
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan'; // For logging HTTP requests
import cookieParser from 'cookie-parser'; // For parsing cookies
import fs from 'fs/promises'; // Import fs promises

import environment from '@/config/environment';
import AppError from '@/utils/AppError';
import globalErrorHandler from '@/middleware/errorHandler';
import apiRouter from '@/routes'; // Main application router

const app: Express = express();

// --- Global Middleware ---

// CORS Configuration
const corsOptions = {
  origin: environment.CORS_ORIGIN || (environment.NODE_ENV === 'production' ? '/' : 'http://localhost:5173'),
  credentials: true,
};
app.use(cors(corsOptions));

// HTTP Request Logger
app.use(morgan(environment.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parsers
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie Parser
app.use(cookieParser());

// --- Production Static Serving & SPA Fallback ---
if (environment.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../client');
  const indexPath = path.resolve(clientBuildPath, 'index.html');
  console.log(`Production mode: Serving static files from ${clientBuildPath}`);
  console.log(`SPA fallback using index.html at: ${indexPath}`);

  app.use(express.static(clientBuildPath));

  // SPA Fallback using Regex: Match GET requests that don't start with /api/ and don't look like files
  app.get(/^((?!\/api\/|\.).)*$/, async (req, res, next) => { // Use Regex pattern
    console.log('SPA Fallback (Regex) hit for:', req.originalUrl); // Log which route is hit
    try {
      const htmlContent = await fs.readFile(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      console.error(`Error reading index.html for SPA fallback: ${indexPath}`, error);
      next(new AppError('Could not load application entry point.', 500));
    }
  });
}

// --- API Routes ---
// Mounted after static serving in production
app.use('/api', apiRouter);

// --- Handle Not Found (API or Static) ---
// Middleware to catch any request reaching this point (after static, SPA, API)
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Resource not found at ${req.originalUrl}`, 404);
  next(error); // Pass the error to the global error handler
});

// --- Global Error Handling Middleware ---
app.use(globalErrorHandler);

export default app;
