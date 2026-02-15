"use client";

import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { useCreateSchedule, CreateScheduleDto } from "~/features/admin/api/schedules/createSchedule";
import { useDeleteSchedule } from "~/features/admin/api/schedules/deleteSchedule";
import { useSyncDoctors } from "~/features/admin/api/syncDoctors";
import { useState } from "react";
import { Search, Clock, CalendarDays, Plus, Trash2, X, Save, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function AdminSchedulesPage() {
    const { data: doctors, isLoading } = useGetDoctorsList({
        input: { limit: 1000 }
    });

    const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule();
    const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteSchedule();
    const { mutate: syncDoctors, isPending: isSyncing } = useSyncDoctors();

    const [search, setSearch] = useState("");
    const [addingToDocId, setAddingToDocId] = useState<string | null>(null);
    const [newSchedule, setNewSchedule] = useState<CreateScheduleDto>({
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "16:00"
    });

    const filteredDoctors = doctors?.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.kd_dokter && d.kd_dokter.toLowerCase().includes(search.toLowerCase()))
    ) || [];

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const getNextDate = (dayOfWeek: number) => {
        const today = new Date();
        const resultDate = new Date(today.getTime());
        resultDate.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7);
        // If today is the day and it's heavily passed, we might want next week, but for now simple logic:
        // if today is Monday and schedule is Monday, it returns today.
        return resultDate;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleAddClick = (docId: string) => {
        setAddingToDocId(docId);
        setNewSchedule({ dayOfWeek: 1, startTime: "08:00", endTime: "12:00" });
    };

    const handleSaveSchedule = (docId: string) => {
        createSchedule({
            doctorId: docId,
            data: newSchedule
        }, {
            onSuccess: () => {
                setAddingToDocId(null);
            }
        });
    };

    const handleDeleteSchedule = (schedId: string) => {
        if (confirm("Are you sure you want to remove this schedule slot?")) {
            deleteSchedule(schedId);
        }
    };

    const handleSync = () => {
        if (confirm("Sinkronisasi jadwal dengan Khanza sekarang? (Akan mengirim notifikasi perubahan jika ada)")) {
            syncDoctors();
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Jadwal Dokter</h1>
                    <p className="text-slate-500">Lihat dan kelola jadwal praktek dokter</p>
                </div>
                <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    variant="outline"
                    className="gap-2 border-primary text-primary hover:bg-primary/5"
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sedang Sinkronisasi...' : 'Sinkronisasi Jadwal'}
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Cari dokter..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                                <p className="text-sm text-slate-500">{doc.specialization}</p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                                {doc.kd_dokter}
                            </span>
                        </div>
                        <div className="p-4 flex-1">
                            {doc.schedules && doc.schedules.length > 0 ? (
                                <div className="space-y-2">
                                    {doc.schedules
                                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                        .map((sched, idx) => {
                                            const nextDate = getNextDate(sched.dayOfWeek);
                                            // Find poli name from scheduleDetails if available
                                            const poliDetail = doc.scheduleDetails?.find(d => d.kd_poli === sched.kd_poli);
                                            const poliName = poliDetail?.nm_poli || sched.kd_poli || 'Umum';

                                            return (
                                                <div key={sched.id || idx} className="flex items-center justify-between text-sm gap-3 group bg-slate-50 p-3 rounded-lg border border-slate-100/60 hover:border-slate-200 transition-colors">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                                                            <CalendarDays className="w-3.5 h-3.5 text-primary" />
                                                            <span>{days[sched.dayOfWeek]}, {formatDate(nextDate)}</span>
                                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-tight">
                                                                {poliName.replace('Poliklinik ', '').replace('Kandungan ', '')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500 text-xs ml-5">
                                                            <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{sched.startTime.slice(0, 5)} - {sched.endTime.slice(0, 5)} WIB</span>
                                                            </div>
                                                            <span className="text-slate-300">|</span>
                                                            <span className="text-slate-400 italic">Rutin</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteSchedule(sched.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-white text-red-500 hover:text-red-600 hover:bg-red-50 rounded shadow-sm border border-slate-200 transition-all"
                                                        title="Hapus jadwal"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 text-sm italic">
                                    Belum ada jadwal
                                </div>
                            )}

                            {addingToDocId === doc.id ? (
                                <div className="mt-4 p-3 border border-blue-100 bg-blue-50 rounded-lg space-y-3">
                                    <div className="text-xs font-semibold text-blue-700">Tambah Jadwal</div>
                                    <select
                                        className="w-full p-2 rounded border border-blue-200 text-sm"
                                        value={newSchedule.dayOfWeek}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: parseInt(e.target.value) })}
                                    >
                                        {days.map((day, idx) => (
                                            <option key={idx} value={idx}>{day}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            className="w-full p-2 rounded border border-blue-200 text-sm"
                                            value={newSchedule.startTime}
                                            onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                                        />
                                        <span className="text-slate-400">-</span>
                                        <input
                                            type="time"
                                            className="w-full p-2 rounded border border-blue-200 text-sm"
                                            value={newSchedule.endTime}
                                            onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setAddingToDocId(null)}
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleSaveSchedule(doc.id)}
                                        >
                                            <Save className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => handleAddClick(doc.id)}
                                    variant="outline"
                                    className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-sm border-dashed"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah Slot</span>
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    Tidak ada dokter ditemukan
                </div>
            )}
        </div>
    );
}
