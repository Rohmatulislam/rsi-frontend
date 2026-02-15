"use client";

import { useDiagnosticBasket } from "../../store/useDiagnosticBasket";
import { Badge } from "~/components/ui/badge";
import { CheckCircle2, ShoppingCart, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DiagnosticConfirmStepProps {
    formData: any;
}

export const DiagnosticConfirmStep = ({ formData }: DiagnosticConfirmStepProps) => {
    const { items, getTotalPrice } = useDiagnosticBasket();

    return (
        <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <h4 className="font-bold text-sm">Ringkasan Layanan</h4>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/40 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black ${item.type === 'LAB' ? 'bg-blue-100 text-blue-600' :
                                        item.type === 'RADIOLOGY' ? 'bg-purple-100 text-purple-600' :
                                            'bg-green-100 text-green-600'
                                    }`}>
                                    {item.type.substring(0, 1)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{item.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.category}</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-primary">Rp {item.price.toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                </div>
                <div className="pt-4 border-t border-dashed flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">Total Estimasi</span>
                    <span className="text-xl font-black text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-[1.5rem] bg-primary/5 border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Waktu Kedatangan</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-base font-black">{formData.date ? format(formData.date, "EEEE, dd MMMM yyyy", { locale: id }) : '-'}</p>
                        <Badge variant="outline" className="bg-white text-primary border-primary/20">{formData.timeSlot}</Badge>
                    </div>
                </div>

                <div className="p-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 border border-border/40 space-y-3">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Informasi Pasien</span>
                    </div>
                    <div>
                        <p className="text-base font-black">{formData.fullName}</p>
                        <p className="text-xs text-muted-foreground font-medium">{formData.patientType === 'old' ? `No. RM: ${formData.mrNumber}` : `NIK: ${formData.nik}`}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                    Dengan mengklik tombol konfirmasi, Anda menyetujui jadwal pemeriksaan dan bersedia mengikuti instruksi persiapan (puasa, dll) jika diperlukan.
                </p>
            </div>
        </div>
    );
};
