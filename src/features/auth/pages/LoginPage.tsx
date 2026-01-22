"use client";
import { authClient } from "~/lib/auth-client";
import { LoginForm } from "../components/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    console.log("🏁 LoginPage Mounted - Version: Fix-Token-Race-Condition");
    // Only redirect if session has a valid user object with required fields
    // This prevents false redirects when the API returns errors or empty data
    if (session?.user?.id && session?.user?.email) {
      router.replace("/");
    }
  }, [session, router]);

  // Logic pembersihan token dihapus untuk mencegah race condition saat login berhasil

  return (
    <div className="flex min-h-screen items-center justify-center w-full relative">
      {isPending ? (
        <div className="animate-pulse text-muted-foreground absolute">Memuat...</div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default LoginPage;
