import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      // Handle different error status codes
      switch (status) {
        case 400:
          toast.error(data.message || "Bad request. Please check your input.");
          break;
        case 401:
          // Token expired or invalid
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
          break;
        case 403:
          toast.error("You do not have permission to perform this action.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 422:
          toast.error(
            data.message || "Validation failed. Please check your input."
          );
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data.message || "An unexpected error occurred.");
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please check your connection.");
    } else if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network.");
    } else {
      toast.error("Network error. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default api;
