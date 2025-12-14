"use client";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LoginPromptModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
}

/**
 * Modal untuk prompt user login sebelum melakukan booking
 */
export const LoginPromptModal = ({
    isOpen,
    onOpenChange,
    trigger,
    title = "Login Diperlukan",
    description = "Silakan login terlebih dahulu untuk membuat janji temu dengan dokter.",
}: LoginPromptModalProps) => {
    const pathname = usePathname();
    const returnUrl = encodeURIComponent(pathname);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {trigger && (
                <DialogTrigger asChild onClick={() => onOpenChange(true)}>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <LogIn className="h-5 w-5 text-emerald-600" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Dengan login, Anda dapat:
                    </p>
                    <ul className="text-sm space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Membuat janji temu dengan dokter
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Melihat riwayat kunjungan
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Menerima notifikasi pengingat
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                        <Link href={`/login?returnUrl=${returnUrl}`}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href={`/register?returnUrl=${returnUrl}`}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Daftar Akun Baru
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
