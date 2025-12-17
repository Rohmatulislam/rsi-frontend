import { Clock, MapPin, Stethoscope, Star, User, Wallet } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const placeholderImageUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D";

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
  scheduleDetails?: {
    kd_poli: string;
    nm_poli: string;
    hari_kerja: string;
    jam_mulai: string;
    jam_selesai: string;
    kuota: number | null;
  }[];
  consultation_fee?: number | null;
  rating?: number | null;
  review_count?: number | null;
}

export const DoctorCard = ({ doctor, hideExecutiveBadge = false }: { doctor: DoctorCardProps; hideExecutiveBadge?: boolean }) => {
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

  // Format nomor telepon jika ada
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Hanya tampilkan 4 digit terakhir
    return `...${phone.slice(-4)}`;
  };

  // Ambil jadwal terdekat untuk ditampilkan (hanya dari schedule yang valid)
  let nearestSchedule = null;
  if (doctor.schedules && doctor.schedules.length > 0) {
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
      <div className="p-5 pb-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
              {doctor.imageUrl ? (
                // Use native img tag to avoid Next.js private IP restriction for localhost
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Fallback to placeholder on error
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.name);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-700 dark:to-slate-800 text-slate-500 dark:text-slate-400">
                  <Stethoscope className="h-6 w-6 opacity-70" />
                </div>
              )}
            </div>

            {/* Badges - Positioned outside image area */}
            <div className="absolute -bottom-1 -left-1 flex flex-wrap gap-0.5">
              {doctor.is_executive && !hideExecutiveBadge && (
                // Hanya tampilkan badge eksekutif jika dokter memiliki jadwal aktif
                ((doctor.scheduleDetails && doctor.scheduleDetails.some(schedule =>
                  schedule.jam_mulai !== '00:00:00' && schedule.jam_selesai !== '00:00:00'
                )) || (doctor.schedules && doctor.schedules.length > 0))
                && (
                  <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white border-none text-[9px] px-1.5 py-0.5 rounded-full shadow-sm">
                    <span className="mr-0.5">👑</span> Eksekutif
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 text-base">
              {doctor.name}
            </h3>
            <p className="text-sm text-primary font-medium line-clamp-1">
              {doctor.specialization || "Dokter Umum"}
            </p>

            {/* Rating and review info - hanya tampilkan jika ada */}
            {doctor.rating !== undefined && doctor.rating !== null && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {doctor.rating} {doctor.review_count !== undefined && doctor.review_count !== null ? `(${doctor.review_count})` : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-5">
        <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Content Section - Information below divider */}
      <div className="p-5 flex flex-col flex-1 pt-3">
        <div className="flex-1 space-y-3">
          <div className="space-y-3 pt-1">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1 text-sm">
                {doctor.department || `Poli ${doctor.specialization || 'Umum'}`}
              </span>
            </div>

            {/* Jadwal terdekat */}
            {nearestSchedule ? (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Jadwal: {nearestSchedule}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Sementara tidak menerima pasien</span>
              </div>
            )}

            {/* Jika ada schedule details (dari SIMRS) */}
            {groupedSchedules && Object.keys(groupedSchedules).length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <User className="h-3 w-3" />
                  <span className="font-medium text-xs">Kategori:</span>
                </div>
                <div className="ml-5 space-y-1">
                  {Object.entries(groupedSchedules).slice(0, 2).map(([poliName, schedules], idx) => {
                    const schedule = schedules[0]; // Take the first schedule for this poli
                    return (
                      <div key={idx} className="text-xs text-slate-600 dark:text-slate-300">
                        {poliName}
                      </div>
                    );
                  })}
                  {Object.keys(groupedSchedules).length > 2 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      +{Object.keys(groupedSchedules).length - 2} kategori lainnya
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Biaya konsultasi */}
            {doctor.consultation_fee !== undefined && doctor.consultation_fee !== null && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">
                  {doctor.consultation_fee === 0
                    ? "Gratis"
                    : `Rp ${doctor.consultation_fee.toLocaleString('id-ID')}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cek apakah dokter memiliki jadwal aktif */}
        {((doctor.scheduleDetails && doctor.scheduleDetails.some(schedule =>
          schedule.jam_mulai !== '00:00:00' && schedule.jam_selesai !== '00:00:00'
        )) || (doctor.schedules && doctor.schedules.length > 0)) ? (
          <Button className="w-full rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all mt-3" asChild>
            <Link href={`/doctor/${doctor.slug}`}>
              Lihat Jadwal & Booking
            </Link>
          </Button>
        ) : (
          <Button className="w-full rounded-lg font-semibold text-sm shadow-sm transition-all mt-3 opacity-50 cursor-not-allowed" disabled>
            Jadwal Belum Tersedia
          </Button>
        )}
      </div>
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

            {/* Category skeleton */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              </div>
              <div className="ml-5 space-y-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg mt-3" />
      </div>
    </div>
  );
};