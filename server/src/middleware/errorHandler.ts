import { Request, Response, NextFunction } from 'express';
import AppError from '@/utils/AppError';
import environment from '@/config/environment';

// Development error handler: Sends detailed error information
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Production error handler: Sends generic message for non-operational errors
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥:', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// Global error handling middleware
const globalErrorHandler = (
  err: Error | AppError, // Can be a generic Error or our custom AppError
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction // Required by Express, even if not used
) => {
  // Ensure err is always an AppError, defaulting statusCode and status
  let error = err;
  if (!(error instanceof AppError)) {
    // Convert generic Error or other types to AppError
    const statusCode = (error as any).statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new AppError(message, statusCode);
    // Keep original stack if possible, otherwise AppError captures a new one
    (error as AppError).stack = err.stack;
    // Mark as non-operational unless explicitly set otherwise later
    (error as AppError).isOperational = false;
  }

  (error as AppError).statusCode = (error as AppError).statusCode || 500;

  if (environment.NODE_ENV === 'development') {
    sendErrorDev(error as AppError, res);
  } else if (environment.NODE_ENV === 'production') {
    // Add specific error handling here if needed (e.g., database errors)
    // Example: if (err.name === 'CastError') error = handleCastErrorDB(err);
    sendErrorProd(error as AppError, res);
  }
};

export default globalErrorHandler;
