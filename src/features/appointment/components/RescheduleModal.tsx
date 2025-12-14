"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Calendar, Clock, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { useRescheduleAppointment } from "../api/rescheduleAppointment";
import { toast } from "sonner";

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string;
    doctorName: string;
    currentDate: string;
    onSuccess: () => void;
}

export const RescheduleModal = ({
    isOpen,
    onClose,
    appointmentId,
    doctorName,
    currentDate,
    onSuccess,
}: RescheduleModalProps) => {
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const rescheduleMutation = useRescheduleAppointment();

    // Calculate min date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    // Calculate max date (2 weeks from now)
    const maxDateObj = new Date();
    maxDateObj.setDate(maxDateObj.getDate() + 14);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    const handleSubmit = async () => {
        if (!newDate) {
            toast.error("Pilih tanggal baru");
            return;
        }

        rescheduleMutation.mutate(
            {
                appointmentId,
                data: {
                    newDate,
                    newTime: newTime || undefined
                }
            },
            {
                onSuccess: (data) => {
                    toast.success("Jadwal berhasil diubah", {
                        description: `Jadwal baru: ${data.newDate} pukul ${data.newTime}`,
                    });
                    onSuccess();
                    onClose();
                    setNewDate("");
                    setNewTime("");
                },
                onError: (error: any) => {
                    toast.error("Gagal mengubah jadwal", {
                        description: error?.response?.data?.message || "Silakan coba lagi.",
                    });
                },
            }
        );
    };

    const handleClose = () => {
        setNewDate("");
        setNewTime("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Ubah Jadwal Booking
                    </DialogTitle>
                    <DialogDescription>
                        Ubah jadwal janji temu dengan <strong>{doctorName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current date info */}
                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Jadwal saat ini:</p>
                        <p className="font-medium">{currentDate}</p>
                    </div>

                    {/* New Date */}
                    <div className="space-y-2">
                        <Label htmlFor="newDate">Tanggal Baru *</Label>
                        <Input
                            id="newDate"
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            min={minDate}
                            max={maxDate}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Pilih tanggal dalam 14 hari ke depan
                        </p>
                    </div>

                    {/* New Time */}
                    <div className="space-y-2">
                        <Label htmlFor="newTime" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Waktu Baru (Opsional)
                        </Label>
                        <Input
                            id="newTime"
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Kosongkan jika ingin mempertahankan waktu yang sama
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!newDate || rescheduleMutation.isPending}
                    >
                        {rescheduleMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Mengubah...
                            </>
                        ) : (
                            "Ubah Jadwal"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
