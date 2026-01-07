"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CheckEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "email Anda";

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Mail className="h-16 w-16 text-primary" />
                            <CheckCircle2 className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Cek Email Anda</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Kami telah mengirimkan email verifikasi ke:
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="font-semibold text-lg text-primary break-all">
                        {email}
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                        <p>📧 Buka inbox email Anda</p>
                        <p>🔗 Klik link verifikasi yang kami kirim</p>
                        <p>✅ Setelah terverifikasi, Anda dapat login</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Tidak menerima email? Cek folder spam atau tunggu beberapa menit.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                        <Link href="/login">Kembali ke Login</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Email dari: <span className="font-medium">RSI Hospital</span>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
