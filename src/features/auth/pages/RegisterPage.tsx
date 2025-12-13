"use client";
import { authClient } from "~/lib/auth-clent";
import { RegisterForm } from "../components/RegisterForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;