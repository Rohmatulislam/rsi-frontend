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
      if (error?.code) {
        console.error('[REGISTER] Auth error:', error);
        toast.error(getErrorMessage(error.code));
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
          // Redirect to check-email page
          router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
        }
        return;
      }

      // Fallback: if we got here without error, assume success with email verification
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      // Handle non-auth errors
      console.error('[REGISTER] Exception:', error);
      toast.error((error as Error).message);
    }
  };

  return { form, onSubmit };
};