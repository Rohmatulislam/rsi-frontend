import { useForm } from "react-hook-form";
import { LoginFormSchema, loginformSchema } from "../forms/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient, getErrorMessage } from "~/lib/auth-client";
import { toast } from "sonner";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginformSchema),
  });

  const onSubmit = async (data: LoginFormSchema) => {
    setServerError(null);
    try {
      const { error, data: authResponseData } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      //handle auth errors
      if (error) {
        console.error("Login Error Received:", error);

        if (error.code === "EMAIL_NOT_VERIFIED") {
          await authClient.sendVerificationEmail({
            email: data.email,
            callbackURL: "/",
          });
          const msg = "Email belum diverifikasi. Tautan verifikasi baru telah dikirim ke email Anda.";
          toast.info(msg);
          setServerError(msg);
          return;
        }

        const mappedMsg = getErrorMessage(error.code || "UNKNOWN");
        const finalMsg = (error.code && mappedMsg !== "Terjadi kesalahan, silakan coba lagi")
          ? mappedMsg
          : (error.message || "Gagal masuk. Periksa email dan kata sandi Anda.");

        toast.error(finalMsg);
        setServerError(finalMsg);
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
      const msg = (error as Error).message;
      toast.error(msg);
      setServerError(msg);
    }
  };

  return { form, onSubmit, serverError };
};

