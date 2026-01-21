"use client";
import { authClient } from "~/lib/auth-client";
import { RegisterForm } from "../components/RegisterForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";

const RegisterPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Only redirect if session has a valid user object with required fields
    // This prevents false redirects when the API returns errors or empty data
    if (session?.user?.id && session?.user?.email) {
      router.replace("/");
    }
  }, [session, router]);

  // Logic pembersihan token dihapus untuk mencegah race condition

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center w-full">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;