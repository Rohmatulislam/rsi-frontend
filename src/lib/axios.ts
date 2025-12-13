import axios from "axios";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "~/features/auth/constants/localStorage";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
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