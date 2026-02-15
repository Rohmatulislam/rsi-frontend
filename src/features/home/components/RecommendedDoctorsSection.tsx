"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useGetDoctors, DoctorSortBy } from "../api/getDoctors";
import { DoctorCard, DoctorCardSkeleton } from "~/components/shared/DoctorCard";
import { useTranslations } from "next-intl";

export const RecommendedDoctorsSection = () => {
  const t = useTranslations("Doctors");
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
          <h2 className="text-3xl font-bold text-center mb-12">{t("recommended")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
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
      schedules: [{ dayOfWeek: 1, startTime: "09:00", endTime: "14:00" }, { dayOfWeek: 3, startTime: "09:00", endTime: "14:00" }]
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
    <section className="w-full">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
              <div className="h-10 w-2 bg-ramadan-gold rounded-full hidden md:block" />
              {t("title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl font-medium">
              {t("subtitle")}
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="hidden md:flex rounded-2xl border-ramadan-gold/50 text-ramadan-gold hover:bg-ramadan-gold hover:text-white transition-all duration-500 shadow-xl shadow-ramadan-gold/5">
            <Link href="/doctors">
              {t("view_all")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>


        <div className="mt-12 flex justify-center md:hidden">
          <Button variant="outline" size="lg" className="rounded-full w-full" asChild>
            <Link href="/doctors">
              {t("view_all")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
