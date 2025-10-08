/**
 * Custom error type for 401 Unauthorized HTTP responses
 * Signals to callers that reauthentication is needed
 */
export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized - authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
