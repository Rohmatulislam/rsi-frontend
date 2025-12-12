"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Stethoscope, Crown } from "lucide-react";

interface DoctorSearchModalProps {
    children: React.ReactNode;
}

export const DoctorSearchModal = ({ children }: DoctorSearchModalProps) => {
    const router = useRouter();

    const handleSelect = (type: 'umum' | 'executive') => {
        if (type === 'umum') {
            router.push('/dokters');
        } else {
            router.push('/dokters?type=executive');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Pilih Layanan Konsultasi</DialogTitle>
                    <DialogDescription className="text-center">
                        Silakan pilih jenis layanan poli yang Anda butuhkan
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div
                        onClick={() => handleSelect('umum')}
                        className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300"
                    >
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Stethoscope className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Poli Reguler</h3>
                                <p className="text-sm text-muted-foreground">Layanan Dokter Spesialis & Umum Reguler</p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => handleSelect('executive')}
                        className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-6 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
                    >
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <Crown className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Poli Eksekutif</h3>
                                <p className="text-sm text-muted-foreground">Layanan Premium, Cepat & Nyaman</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
