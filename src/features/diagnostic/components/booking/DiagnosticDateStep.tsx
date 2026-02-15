"use client";

import { Label } from "~/components/ui/label";
import { format, addDays, isPast, isToday } from "date-fns";
import { id } from "date-fns/locale";
import { VisualCalendar } from "~/features/appointment/components/AppointmentBookingModal/VisualCalendar";

interface DiagnosticDateStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

const TIME_SLOTS = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
];

export const DiagnosticDateStep = ({ formData, setFormData }: DiagnosticDateStepProps) => {
    return (
        <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3">
                <Label className="text-sm font-bold flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">1</span>
                    Pilih Tanggal Kedatangan
                </Label>
                <div className="flex justify-center">
                    <VisualCalendar
                        selectedDate={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
                        onSelect={(dateStr) => setFormData({ ...formData, date: new Date(dateStr) })}
                        availableDays={[1, 2, 3, 4, 5, 6]} // Senin - Sabtu
                        minDate={addDays(new Date(), 1)}
                        maxDate={addDays(new Date(), 30)}
                    />
                </div>
                {formData.date && (
                    <p className="text-xs text-center font-medium text-primary bg-primary/5 py-2 rounded-lg border border-primary/10">
                        Terpilih: {format(formData.date, "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <Label className="text-sm font-bold flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">2</span>
                    Pilih Slot Waktu (Estimasi)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    {TIME_SLOTS.map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeSlot: slot })}
                            className={`flex items-center justify-center p-3 text-xs font-bold border-2 rounded-xl transition-all ${formData.timeSlot === slot
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "border-slate-100 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                * Slot waktu ini bersifat estimasi untuk membantu pengaturan antrean. Mohon datang 15 menit sebelum waktu yang dipilih.
            </div>
        </div>
    );
};
