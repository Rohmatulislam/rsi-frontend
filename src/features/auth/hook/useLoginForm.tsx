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
      //handle auth errors
      if (error) {
        console.error("Login Error Received:", error); // Debugging

        if (error.code === "EMAIL_NOT_VERIFIED") {
          // Trigger resend email verification
          await authClient.sendVerificationEmail({
            email: data.email,
            callbackURL: "/",
          });
          toast.info("Email belum diverifikasi. Tautan verifikasi baru telah dikirim ke email Anda.");
          return;
        }

        // Generic error handling
        const message = error.message || getErrorMessage(error.code || "UNKNOWN");
        const displayMessage = message === "Terjadi kesalahan, silakan coba lagi" && error.message
          ? error.message
          : getErrorMessage(error.code || "UNKNOWN");

        // Prefer mapped message, fallback to error.message
        if (error.code && getErrorMessage(error.code) !== "Terjadi kesalahan, silakan coba lagi") {
          toast.error(getErrorMessage(error.code));
        } else {
          toast.error(error.message || "Gagal masuk. Periksa email dan kata sandi Anda.");
        }
        return;
      }

      console.log("Login Response Data:", authResponseData);

      if (authResponseData?.token) {
        localStorage.setItem(
          LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY,
          authResponseData.token
        );
        console.log("Token saved to localStorage:", authResponseData.token ? "YES" : "NO");
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

