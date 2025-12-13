import { useForm } from "react-hook-form";
import { RegisterFormSchema, registerFormSchema } from "../forms/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient, getErrorMessage } from "~/lib/auth-clent";
import { toast } from "sonner";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";

export const useRegisterForm = () => {
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
    try {
      // Registrasi pengguna baru
      const { error, data: authResponseData } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      // Handle auth errors
      if (error?.code) {
        toast.error(getErrorMessage(error.code));
        return;
      }

      if (authResponseData?.token) {
        localStorage.setItem(
          LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY,
          authResponseData.token
        );

        // Handle success
        toast.success("Registrasi berhasil! Anda telah masuk.");
      }
    } catch (error) {
      // Handle non-auth errors
      toast.error((error as Error).message);
    }
  };

  return { form, onSubmit };
};