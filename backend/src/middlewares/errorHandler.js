import { ApiError } from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert to ApiError if it isn't already
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, [], error.stack);
  }

  // Handle PostgreSQL unique violation
  if (err.code === '23505') {
    error = new ApiError(409, 'Short code already exists. Please choose a different code.');
  }

  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    });
  }

  // Send error response
  res.status(error.statusCode).json({
    error: error.message,
    ...(error.errors.length > 0 && { errors: error.errors })
  });
};

export default errorHandler;
