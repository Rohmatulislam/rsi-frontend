"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DoctorCard, DoctorCardSkeleton } from "~/components/shared/DoctorCard";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { Stethoscope, Search, Filter, Clock, Calendar, ArrowUpDown } from "lucide-react";
import { ServiceHero } from "~/features/services";

// Helper function to get day name from dayOfWeek number
const getDayName = (dayOfWeek: number): string => {
    const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    return days[dayOfWeek] || '';
};

// Get today's and tomorrow's day names
const getTodayDayName = (): string => {
    const today = new Date();
    return getDayName(today.getDay());
};

const getTomorrowDayName = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getDayName(tomorrow.getDay());
};

export const DoctorListPage = () => {
    const searchParams = useSearchParams();
    const initialExecutiveFilter = searchParams.get('type') === 'executive' ? 'executive' :
        searchParams.get('type') === 'reguler' ? 'reguler' : 'all';

    const [searchTerm, setSearchTerm] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState(initialExecutiveFilter);
    const [scheduleFilter, setScheduleFilter] = useState<"all" | "today" | "tomorrow">("all");
    const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "schedule">("name-asc");

    const { data: allDoctors, isLoading } = useGetDoctorsList({
        input: {
            limit: 1000,
        } as any,
    });

    // Check if doctor has schedule on specific day
    const hasScheduleOnDay = (doctor: any, dayName: string): boolean => {
        // Check scheduleDetails from Khanza
        if (doctor.scheduleDetails && doctor.scheduleDetails.length > 0) {
            return doctor.scheduleDetails.some((s: any) =>
                s.hari_kerja?.toUpperCase() === dayName &&
                s.jam_mulai !== '00:00:00' && s.jam_selesai !== '00:00:00'
            );
        }
        // Check local schedules
        if (doctor.schedules && doctor.schedules.length > 0) {
            const dayIndex = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'].indexOf(dayName);
            return doctor.schedules.some((s: any) =>
                s.dayOfWeek === dayIndex &&
                s.startTime !== '00:00:00' && s.endTime !== '00:00:00'
            );
        }
        return false;
    };

    // Get next schedule date for sorting
    const getNextScheduleDate = (doctor: any): Date => {
        const today = new Date();
        const currentDay = today.getDay();

        // Get all schedule days
        const scheduleDays: number[] = [];

        if (doctor.scheduleDetails && doctor.scheduleDetails.length > 0) {
            doctor.scheduleDetails.forEach((s: any) => {
                if (s.jam_mulai !== '00:00:00' && s.jam_selesai !== '00:00:00') {
                    const dayIndex = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'].indexOf(s.hari_kerja?.toUpperCase());
                    if (dayIndex >= 0) scheduleDays.push(dayIndex);
                }
            });
        }

        if (doctor.schedules && doctor.schedules.length > 0) {
            doctor.schedules.forEach((s: any) => {
                if (s.startTime !== '00:00:00' && s.endTime !== '00:00:00') {
                    scheduleDays.push(s.dayOfWeek);
                }
            });
        }

        if (scheduleDays.length === 0) {
            // No schedule, return far future date
            return new Date(9999, 11, 31);
        }

        // Find next available day
        for (let i = 0; i <= 7; i++) {
            const checkDay = (currentDay + i) % 7;
            if (scheduleDays.includes(checkDay)) {
                const nextDate = new Date(today);
                nextDate.setDate(today.getDate() + i);
                return nextDate;
            }
        }

        return new Date(9999, 11, 31);
    };

    // Filter and sort doctors
    const filteredAndSortedDoctors = useMemo(() => {
        let result = allDoctors?.filter(doctor => {
            const doctorSpecialization = doctor.specialization || '';

            // Search filter
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctorSpecialization.toLowerCase().includes(searchTerm.toLowerCase());

            // Specialization filter
            const matchesSpecialization = specializationFilter === "all" ||
                doctorSpecialization === specializationFilter;

            // Type filter
            let matchesType = true;
            if (typeFilter === "executive") {
                matchesType = doctor.is_executive === true;
            } else if (typeFilter === "reguler") {
                matchesType = true;
            }

            // Schedule filter
            let matchesSchedule = true;
            if (scheduleFilter === "today") {
                matchesSchedule = hasScheduleOnDay(doctor, getTodayDayName());
            } else if (scheduleFilter === "tomorrow") {
                matchesSchedule = hasScheduleOnDay(doctor, getTomorrowDayName());
            }

            return matchesSearch && matchesSpecialization && matchesType && matchesSchedule;
        }) || [];

        // Sort
        result = [...result].sort((a, b) => {
            if (sortBy === "name-asc") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "name-desc") {
                return b.name.localeCompare(a.name);
            } else if (sortBy === "schedule") {
                const dateA = getNextScheduleDate(a);
                const dateB = getNextScheduleDate(b);
                return dateA.getTime() - dateB.getTime();
            }
            return 0;
        });

        return result;
    }, [allDoctors, searchTerm, specializationFilter, typeFilter, scheduleFilter, sortBy]);

    // Get unique specializations for filter dropdown
    const specializations = allDoctors ? [...new Set(allDoctors.map(doctor => doctor.specialization).filter(spec => spec !== null && spec !== undefined))] : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
            <ServiceHero
                badge="TIM MEDIS KAMI"
                title="Dokter Spesialis"
                highlightText="Profesional & Ahli"
                subtitle="Temukan dokter spesialis terbaik kami yang siap melayani kebutuhan kesehatan Anda dengan sepenuh hati."
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col items-center mb-8 text-center space-y-4">
                    {/* Doctor Count */}
                    {!isLoading && allDoctors && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Stethoscope className="w-4 h-4 mr-2" />
                            {filteredAndSortedDoctors.length} dari {allDoctors.length} Dokter
                        </div>
                    )}
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Cari dokter berdasarkan nama atau spesialisasi..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Options Row 1: Type & Schedule */}
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        {/* Type Filter */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === 'all'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onClick={() => setTypeFilter('all')}
                            >
                                Semua
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${typeFilter === 'executive'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onClick={() => setTypeFilter('executive')}
                            >
                                <Clock className="h-4 w-4" />
                                Eksekutif
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === 'reguler'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onClick={() => setTypeFilter('reguler')}
                            >
                                Reguler
                            </button>
                        </div>

                        {/* Schedule Filter */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${scheduleFilter === 'all'
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onClick={() => setScheduleFilter('all')}
                            >
                                <Calendar className="h-4 w-4" />
                                Semua Jadwal
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scheduleFilter === 'today'
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onClick={() => setScheduleFilter('today')}
                            >
                                Hari Ini
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scheduleFilter === 'tomorrow'
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onClick={() => setScheduleFilter('tomorrow')}
                            >
                                Besok
                            </button>
                        </div>
                    </div>

                    {/* Filter Options Row 2: Specialization & Sort */}
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        {/* Specialization Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={specializationFilter}
                                onChange={(e) => setSpecializationFilter(e.target.value)}
                            >
                                <option value="all">Semua Spesialisasi</option>
                                {specializations.map((spec, index) => (
                                    <option key={index} value={spec || ''}>
                                        {spec || 'Tidak Diketahui'}
                                    </option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="name-asc">Nama A-Z</option>
                                <option value="name-desc">Nama Z-A</option>
                                <option value="schedule">Jadwal Terdekat</option>
                            </select>
                            <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <DoctorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredAndSortedDoctors && filteredAndSortedDoctors.length > 0 ? (
                            filteredAndSortedDoctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-muted-foreground text-lg">Dokter tidak ditemukan</p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Coba ubah filter atau kata kunci pencarian
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
