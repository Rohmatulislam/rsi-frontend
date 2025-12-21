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

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string;
    }
  >
>;

const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: "User already registered",
  },
  USER_EMAIL_NOT_FOUND: {
    en: "Email not found",
  },
  INVALID_PASSWORD: {
    en: "Invalid password",
  },
  USER_NOT_FOUND: {
    en: "User not found",
  },
} satisfies ErrorTypes;

export type AuthError = {
  code?: string | undefined | keyof typeof authClient.$ERROR_CODES;
  message?: string | undefined;
  status: number;
  statusText: string;
} | null;

export const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes]["en"];
  }
  return "An error occurred, please try again";
};
