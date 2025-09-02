import axios from "axios";
import { toast } from "react-toastify"; // optional, for notifications

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle all response codes
api.interceptors.response.use(
  (response) => response, // pass successful responses through
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        toast.error("Bad Request: " + message);
        break;
      case 401:
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        if (typeof window !== "undefined") window.location.href = "/login";
        break;
      case 403:
        toast.error("Forbidden: You don’t have permission.");
        break;
      case 422:
        toast.error("Validation Error: " + JSON.stringify(error.response.data.errors));
        break;
      case 500:
        toast.error("Server Error: Please try again later.");
        break;
      default:
        toast.error("Error: " + message);
    }

    return Promise.reject(error);
  }
);

export default api;
