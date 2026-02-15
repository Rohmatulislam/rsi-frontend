import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DoctorDto } from "~/features/home/api/getDoctors";
import { useCreateDoctorException, useDeleteDoctorException, useGetDoctorExceptions } from "../api/doctorExceptions";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Loader2, Trash2, Calendar as CalendarIcon, UserX, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface DoctorScheduleExceptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: DoctorDto | null;
}

export const DoctorScheduleExceptionModal = ({ isOpen, onClose, doctor }: DoctorScheduleExceptionModalProps) => {
    const { data: exceptions, isLoading } = useGetDoctorExceptions(doctor?.id || "");
    const { mutate: createException, isPending: isCreating } = useCreateDoctorException();
    const { mutate: deleteException, isPending: isDeleting } = useDeleteDoctorException();

    const [date, setDate] = useState("");
    const [type, setType] = useState<"LEAVE" | "RESCHEDULE">("LEAVE");
    const [note, setNote] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleCreate = () => {
        if (!doctor || !date || (type === 'RESCHEDULE' && (!startTime || !endTime))) return;

        createException({
            doctorId: doctor.id,
            date: new Date(date).toISOString(),
            type,
            note,
            startTime,
            endTime
        }, {
            onSuccess: () => {
                setDate("");
                setNote("");
                setStartTime("");
                setEndTime("");
                // Optional: show toast
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Hapus jadwal khusus ini?")) {
            deleteException(id);
        }
    };

    if (!doctor) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Kelola Jadwal Khusus: {doctor.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="space-y-4 border-r pr-6">
                        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Tambah Jadwal Khusus</h3>

                        <div className="space-y-2">
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Jenis Perubahan</Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LEAVE">Cuti / Libur</SelectItem>
                                    <SelectItem value="RESCHEDULE">Ganti Jam (Reschedule)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {type === 'RESCHEDULE' && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>Jam Mulai</Label>
                                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jam Selesai</Label>
                                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Catatan (Alasan)</Label>
                            <Textarea
                                placeholder="Contoh: Cuti Tahunan, Seminar, Sakit"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleCreate}
                            disabled={isCreating || !date || !date}
                            className="w-full"
                        >
                            {isCreating ? <Loader2 className="animate-spin mr-2" /> : <PlusIcon className="w-4 h-4 mr-2" />}
                            Simpan Jadwal Khusus
                        </Button>

                        <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>
                                Menambahkan jadwal "Cuti/Libur" akan otomatis menonaktifkan jadwal dokter pada tanggal tersebut tanpa mengubah jadwal mingguan utama.
                            </p>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Daftar Jadwal Khusus</h3>

                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="animate-spin text-slate-400" />
                            </div>
                        ) : exceptions?.length === 0 ? (
                            <div className="text-center p-8 text-slate-400 border-2 border-dashed rounded-lg">
                                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Belum ada jadwal khusus</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {exceptions?.map((ex: any) => (
                                    <div key={ex.id} className="bg-white border rounded-lg p-3 shadow-sm flex justify-between items-start group hover:border-slate-300 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900">
                                                    {format(new Date(ex.date), "EEEE, d MMMM yyyy", { locale: idLocale })}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ex.type === 'LEAVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {ex.type === 'LEAVE' ? 'LIBUR' : 'RESCHEDULE'}
                                                </span>
                                            </div>
                                            {ex.note && (
                                                <p className="text-sm text-slate-500 flex items-start gap-1">
                                                    <span className="shrink-0">•</span> {ex.note}
                                                </p>
                                            )}
                                            {ex.type === 'RESCHEDULE' && (
                                                <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {ex.startTime} - {ex.endTime}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(ex.id)}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);
