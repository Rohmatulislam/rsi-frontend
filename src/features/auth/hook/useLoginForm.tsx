import { useForm } from "react-hook-form";
import { LoginFormSchema, loginformSchema } from "../forms/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient, getErrorMessage } from "~/lib/auth-client";
import { toast } from "sonner";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";
import { useRouter, useSearchParams } from "next/navigation";

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginformSchema),
  });

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      const { error, data: authResponseData } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      //handle auth errors
      if (error?.code) {
        toast.error(getErrorMessage(error.code));
        return;
      }

      if (authResponseData?.token) {
        localStorage.setItem(
          LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY,
          authResponseData.token
        );
        //handle success
        toast.success("Login berhasil!");

        // Redirect ke returnUrl jika ada, atau ke halaman utama
        const returnUrl = searchParams.get("returnUrl");
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      // handle non-auth errors
      toast.error((error as Error).message);
    }
  };

  return { form, onSubmit };
};

