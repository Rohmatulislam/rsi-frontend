"use client";
export const runtime = 'edge';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Memverifikasi email Anda...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Token verifikasi tidak ditemukan.");
            return;
        }

        const verify = async () => {
            try {
                const { error } = await authClient.verifyEmail({
                    query: {
                        token: token
                    }
                });

                if (error) {
                    setStatus("error");
                    setMessage(error.message || "Gagal memverifikasi email.");
                } else {
                    setStatus("success");
                    setMessage("Email Anda telah berhasil diverifikasi. Sekarang Anda dapat masuk ke akun Anda.");
                    toast.success("Verifikasi berhasil!");
                }
            } catch (err) {
                setStatus("error");
                setMessage("Terjadi kesalahan sistem saat verifikasi.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
                        {status === "success" && <CheckCircle2 className="h-12 w-12 text-green-500" />}
                        {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
                    </div>
                    <CardTitle>
                        {status === "loading" && "Memverifikasi..."}
                        {status === "success" && "Verifikasi Berhasil!"}
                        {status === "error" && "Verifikasi Gagal"}
                    </CardTitle>
                    <CardDescription>
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                    {status !== "loading" && (
                        <Button asChild className="w-full">
                            <Link href="/login">Kembali ke Login</Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
