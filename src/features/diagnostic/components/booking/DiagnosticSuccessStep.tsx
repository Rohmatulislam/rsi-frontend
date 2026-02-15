"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { CheckCircle2, ArrowRight, Calendar, ShoppingBag, Loader2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { useDiagnosticBasket } from "../../store/useDiagnosticBasket";

interface DiagnosticSuccessStepProps {
    formData: any;
    bookingResponse?: any;
}

declare global {
    interface Window {
        snap: any;
    }
}

export const DiagnosticSuccessStep = ({ formData, bookingResponse }: DiagnosticSuccessStepProps) => {
    const orderNumber = bookingResponse?.orderNumber;
    const [isPaying, setIsPaying] = useState(false);

    const handlePayment = async () => {
        if (!bookingResponse?.orderNumber) {
            toast.error("Data pesanan tidak ditemukan");
            return;
        }

        setIsPaying(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2005/api";
            // Check for id or orderId based on backend response
            const dbId = bookingResponse.id || bookingResponse.orderNumber;

            if (!dbId) {
                toast.error("ID Pesanan tidak ditemukan");
                return;
            }

            const response = await fetch(`${baseUrl}/diagnostic/orders/${dbId}/payment`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Gagal mendapatkan token pembayaran");
            }

            const { token } = await response.json();

            if (window.snap) {
                window.snap.pay(token, {
                    onSuccess: (result: any) => {
                        toast.success("Pembayaran Berhasil!");
                        console.log(result);
                    },
                    onPending: (result: any) => {
                        toast.info("Pembayaran Pending");
                        console.log(result);
                    },
                    onError: (result: any) => {
                        toast.error("Pembayaran Gagal");
                        console.log(result);
                    },
                    onClose: () => {
                        toast.info("Anda menutup jendela pembayaran");
                    }
                });
            } else {
                throw new Error("Midtrans Snap belum siap. Silakan refresh halaman atau coba lagi.");
            }
        } catch (error: any) {
            toast.error("Gagal memulai pembayaran", {
                description: error.message
            });
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Reservasi Berhasil!</h3>
                    {orderNumber && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order ID:</span>
                            <span className="text-sm font-black text-primary">{orderNumber}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handlePayment}
                        disabled={isPaying}
                        className="w-full h-14 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/10"
                    >
                        {isPaying ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Menyiapkan Pembayaran...
                            </>
                        ) : (
                            <>
                                Bayar Sekarang
                                <CreditCard className="h-5 w-5 ml-2" />
                            </>
                        )}
                    </Button>
                    <p className="text-[11px] font-bold text-slate-500">
                        Bayar sekarang melalui Midtrans (Bank Transfer, E-Wallet, atau Konter).
                    </p>
                </div>

                <p className="text-muted-foreground text-sm max-w-[320px] mx-auto pt-2">
                    Data sedang diproses. Silakan tunjukkan bukti ini atau sebutkan nama Anda di loket pendaftaran.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border rounded-[2.5rem] p-6 space-y-4 text-left">
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
