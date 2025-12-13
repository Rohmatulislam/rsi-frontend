import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

interface Schedule {
  id?: string;
  dayOfWeek?: string | number; // Bisa berupa string (nama hari) atau number (0-6) - opsional karena bisa tanggal spesifik
  date?: string; // Format: YYYY-MM-DD untuk tanggal spesifik
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

interface ScheduleSectionProps {
  schedules: Schedule[];
  fallbackSchedules?: Schedule[];
}

export const ScheduleSection = ({ schedules, fallbackSchedules = [] }: ScheduleSectionProps) => {
  // Mapping untuk nama hari dalam bahasa Indonesia
  const dayNames: Record<string, string> = {
    "0": "Minggu",
    "1": "Senin",
    "2": "Selasa",
    "3": "Rabu",
    "4": "Kamis",
    "5": "Jumat",
    "6": "Sabtu",
    "Minggu": "Minggu",
    "Senin": "Senin",
    "Selasa": "Selasa",
    "Rabu": "Rabu",
    "Kamis": "Kamis",
    "Jumat": "Jumat",
    "Sabtu": "Sabtu"
  };

  const abbrDayNames: Record<string, string> = {
    "0": "Min",
    "1": "Sen",
    "2": "Sel",
    "3": "Rab",
    "4": "Kam",
    "5": "Jum",
    "6": "Sab",
    "Minggu": "Min",
    "Senin": "Sen",
    "Selasa": "Sel",
    "Rabu": "Rab",
    "Kamis": "Kam",
    "Jumat": "Jum",
    "Sabtu": "Sab"
  };

  const getFullDayName = (day: string) => {
    return dayNames[day] || day;
  };

  const getAbbrDay = (day: string) => {
    return abbrDayNames[day] || day.substring(0, 3);
  };

  // Fungsi untuk memformat tanggal spesifik
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('id-ID', { month: 'short' });
    return `${day} ${month}`;
  };

  // Fungsi untuk mendapatkan tanggal-tanggal mendatang berdasarkan dayOfWeek
  const getNextDatesForDay = (dayOfWeek: number, count: number = 3): string[] => {
    const dates: string[] = [];
    const today = new Date();
    const currentDay = today.getDay();

    // Hitung selisih hari
    let daysToAdd = dayOfWeek - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Jika hari ini, cari minggu depan
    }

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + daysToAdd + (i * 7));

      // Format ke YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    return dates;
  };

  // Gabungkan schedules dan hitung tanggal-tanggal mendatang untuk setiap jadwal
  const expandSchedules = (schedules: Schedule[]): Schedule[] => {
    const expandedSchedules: Schedule[] = [];

    schedules.forEach(schedule => {
      if (schedule.date) {
        // Jika ada tanggal spesifik, gunakan langsung
        expandedSchedules.push(schedule);
      } else if (schedule.dayOfWeek !== undefined && schedule.dayOfWeek !== null) {
        // Jika hanya ada dayOfWeek, buat beberapa tanggal mendatang
        const dayOfWeekNum = typeof schedule.dayOfWeek === 'string' ? parseInt(schedule.dayOfWeek) : schedule.dayOfWeek;
        const nextDates = getNextDatesForDay(dayOfWeekNum, 3); // Ambil 3 tanggal mendatang

        nextDates.forEach(date => {
          expandedSchedules.push({
            ...schedule,
            date: date
          });
        });
      }
    });

    return expandedSchedules;
  };

  const displaySchedules = schedules && schedules.length > 0 ? schedules : fallbackSchedules;
  const expandedSchedules = expandSchedules(displaySchedules);

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Jadwal Praktek</h3>
            <p className="text-sm text-muted-foreground">Waktu praktek yang tersedia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expandedSchedules.length > 0 ? (
            expandedSchedules.map((schedule, idx) => {
              // Jika ada tanggal spesifik, gunakan itu
              const hasSpecificDate = !!schedule.date;
              let displayDay, displayAbbr, displayFullDate;

              if (hasSpecificDate && schedule.date) {
                displayDay = formatShortDate(schedule.date);
                displayAbbr = new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'short' });
                displayFullDate = formatDate(schedule.date);
              } else {
                const dayStr = schedule.dayOfWeek?.toString() || '';
                displayDay = getFullDayName(dayStr);
                displayAbbr = getAbbrDay(dayStr);
                displayFullDate = displayDay;
              }

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`h-14 w-14 flex flex-col items-center justify-center rounded-xl ${
                    schedule.isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <span className="text-xs uppercase text-muted-foreground font-medium">{displayAbbr}</span>
                    <span className="text-[10px] font-bold">{hasSpecificDate && schedule.date ? displayDay : ''}</span>
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {displayFullDate}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-primary font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-sm">{schedule.startTime} - {schedule.endTime} WIB</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-1 ${
                          schedule.isActive !== undefined ?
                          (schedule.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {schedule.isActive !== undefined ?
                          (schedule.isActive ? 'Tersedia' : 'Tertutup')
                          : 'Tersedia'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Jadwal praktik belum tersedia</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};