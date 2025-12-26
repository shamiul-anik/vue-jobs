/**
 * HTTP Client with Interceptor Pattern
 *
 * A lightweight fetch wrapper that provides:
 * - Automatic auth token injection
 * - Centralized error handling
 * - Request/Response interceptors
 * - Consistent API interface
 */

class HttpClient {
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  /* Request interceptor - adds auth headers automatically */
  _getHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    // Auto-inject auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /* Response interceptor - handles common errors */
  async _handleResponse(response) {
    // Handle successful responses
    if (response.ok) {
      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return response;
    }

    // Handle error responses
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: response.statusText };
    }

    // Handle specific status codes
    switch (response.status) {
      case 401:
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        throw new Error("Session expired. Please login again.");

      case 403:
        throw new Error("You do not have permission to perform this action.");

      case 404:
        throw new Error("Resource not found.");

      case 422:
        // Validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const error = new Error(
            errorData.errors.map((e) => e.msg).join(", ")
          );
          error.data = errorData;
          throw error;
        }
        throw new Error(errorData.error || "Validation failed.");

      case 500:
        throw new Error("Server error. Please try again later.");

      default:
        const error = new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
        error.data = errorData;
        throw error;
    }
  }

  /**
   * Core request method
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this._getHeaders(options.headers),
    };

    try {
      const response = await fetch(url, config);
      return this._handleResponse(response);
    } catch (error) {
      // Re-throw for caller to handle
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this._request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this._request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this._request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this._request(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Create and export a singleton instance
const httpClient = new HttpClient();

export default httpClient;