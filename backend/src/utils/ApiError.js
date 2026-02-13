/**
 * Custom API error class
 * Used to throw errors with specific HTTP status codes
 */
export class ApiError extends Error {
  /**
   * @param {number} status - HTTP status code
   * @param {string} message - Error message
   */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
