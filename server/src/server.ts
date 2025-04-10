import http from 'http';
import app from '@/app';
import environment from '@/config/environment';
import { connectDB } from '@/config/database';

const PORT = environment.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // Add any other cleanup tasks here (e.g., close DB connection)
    // For example:
    // const pool = getDBPool();
    // if (pool) {
    //   pool.end(() => {
    //     console.log('Database pool closed.');
    //     process.exit(0);
    //   });
    // } else {
    //   process.exit(0);
    // }
    process.exit(0); // Exit process
  });

  // Force shutdown if server hasn't closed in time
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Handle Terminate signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // CTRL+C

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  // Optional: Log the error to a file/monitoring service
  process.exit(1); // Exit immediately - unclean state
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error('Reason:', reason.name, reason.message, reason.stack || reason);
  console.error('Promise:', promise);
  // Optional: Log the error
  // In this case, we might allow the server to continue or shut down based on the error
  // For now, we'll shut down gracefully like SIGTERM
  server.close(() => {
    console.log('Server closed due to unhandled rejection.');
    process.exit(1);
  });
});

// Start the server function
const startServer = async () => {
  try {
    // Attempt to connect to the database (optional)
    await connectDB();

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running in ${environment.NODE_ENV} mode on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

// --- Start Server --- 
startServer();
