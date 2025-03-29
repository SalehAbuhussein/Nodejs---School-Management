export class CustomError extends Error {
  statusCode: number;
  originalError?: any;

  constructor(message: string, statusCode: number, originalError?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  };
};