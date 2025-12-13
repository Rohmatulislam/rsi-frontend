import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AppointmentFormData, AvailableDate } from "../../types/appointment";
import Image from "next/image";
import { Stethoscope } from "lucide-react";

interface AppointmentScheduleStepProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  getAvailableDates: () => AvailableDate[];
  getAvailableTimesForDate: (selectedDate: string) => string[];
  doctor: any;
}

export const AppointmentScheduleStep = ({
  formData,
  setFormData,
  getAvailableDates,
  getAvailableTimesForDate,
  doctor
}: AppointmentScheduleStepProps) => {
  const availableDates = getAvailableDates();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
          {doctor.imageUrl ? (
            <Image
              src={doctor.imageUrl}
              alt={doctor.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
              <Stethoscope className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{doctor?.name || "Dokter"}</p>
          <p className="text-sm text-muted-foreground">{doctor?.specialization || "Dokter"}</p>
          {formData.poliName && (
            <p className="text-sm font-medium text-primary mt-1">→ {formData.poliName}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {!formData.date ? (
          <div className="space-y-3">
            <Label>Pilih Tanggal Kunjungan</Label>
            <Select onValueChange={(val) => {
              setFormData({ ...formData, date: val, time: "" }); // Reset time when date changes
            }}>
              <SelectTrigger className="w-full h-12 rounded-xl">
                <SelectValue placeholder="Pilih Tanggal Tersedia" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((dateOption, index) => (
                  <SelectItem key={index} value={dateOption.value}>
                    {new Date(dateOption.value).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">*Jadwal disesuaikan dengan praktek dokter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Label>Tanggal Terpilih</Label>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {new Date(formData.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div>
              <Label>Pilih Waktu Kunjungan</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2">
                {getAvailableTimesForDate(formData.date).map((time, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.time === time
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setFormData({ ...formData, time })}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {getAvailableTimesForDate(formData.date).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Tidak ada waktu tersedia untuk tanggal yang dipilih</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};