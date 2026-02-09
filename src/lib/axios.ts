import axios from "axios";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "~/features/auth/constants/localStorage";

// Function to resolve baseURL dynamically
const getBaseURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2001/api';

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If accessing via IP, try to use that IP for API as well
    if (hostname === "192.168.10.159") {
      return `http://192.168.10.159:2001/api`;
    }
  }

  return envURL;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
});

// Interceptor for outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for incoming responses (handles session expiration)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, the token is likely expired or invalid
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.warn("Session expired (401), redirecting to login...");
        localStorage.removeItem(LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY);

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);