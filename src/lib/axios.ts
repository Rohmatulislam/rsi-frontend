import axios from "axios";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "~/features/auth/constants/localStorage";

// NEXT_PUBLIC_API_URL should already contain /api (e.g., http://192.168.10.159:2000/api)
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000/api';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: false,
});

// Interceptor untuk menyertakan token otentikasi jika ada
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);