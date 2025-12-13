import { Clock, MapPin, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const placeholderImageUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D";
// Definisikan tipe Props berdasarkan struktur data dokter (bisa import DoctorDto, tapi disini saya buat interface agar reusable)
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
}

export const DoctorCard = ({ doctor, hideExecutiveBadge = false }: { doctor: DoctorCardProps; hideExecutiveBadge?: boolean }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* Header Section - Image and Name */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
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
                <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white border-none text-[9px] px-1.5 py-0.5 rounded-full shadow-sm">
                  <span className="mr-0.5">👑</span>
                </Badge>
              )}
              {doctor.bpjs && (
                <Badge className="bg-green-500/90 hover:bg-green-600 text-white border-none text-[9px] px-1.5 py-0.5 rounded-full shadow-sm">
                  BPJS
                </Badge>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 text-base">
              {doctor.name}
            </h3>
            <p className="text-sm text-primary font-medium line-clamp-1">
              {doctor.specialization || "Dokter Umum"}
            </p>
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
          {/* Categories/Tags */}
          <div className="flex flex-wrap gap-1.5">
            {doctor.categories?.slice(0, 3).map((cat: any, idx: number) => (
              <span 
                key={idx} 
                className="text-[10px] uppercase font-bold tracking-wide bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <div className="space-y-2 pt-1">

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {doctor.department || `Poli ${doctor.specialization || 'Umum'}`}
              </span>
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Clock className="h-4 w-4" />
              <span className="line-clamp-1">
                {doctor.schedules && doctor.schedules.length > 0
                  ? (() => {
                      // Ambil jadwal pertama
                      const schedule = doctor.schedules[0];

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

                      return `${['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][schedule.dayOfWeek]} ${getNextDateForDay(schedule.dayOfWeek)} (${schedule.startTime})`;
                    })()
                  : "Tidak ada jadwal"}
              </span>
            </div>

          </div>
        </div>

        <Button className="w-full rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all mt-3" asChild>
          <Link href={`/dokter/${doctor.slug}`}>
            Lihat Jadwal
          </Link>
        </Button>
      </div>
    </div>
  );
};