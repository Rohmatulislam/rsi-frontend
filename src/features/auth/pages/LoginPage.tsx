"use client";
import { authClient } from "~/lib/auth-client";
import { LoginForm } from "../components/LoginForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🏁 LoginPage Mounted - Version: Fix-Hydration-Mismatch");
  }, []);

  useEffect(() => {
    // Only redirect if session has a valid user object with required fields
    if (mounted && session?.user?.id && session?.user?.email) {
      router.replace("/");
    }
  }, [session, router, mounted]);

  // Handle hydration mismatch: server render is always "loading"
  if (!mounted || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center w-full relative">
        <div className="animate-pulse text-muted-foreground absolute">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center w-full relative">
      <LoginForm />
    </div>
  );
}
