import { useForm } from "react-hook-form";
import { RegisterFormSchema, registerFormSchema } from "../forms/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient, getErrorMessage } from "~/lib/auth-client";
import { toast } from "sonner";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";
import { useRouter } from "next/navigation";

export const useRegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterFormSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    console.log('[REGISTER] Starting registration for:', data.email);
    try {
      // Registrasi pengguna baru
      const { error, data: authResponseData } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      console.log('[REGISTER] Response:', { error, authResponseData });

      // Handle auth errors
      if (error) {
        console.error('[REGISTER] Auth error:', error);

        // Check for structured error code first
        if (error.code) {
          toast.error(getErrorMessage(error.code));
          return;
        }

        // Fallback: extract message from error response
        const errorMessage = error.message
          || (error as any)?.statusText
          || "Terjadi kesalahan saat mendaftar";

        // Map common backend messages to user-friendly notifications
        if (errorMessage.includes("sudah terdaftar") || errorMessage.includes("already exists")) {
          toast.error("Email sudah terdaftar. Silakan gunakan email lain atau login.");
        } else if (errorMessage.includes("Password minimal") || errorMessage.includes("password")) {
          toast.error("Password minimal 8 karakter.");
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      // If we have response data (user was created), show success
      if (authResponseData?.user) {
        if (authResponseData?.token) {
          localStorage.setItem(
            LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY,
            authResponseData.token
          );
          toast.success("Registrasi berhasil! Anda telah masuk.");
          router.push("/");
        } else {
          // No token = email verification required
          toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
          router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
        }
        return;
      }

      // Fallback: if we got here without error, assume success with email verification
      toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      // Handle non-auth errors (network, etc.)
      console.error('[REGISTER] Exception:', error);

      // Try to extract message from axios/fetch error response
      const responseMessage = error?.response?.data?.message;
      if (responseMessage) {
        if (responseMessage.includes("sudah terdaftar") || responseMessage.includes("already exists")) {
          toast.error("Email sudah terdaftar. Silakan gunakan email lain atau login.");
        } else {
          toast.error(responseMessage);
        }
      } else {
        toast.error("Gagal mendaftar. Silakan periksa koneksi internet Anda dan coba lagi.");
      }
    }
  };

  return { form, onSubmit };
};