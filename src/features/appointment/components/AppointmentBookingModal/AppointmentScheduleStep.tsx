import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { AppointmentFormData, AvailableDate } from "../../services/appointmentService";
import Image from "next/image";
import { Stethoscope, Calendar, Clock, MapPin } from "lucide-react";
import { useGetActivePoli } from "~/features/doctor/api/getActivePoli";

import { VisualCalendar } from "./VisualCalendar";

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
  // Ambil daftar poliklinik dengan jadwal aktif dari SIMRS
  const { data: activePolis, isLoading: isLoadingPolis, error: poliError } = useGetActivePoli();

  // Mapping hari dari Khanza (String) ke Indika Hari (0-6)
  const dayNameMap: Record<string, number> = {
    'MINGGU': 0,
    'SENIN': 1,
    'SELASA': 2,
    'RABU': 3,
    'KAMIS': 4,
    'JUMAT': 5,
    'SABTU': 6,
    'AKHAD': 0, // Ada yang pakai Akhad juga
  };

  // Ambil semua hari di mana dokter ini ada jadwal (0-6)
  const availableDayOfWeek = Array.from(new Set(
    doctor?.schedules?.map((s: any) => s.dayOfWeek) ||
    doctor?.scheduleDetails?.map((s: any) => dayNameMap[s.hari_kerja.toUpperCase()]) ||
    []
  )).filter(d => d !== undefined) as number[];

  // Filter hanya poliklinik yang sesuai dengan dokter ini (berdasarkan kategori dokter)
  const doctorCategoryNames = doctor?.categories?.map((cat: any) => cat.name) || [];
  const filteredPolis = !doctor
    ? activePolis
    : activePolis?.filter((poli: any) =>
      doctorCategoryNames.length === 0 ||
      doctorCategoryNames.some((catName: string) =>
        poli.nm_poli.toLowerCase().includes(catName.toLowerCase()) ||
        catName.toLowerCase().includes(poli.nm_poli.toLowerCase())
      )
    ) || [];

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow;

  // Calculate max date (2 weeks from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);

  return (
    <div className="space-y-6">
      {/* ... existing header ... */}
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
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Poliklinik Selection */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            1. Pilih Poliklinik <span className="text-red-500">*</span>
          </Label>

          {isLoadingPolis ? (
            <div className="flex items-center gap-2 py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Memuat unit layanan...</span>
            </div>
          ) : poliError ? (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              Gagal memuat poliklinik. Silakan coba lagi nanti.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredPolis?.map((poli: any) => (
                <button
                  key={poli.kd_poli}
                  type="button"
                  className={`text-[12px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg transition-all border ${formData.poliId === poli.kd_poli
                    ? 'text-primary-foreground bg-primary border-primary shadow-sm'
                    : 'text-muted-foreground bg-background border-border hover:border-primary hover:text-primary'
                    }`}
                  onClick={() => setFormData({ ...formData, poliId: poli.kd_poli, poliName: poli.nm_poli })}
                >
                  {poli.nm_poli}
                </button>
              ))}
              {filteredPolis && filteredPolis.length === 0 && (
                <p className="text-sm text-red-500 italic">Praktek dokter tidak ditemukan di SIMRS hari ini.</p>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Visual Calendar Selection */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <Calendar className="h-4 w-4 text-primary" />
            2. Pilih Tanggal Kunjungan <span className="text-red-500">*</span>
          </Label>

          <VisualCalendar
            selectedDate={formData.date}
            onSelect={(date) => setFormData({ ...formData, date, time: "" })}
            availableDays={availableDayOfWeek}
            minDate={minDate}
            maxDate={maxDate}
          />

          <p className="text-[11px] text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 italic">
            Tips: Pilih tanggal yang ditandai dengan titik biru untuk jadwal praktek.
          </p>
        </div>

        {/* Section 3: Time Selection - Show only when date is selected */}
        {formData.date && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              3. Pilih Waktu Kunjungan <span className="text-red-500">*</span>
            </Label>

            {/* Show selected date info */}
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p className="font-semibold text-primary">
                {new Date(formData.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Time buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto p-1 custom-scrollbar">
              {getAvailableTimesForDate(formData.date).map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={`p-3 rounded-xl border-2 text-center transition-all ${formData.time === time
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setFormData({ ...formData, time })}
                >
                  {time}
                </button>
              ))}
            </div>

            {getAvailableTimesForDate(formData.date).length === 0 && (
              <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
                <p className="font-medium">Tidak ada waktu tersedia</p>
                <p className="text-xs mt-1">Silakan pilih tanggal lain yang tersedia</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};