import { Clock, MapPin, Stethoscope, User, Wallet } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export interface DoctorCardProps {
  id: string;
  name: string;
  specialization: string | null;
  imageUrl: string | null;
  is_executive: boolean | null;
  bpjs: boolean | null;
  slug: string | null;
  department: string | null;
  categories: { name: string }[];
  schedules: { dayOfWeek: number; startTime: string; endTime: string }[];
  isActive?: boolean;
  isStudying?: boolean | null;
  isOnLeave?: boolean | null;
  scheduleDetails?: {
    kd_poli: string;
    nm_poli: string;
    hari_kerja: string;
    jam_mulai: string;
    jam_selesai: string;
    kuota: number | null;
    consultation_fee?: number;
  }[];
  consultation_fee?: number | null;
  rating?: number | null;
  review_count?: number | null;
}

export const DoctorCard = ({
  doctor,
  hideExecutiveBadge = false,
  hideSchedule = false
}: {
  doctor: DoctorCardProps;
  hideExecutiveBadge?: boolean;
  hideSchedule?: boolean;
}) => {
  // Group schedule details by poli name for display, filtering out schedules with 00:00:00-00:00:00
  const filteredScheduleDetails = doctor.scheduleDetails?.filter(schedule =>
    schedule.jam_mulai !== '00:00:00' && schedule.jam_selesai !== '00:00:00'
  );

  const groupedSchedules = filteredScheduleDetails?.reduce((acc, schedule) => {
    const poliName = schedule.nm_poli || `Poli ${doctor.specialization || 'Umum'}`;
    if (!acc[poliName]) {
      acc[poliName] = [];
    }
    acc[poliName].push(schedule);
    return acc;
  }, {} as Record<string, typeof filteredScheduleDetails>);

  // Hari mapping untuk tampilan yang lebih rapi
  const hariMapping: Record<string, string> = {
    'MINGGU': 'Minggu',
    'SENIN': 'Senin',
    'SELASA': 'Selasa',
    'RABU': 'Rabu',
    'KAMIS': 'Kamis',
    'JUMAT': 'Jumat',
    'SABTU': 'Sabtu',
    'AKHAD': 'Akhad'
  };

  // Fungsi untuk mendapatkan tanggal terdekat berdasarkan dayOfWeek
  const getNextDateForDay = (dayOfWeek: number): string => {
    const today = new Date();
    const currentDay = today.getDay();

    // Hitung selisih hari
    let daysToAdd = dayOfWeek - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Jika hari ini atau kemarin, cari minggu depan
    }

    const date = new Date(today);
    date.setDate(today.getDate() + daysToAdd);

    // Format ke DD MMM (contoh: 14 Des)
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  // Ambil jadwal terdekat untuk ditampilkan (hanya dari schedule yang valid)
  let nearestSchedule = null;
  if (!hideSchedule && doctor.schedules && doctor.schedules.length > 0) {
    // Ambil jadwal pertama yang bukan jam 00:00:00 dari array schedules
    const validSchedules = doctor.schedules.filter(schedule =>
      schedule.startTime !== '00:00:00' && schedule.endTime !== '00:00:00'
    );

    if (validSchedules.length > 0) {
      const schedule = validSchedules[0];
      const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][schedule.dayOfWeek];
      const nextDate = getNextDateForDay(schedule.dayOfWeek);
      nearestSchedule = `${hari}, ${nextDate} (${schedule.startTime})`;
    }
  }

  return (
    <div className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">

      {/* Header Section - Image and Name */}
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
              {doctor.imageUrl ? (
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.name);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-700 dark:to-slate-800 text-slate-500 dark:text-slate-400">
                  <Stethoscope className="h-6 w-6 opacity-70" />
                </div>
              )}
            </div>

            {/* Executive Badge - moved to bottom left of image circle */}
            {!hideSchedule && doctor.is_executive && !hideExecutiveBadge && (
              <div className="absolute -bottom-1 -left-1">
                <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white border-2 border-white dark:border-slate-800 text-[9px] px-1.5 py-0.5 rounded-full shadow-sm">
                  Eksekutif
                </Badge>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-2 text-base leading-tight mb-1">
              {doctor.name}
            </h3>
            <p className="text-sm text-primary font-medium line-clamp-1">
              {doctor.specialization || "Dokter Umum"}
            </p>

            {/* Status Badge - hanya tampilkan jika cuti atau pendidikan (bukan aktif) */}
            {(doctor.isStudying || doctor.isOnLeave || !doctor.isActive) && (
              <div className="mt-2">
                {!doctor.isActive ? (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full">
                    Non-Aktif
                  </Badge>
                ) : doctor.isOnLeave ? (
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] px-2 py-0.5 rounded-full">
                    Sedang Cuti
                  </Badge>
                ) : doctor.isStudying ? (
                  <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded-full">
                    Sedang Pendidikan
                  </Badge>
                ) : null}
              </div>
            )}

            {/* Status Label for UGD/24h */}
            {hideSchedule && !doctor.isStudying && doctor.isActive && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Siaga 24 Jam
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hideSchedule && (
        <>
          {/* Divider */}
          <div className="px-5">
            <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col flex-1 pt-3">
            <div className="flex-1 space-y-3 font-medium">
              <div className="space-y-3 pt-1">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1 text-sm">
                    {doctor.department || `Poli ${doctor.specialization || 'Umum'}`}
                  </span>
                </div>

                {/* Jadwal terdekat */}
                {nearestSchedule && !doctor.isStudying && !doctor.isOnLeave ? (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Jadwal: {nearestSchedule}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {doctor.isStudying ? "Sementara tidak menerima pasien (Studi)" :
                        doctor.isOnLeave ? "Sementara tidak menerima pasien (Cuti)" :
                          "Sementara tidak menerima pasien"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cek apakah dokter memiliki jadwal aktif dan tidak sedang studi/cuti */}
            {(!doctor.isStudying && !doctor.isOnLeave && ((doctor.scheduleDetails && doctor.scheduleDetails.some(schedule =>
              schedule.jam_mulai !== '00:00:00' && schedule.jam_selesai !== '00:00:00'
            )) || (doctor.schedules && doctor.schedules.length > 0))) ? (
              <Button className="w-full rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all mt-3" asChild>
                <Link href={`/doctor/${doctor.slug}`}>
                  Lihat Jadwal & Booking
                </Link>
              </Button>
            ) : (
              <Button className="w-full rounded-lg font-semibold text-sm shadow-sm transition-all mt-3 opacity-50 cursor-not-allowed" disabled>
                {doctor.isStudying ? "Sedang Pendidikan" : doctor.isOnLeave ? "Sedang Cuti" : "Jadwal Belum Tersedia"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Skeleton Loading Component
export const DoctorCardSkeleton = () => {
  return (
    <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* Header Section - Image and Name */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-5">
        <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 pt-3">
        <div className="flex-1 space-y-3">
          <div className="space-y-3 pt-1">
            {/* Location skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>

            {/* Schedule skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg mt-3" />
      </div>
    </div>
  );
};