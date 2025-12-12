"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DoctorCard } from "~/components/shared/DoctorCard";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { Stethoscope, Search, Filter, Clock } from "lucide-react";

export const DoctorListPage = () => {
    const searchParams = useSearchParams();
    const initialExecutiveFilter = searchParams.get('type') === 'executive' ? 'executive' :
        searchParams.get('type') === 'reguler' ? 'reguler' : 'all';

    const [searchTerm, setSearchTerm] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState(initialExecutiveFilter);

    const { data: allDoctors, isLoading } = useGetDoctorsList({
        input: {
            limit: 1000,
        } as any, // Type assertion untuk menghindari error TypeScript
    });

    // Filter doctors based on selected filters
    const filteredDoctors = allDoctors?.filter(doctor => {
        const doctorSpecialization = doctor.specialization || '';
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorSpecialization.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialization = specializationFilter === "all" ||
            doctorSpecialization === specializationFilter;

        let matchesType = true;
        if (typeFilter === "executive") {
            // For executive clinic, only show executive doctors
            matchesType = doctor.is_executive === true;
        } else if (typeFilter === "reguler") {
            // For regular clinic, show all doctors (both regular and executive)
            matchesType = true;
        }
        // For "all", matchesType remains true

        return matchesSearch && matchesSpecialization && matchesType;
    }) || [];

    // Get unique specializations for filter dropdown
    const specializations = allDoctors ? [...new Set(allDoctors.map(doctor => doctor.specialization).filter(spec => spec !== null && spec !== undefined))] : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-12 text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            Daftar Dokter
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Pilih kategori poli untuk menampilkan dokter yang sesuai kebutuhan Anda
                        </p>

                        {/* Doctor Count */}
                        {!isLoading && allDoctors && (
                            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400">
                                {allDoctors.length} Dokter Tersedia
                            </div>
                        )}
                    </div>
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

                    {/* Filter Options */}
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

                        {/* Specialization Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-4 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-3xl h-[400px]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredDoctors && filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-muted-foreground text-lg">Dokter tidak ditemukan</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
