import { Clock, Calendar } from "lucide-react";
import { DoctorDto } from "~/features/home/api/getDoctors";

interface DoctorScheduleByPoliProps {
  doctor: DoctorDto;
}

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

// Fungsi untuk mendapatkan tanggal terdekat berdasarkan hari dalam seminggu
const getNextDateForDay = (dayOfWeekIndex: number): string => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

  // Mapping dari nama hari ke indeks hari
  const dayMap: Record<string, number> = {
    'MINGGU': 0,
    'SENIN': 1,
    'SELASA': 2,
    'RABU': 3,
    'KAMIS': 4,
    'JUMAT': 5,
    'SABTU': 6,
    'AKHAD': 6
  };

  // Hitung selisih hari
  let daysToAdd = dayOfWeekIndex - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Jika hari ini atau kemarin, cari minggu depan
  }

  const date = new Date(today);
  date.setDate(today.getDate() + daysToAdd);

  // Format ke DD MMMM YYYY (contoh: 14 Desember 2024)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const DoctorScheduleByPoli = ({ doctor }: DoctorScheduleByPoliProps) => {
  if (!doctor.scheduleDetails || doctor.scheduleDetails.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300 text-sm">Tidak ada jadwal tersedia</p>
      </div>
    );
  }

  // Filter out schedules with 00:00:00-00:00:00 and group by poli name
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

  return (
    <div className="space-y-4">
      {Object.entries(groupedSchedules).map(([poliName, schedules]) => (
        <div
          key={poliName}
          className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">
              {poliName}
            </h3>
            {schedules[0]?.consultation_fee !== undefined && schedules[0].consultation_fee > 0 && (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Biaya</span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                  Rp {schedules[0].consultation_fee.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {schedules.map((schedule, index) => {
              const dayName = hariMapping[schedule.hari_kerja] || schedule.hari_kerja;

              // Dapatkan tanggal terdekat untuk hari ini
              const dayMap: Record<string, number> = {
                'MINGGU': 0,
                'SENIN': 1,
                'SELASA': 2,
                'RABU': 3,
                'KAMIS': 4,
                'JUMAT': 5,
                'SABTU': 6,
                'AKHAD': 6
              };

              const nextDate = getNextDateForDay(dayMap[schedule.hari_kerja]);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-600"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {dayName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 ml-6 mt-1">
                      {nextDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
                        {schedule.jam_mulai} - {schedule.jam_selesai}
                      </span>
                    </div>

                    {schedule.kuota !== null && (
                      <span className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full">
                        Kuota: {schedule.kuota}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};