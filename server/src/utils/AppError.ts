/**
 * Custom error class for application-specific errors.
 * Allows attaching a status code and operational flag to errors.
 */
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  /**
   * Creates an instance of AppError.
   * @param message - The error message.
   * @param statusCode - The HTTP status code associated with the error.
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // Distinguish operational errors (expected, like user input error) from programming errors
    this.isOperational = `${statusCode}`.startsWith('4'); // Assume 4xx errors are operational

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
