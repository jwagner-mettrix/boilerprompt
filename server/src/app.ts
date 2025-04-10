import path from 'path'; // Import path module
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan'; // For logging HTTP requests
import cookieParser from 'cookie-parser'; // For parsing cookies

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
  // Calculate path relative to the compiled JS file in dist/ (or out/server after build)
  const clientBuildPath = path.resolve(__dirname, '../client'); 
  console.log(`Production mode: Serving static files from ${clientBuildPath}`);

  // Serve static files from the client build directory
  app.use(express.static(clientBuildPath));

  // SPA Fallback: Send index.html for non-API GET requests
//   app.get('*', (req, res, next) => {
//     if (!req.originalUrl.startsWith('/api')) {
//       res.sendFile(path.resolve(clientBuildPath, 'index.html'));
//     } else {
//       // It's an API request, let it fall through to the API router or 404 handler
//       return next();
//     }
//   });
}

// --- API Routes ---
// Mounted after static serving in production
app.use('/api', apiRouter);

// --- Handle Not Found (API or Static) ---
// Catches anything not handled by static serving (prod), SPA fallback (prod), or API routes
// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   // Distinguish between missing API and missing static file in production
//   if (environment.NODE_ENV === 'production' && !req.originalUrl.startsWith('/api')) {
//      next(new AppError(`Resource not found: ${req.originalUrl}`, 404));
//   } else {
//      next(new AppError(`API route not found: ${req.originalUrl}`, 404));
//   }
// });

// --- Global Error Handling Middleware ---
app.use(globalErrorHandler);

export default app;
