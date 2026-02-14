"use client";

import { useAdminAppointments } from "~/features/admin/api/getAdminAppointments";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Download, Calendar as CalendarIcon, X, Search, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function AdminAppointmentsPage() {
    const queryClient = useQueryClient();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const debouncedSearch = useDebounce(searchQuery, 500);

    const { data: report, isLoading, error } = useAdminAppointments(
        startDate || undefined,
        endDate || undefined,
        debouncedSearch || undefined
    );

    const handleSync = async () => {
        if (!startDate || !endDate) {
            alert("Silakan pilih rentang tanggal terlebih dahulu");
            return;
        }

        try {
            const response = await fetch(`/api/admin/appointments/sync?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
            if (data.success) {
                alert(`Berhasil sinkronisasi ${data.totalSynced} data dari SIMRS`);
                queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
            } else {
                alert("Gagal sinkronisasi data");
            }
        } catch (error) {
            console.error("Sync error:", error);
            alert("Terjadi kesalahan saat sinkronisasi");
        }
    };

    const handleExport = () => {
        if (!report?.appointments) return;

        const headers = ["ID", "Tanggal", "Nama Pasien", "No RM", "Dokter", "Spesialisasi", "Poliklinik", "Penjamin", "Status", "Catatan"];
        const rows = report.appointments.map(app => [
            app.id,
            format(new Date(app.appointmentDate), "yyyy-MM-dd HH:mm"),
            app.patientName,
            app.patientId,
            app.doctor.name,
            app.doctor.specialization,
            app.poliName || app.poliCode || "-",
            app.payerName || "-",
            app.status,
            app.notes || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const dateRangeStr = startDate && endDate ? `${startDate}_to_${endDate}` : format(new Date(), "yyyy-MM-dd");
        const searchSuffix = debouncedSearch ? `_search_${debouncedSearch.replace(/\s+/g, '_')}` : "";

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `report-booking-${dateRangeStr}${searchSuffix}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearchQuery("");
    };

    if (isLoading && !report) return <div className="p-8 text-center text-slate-500">Loading appointments...</div>;

    if (error) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-red-200 rounded-2xl bg-red-50">
                <p className="text-red-600 font-medium">Error loading appointments</p>
                <p className="text-red-500 text-sm mt-1">{(error as any)?.message || 'Terjadi kesalahan sistem'}</p>
            </div>
        );
    }

    const appointments = report?.appointments || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-slate-500">Manage all patient appointments</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search doctor, patient, RM..."
                            className="pl-9 w-full md:w-64 shadow-sm border-slate-200 focus:bg-white transition-all bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full"
                            >
                                <X className="h-3 w-3 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 px-2 shadow-sm">
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        <Input
                            type="date"
                            className="border-0 focus-visible:ring-0 h-8 p-0 text-sm bg-transparent"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="text-slate-300">-</span>
                        <Input
                            type="date"
                            className="border-0 focus-visible:ring-0 h-8 p-0 text-sm bg-transparent"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        {(startDate || endDate) && (
                            <button onClick={clearFilters} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                                <X className="h-3 w-3 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <Button onClick={handleSync} variant="outline" className="gap-2 shadow-sm border-slate-200 text-emerald-600 hover:text-emerald-700">
                        <RefreshCw className="h-4 w-4" />
                        Sync from SIMRS
                    </Button>
                    <Button onClick={handleExport} variant="outline" className="gap-2 shadow-sm border-slate-200">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Patient</th>
                                <th className="p-4 font-medium">Doctor</th>
                                <th className="p-4 font-medium">Poliklinik</th>
                                <th className="p-4 font-medium">Penjamin</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Notes (No. Rawat)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 text-slate-600">
                                        {format(new Date(app.appointmentDate), "dd MMM yyyy HH:mm", { locale: id })}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{app.patientName}</div>
                                        <div className="text-xs text-slate-500">RM: {app.patientId}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{app.doctor.name}</div>
                                        <div className="text-xs text-slate-500">{app.doctor.specialization}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">
                                        {app.poliName || app.poliCode || "-"}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {app.payerName || "-"}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${app.status === 'scheduled' ? 'bg-orange-100 text-orange-700' :
                                            app.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 max-w-xs truncate">
                                        {app.notes}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
