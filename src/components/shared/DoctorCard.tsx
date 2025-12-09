import { Clock, MapPin, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

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

export const DoctorCard = ({ doctor }: { doctor: DoctorCardProps }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {doctor.imageUrl ? (
          <Image
            src={doctor.imageUrl}
            alt={doctor.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Stethoscope className="h-16 w-16 opacity-30" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {doctor.is_executive && (
             <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg backdrop-blur-md">
                <span className="mr-1">👑</span> Executive
             </Badge>
           )}
           {doctor.bpjs && (
             <Badge className="bg-green-500 hover:bg-green-600 text-white border-none shadow-lg backdrop-blur-md">
                BPJS
             </Badge>
           )}
        </div>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white/80 text-sm font-medium mb-1 line-clamp-1">
                {doctor.specialization || "Dokter Umum"}
            </p>
            <h3 className="text-xl font-bold leading-tight line-clamp-2 drop-shadow-md">
                {doctor.name}
            </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
         {/* Categories/Tags */}
         <div className="flex flex-wrap gap-2 min-h-[1.5rem]">
            {doctor.categories?.slice(0, 3).map((cat: any, idx: number) => (
                <span key={idx} className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-md">
                    {cat.name}
                </span>
            ))}
         </div>
         
         <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-2 space-y-2">
            
            {/* Location */}
            <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                    {doctor.department || `Poli ${doctor.specialization || 'Umum'}`}
                </span>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                        Jadwal Praktek
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {doctor.schedules && doctor.schedules.length > 0 
                          ? `${doctor.schedules.length} Sesi tersedia` 
                          : "Senin - Jumat | 09:00 - 15:00"}
                    </span>
                </div>
            </div>

         </div>

         <Button className="w-full rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mt-2" asChild>
            <Link href={`/dokter/${doctor.slug}`}>
              Buat Janji Temu
            </Link>
         </Button>
      </div>
    </div>
  );
};