import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

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

export const useDoctorFilters = (allDoctors: any[] | undefined) => {
    const searchParams = useSearchParams();

    const initialExecutiveFilter = searchParams.get('type') === 'executive' ? 'executive' :
        searchParams.get('type') === 'reguler' ? 'reguler' : 'all';

    const initialSpecialty = searchParams.get('specialty') || "all";

    const [searchTerm, setSearchTerm] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState(initialSpecialty);
    const [typeFilter, setTypeFilter] = useState(initialExecutiveFilter);
    const [scheduleFilter, setScheduleFilter] = useState<"all" | "today" | "tomorrow">("all");
    const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "schedule">("name-asc");

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
            return new Date(9999, 11, 31);
        }

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
                matchesType = true; // For now reguler matches all as we don't have is_reguler field
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
    const specializations = useMemo(() => {
        if (!allDoctors) return [];
        return [...new Set(allDoctors.map(doctor => doctor.specialization).filter(spec => spec !== null && spec !== undefined))];
    }, [allDoctors]);

    return {
        searchTerm,
        setSearchTerm,
        specializationFilter,
        setSpecializationFilter,
        typeFilter,
        setTypeFilter,
        scheduleFilter,
        setScheduleFilter,
        sortBy,
        setSortBy,
        filteredAndSortedDoctors,
        specializations
    };
};
