import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { McuBookingFormData, MCU_TIME_SLOTS } from "../../services/mcuService";

interface McuDateStepProps {
    formData: McuBookingFormData;
    setFormData: React.Dispatch<React.SetStateAction<McuBookingFormData>>;
}

export const McuDateStep = ({ formData, setFormData }: McuDateStepProps) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Pilih Tanggal
                </Label>
                <Input
                    type="date"
                    value={formData.date ? format(formData.date, 'yyyy-MM-dd') : ''}
                    min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                    onChange={(e) => {
                        const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                        setFormData({ ...formData, date: selectedDate });
                    }}
                    className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                    * Pemeriksaan MCU hanya tersedia Senin - Sabtu
                </p>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pilih Waktu
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    {MCU_TIME_SLOTS.map((slot) => (
                        <div
                            key={slot.id}
                            onClick={() => setFormData({ ...formData, timeSlot: slot.id })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.timeSlot === slot.id
                                ? "border-primary bg-primary/5"
                                : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <p className="font-medium text-sm">{slot.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
