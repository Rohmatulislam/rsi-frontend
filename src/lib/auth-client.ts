import { createAuthClient } from "better-auth/react";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "~/features/auth/constants/localStorage";

// Better Auth expects base URL without /api suffix
// It will automatically append /api/auth to the base URL
const getAuthBaseURL = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000/api';
  // Remove /api suffix if present for auth client
  return apiUrl.replace(/\/api$/, '');
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(), // The base URL of your auth server (without /api)
  fetchOptions: {
    credentials: "omit",
    auth: {
      type: "Bearer",
      token: async () => {
        const token = localStorage.getItem(LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY);
        return token ?? undefined;
      }
    }
  },
  advanced: {
    cookiePrefix: "rsi-frontend"
  }
});

const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: "User already registered",
    id: "Email sudah terdaftar. Silakan gunakan email lain atau login.",
  },
  USER_EMAIL_NOT_FOUND: {
    en: "Email not found",
    id: "Email tidak ditemukan",
  },
  INVALID_PASSWORD: {
    en: "Invalid password",
    id: "Kata sandi salah",
  },
  USER_NOT_FOUND: {
    en: "User not found",
    id: "Pengguna tidak ditemukan",
  },
  EMAIL_NOT_VERIFIED: {
    en: "Email not verified",
    id: "Email belum diverifikasi. Silakan cek kotak masuk email Anda.",
  },
  PASSWORD_TOO_SHORT: {
    en: "Password must be at least 8 characters",
    id: "Password minimal 8 karakter",
  },
  FAILED_TO_CREATE_USER: {
    en: "Failed to create account",
    id: "Gagal membuat akun. Silakan coba lagi.",
  },
} satisfies Record<string, { en: string; id: string }>;

export type AuthError = {
  code?: string | undefined | keyof typeof authClient.$ERROR_CODES;
  message?: string | undefined;
  status: number;
  statusText: string;
} | null;

export const getErrorMessage = (code: string, lang: "en" | "id" = "id") => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return lang === "en" ? "An error occurred, please try again" : "Terjadi kesalahan, silakan coba lagi";
};
