"use client";

import { ArrowRight, CalendarDays, Clock, MapPin, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "~/components/ui/card";
import { useGetDoctors, DoctorSortBy } from "../api/getDoctors";
import { formatCurrency } from "~/lib/utils";

export const RecommendedDoctorsSection = () => {
  const { data: doctors, isLoading, error } = useGetDoctors({
    input: {
      sort: DoctorSortBy.RECOMMENDED,
      limit: 4, 
    },
  });

  if (isLoading) {
    return (
      <section className="w-full py-16 bg-slate-50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4 md:px-8">
           <h2 className="text-3xl font-bold text-center mb-12">DOKTER PILIHAN</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-3xl h-[500px]" />
              ))}
           </div>
        </div>
      </section>
    );
  }

  // Mock data untuk fallback jika API belum siap atau kosong
  const mockDoctors = [
    {
      id: "mock-1",
      name: "dr. Sarah Wilson, Sp.JP",
      specialization: "Jantung",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
      consultation_fee: 250000,
      is_executive: true,
      bpjs: true,
      slug: "dr-sarah-wilson",
      categories: [{ name: "Jantung" }, { name: "Executive" }],
      department: "Poli Jantung",
      schedules: [ { dayOfWeek: 1, startTime: "09:00", endTime: "14:00" }, { dayOfWeek: 3, startTime: "09:00", endTime: "14:00" } ]
    },
    {
      id: "mock-2",
      name: "dr. James Miller, Sp.B",
      specialization: "Bedah Umum",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=400&auto=format&fit=crop",
      consultation_fee: 200000,
      is_executive: false,
      bpjs: true,
      slug: "dr-james-miller",
      categories: [{ name: "Bedah" }],
      department: "Poli Bedah",
      schedules: []
    },
    {
      id: "mock-3",
      name: "dr. Emily Chen, Sp.A",
      specialization: "Anak",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&h=400&auto=format&fit=crop",
      consultation_fee: 180000,
      is_executive: true,
      bpjs: true,
      slug: "dr-emily-chen",
      categories: [{ name: "Anak" }],
      department: "Poli Anak",
      schedules: [{ dayOfWeek: 1, startTime: "08:00", endTime: "12:00" }]
    },
    {
      id: "mock-4",
      name: "dr. Michael Brown, Sp.PD",
      specialization: "Penyakit Dalam",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&h=400&auto=format&fit=crop",
      consultation_fee: 190000,
      is_executive: false,
      bpjs: true,
      slug: "dr-michael-brown",
      categories: [{ name: "Penyakit Dalam" }],
      department: "Poli Penyakit Dalam",
      schedules: []
    }
  ];

  // Gunakan data asli jika ada, jika tidak gunakan mock data
  const displayDoctors: any[] = (doctors && doctors.length > 0) ? doctors : mockDoctors;

  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Dokter Pilihan <span className="text-primary">Kami</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Temukan dokter spesialis berpengalaman yang siap memberikan pelayanan kesehatan terbaik untuk Anda dan keluarga.
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="hidden md:flex rounded-full px-6 hover:bg-primary hover:text-white transition-all duration-300">
            <Link href="/dokter">
              Lihat Semua Dokter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayDoctors.map((doctor) => (
            <div key={doctor.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
              
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
          ))}
        </div>
        
        <div className="mt-12 flex justify-center md:hidden">
            <Button variant="outline" size="lg" className="rounded-full w-full" asChild>
                <Link href="/dokter">
                  Lihat Semua Dokter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
};
