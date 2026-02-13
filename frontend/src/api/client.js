// Base URL for API requests from environment variable
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

/**
 * Make HTTP request to the API
 * @param {string} path - API endpoint path (e.g., '/auth/login')
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Request body data
 * @param {string} options.token - JWT auth token
 * @returns {Promise<Object>} Response data
 * @throws {Error} If request fails
 */
export const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Add auth token to header if provided
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
};
