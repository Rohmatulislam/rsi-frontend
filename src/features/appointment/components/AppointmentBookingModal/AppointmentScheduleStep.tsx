import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { AppointmentFormData, AvailableDate } from "../../services/appointmentService";
import Image from "next/image";
import { Stethoscope, Calendar, Clock } from "lucide-react";

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
  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Calculate max date (2 weeks from now)
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 14);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
          {doctor?.imageUrl ? (
            <Image
              src={doctor.imageUrl}
              alt={doctor?.name || "Dokter"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-bold">
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-foreground">{doctor?.name || "Dokter"}</p>
          <p className="text-sm text-muted-foreground">{doctor?.specialization || "Dokter"}</p>
          {formData.poliName && (
            <p className="text-sm font-medium text-primary mt-1">→ {formData.poliName}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Date Selection - Using Input type="date" like RescheduleModal */}
        <div className="space-y-2">
          <Label htmlFor="appointmentDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Pilih Tanggal Kunjungan *
          </Label>
          <Input
            id="appointmentDate"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
            min={minDate}
            max={maxDate}
            className="w-full h-12"
          />
          <p className="text-xs text-muted-foreground">
            Pilih tanggal dalam 14 hari ke depan
          </p>
        </div>

        {/* Time Selection - Show only when date is selected */}
        {formData.date && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pilih Waktu Kunjungan *
            </Label>

            {/* Show selected date info */}
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-medium text-primary">
                {new Date(formData.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Time buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto p-1">
              {getAvailableTimesForDate(formData.date).map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={`p-3 rounded-xl border-2 text-center transition-all ${formData.time === time
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  onClick={() => setFormData({ ...formData, time })}
                >
                  {time}
                </button>
              ))}
            </div>

            {getAvailableTimesForDate(formData.date).length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                <p>Tidak ada waktu tersedia untuk tanggal yang dipilih</p>
                <p className="text-xs mt-1">Silakan pilih tanggal lain</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};