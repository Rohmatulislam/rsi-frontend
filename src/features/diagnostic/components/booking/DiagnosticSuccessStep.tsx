"use client";

import { Button } from "~/components/ui/button";
import { CheckCircle2, ArrowRight, Calendar, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useDiagnosticBasket } from "../../store/useDiagnosticBasket";

interface DiagnosticSuccessStepProps {
    formData: any;
    bookingResponse?: any;
}

export const DiagnosticSuccessStep = ({ formData, bookingResponse }: DiagnosticSuccessStepProps) => {
    const orderNumber = bookingResponse?.orderNumber;

    return (
        <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Reservasi Berhasil!</h3>
                {orderNumber && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order ID:</span>
                        <span className="text-sm font-black text-primary">{orderNumber}</span>
                    </div>
                )}
                <p className="text-muted-foreground text-sm max-w-[280px] mx-auto pt-2">
                    Data sedang diproses. Silakan tunjukkan bukti ini atau sebutkan nama Anda di loket pendaftaran.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border rounded-[2rem] p-6 space-y-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border flex items-center justify-center text-primary shadow-sm">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jadwal Kedatangan</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {formData.date ? format(formData.date, "EEEE, dd MMMM yyyy", { locale: id }) : '-'}
                            <span className="ml-2 text-primary">({formData.timeSlot})</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border flex items-center justify-center text-primary shadow-sm">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pasien</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formData.fullName}</p>
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground italic">
                Rincian lebih lanjut telah dikirimkan ke nomor WhatsApp Anda (jika terhubung).
            </p>
        </div>
    );
};
