"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
    Upload,
    Pill,
    Truck,
    MapPin,
    Phone,
    User,
    FileText,
    CheckCircle2,
    Loader2,
    ArrowRight
} from "lucide-react";
import { useSubmitPrescription } from "../api/submitPrescription";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";

interface PrescriptionSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrescriptionSubmissionModal = ({
    isOpen,
    onClose
}: PrescriptionSubmissionModalProps) => {
    const { data: session } = authClient.useSession();

    const [step, setStep] = useState(1);
    const [referenceId, setReferenceId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        patientName: "",
        patientPhone: "",
        patientRM: "",
        prescriptionImage: "",
        deliveryMethod: "PICKUP" as "PICKUP" | "DELIVERY",
        address: "",
        note: ""
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submitMutation = useSubmitPrescription({
        mutationConfig: {
            onSuccess: (data) => {
                setReferenceId(data.id);
                setStep(3); // Success step
                toast.success("Resep berhasil dikirim!");
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Gagal mengirim resep. Silakan coba lagi.");
            }
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData({ ...formData, prescriptionImage: base64String });
                setPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!formData.patientName || !formData.patientPhone) {
            toast.error("Nama dan Nomor Telepon wajib diisi.");
            return;
        }
        if (!formData.prescriptionImage) {
            toast.error("Mohon lampirkan foto resep Anda.");
            return;
        }
        if (formData.deliveryMethod === "DELIVERY" && !formData.address) {
            toast.error("Alamat pengiriman wajib diisi.");
            return;
        }

        submitMutation.mutate({
            ...formData,
            userId: session?.user?.id
        });
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            patientName: "",
            patientPhone: "",
            patientRM: "",
            prescriptionImage: "",
            deliveryMethod: "PICKUP",
            address: "",
            note: ""
        });
        setPreview(null);
    };

    const handleClose = () => {
        if (step === 3) resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-[2.5rem]">
                {/* Header Gradient */}
                <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-white relative">
                    <div className="relative z-10">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                                {step === 3 ? "Terkirim!" : "Kirim Resep Digital"}
                            </DialogTitle>
                            <DialogDescription className="text-white/80 text-sm mt-1">
                                {step === 1 && "Lengkapi identitas & upload foto resep fisik Anda."}
                                {step === 2 && "Pilih metode pengambilan obat Anda."}
                                {step === 3 && "Kami telah menerima resep Anda dan segera memprosesnya."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
                </div>

                <div className="p-8 space-y-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider">Nama Pasien</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Nama Lengkap"
                                            className="pl-10 h-12 rounded-xl"
                                            value={formData.patientName}
                                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider">No. WhatsApp</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="0812..."
                                            className="pl-10 h-12 rounded-xl"
                                            value={formData.patientPhone}
                                            onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">No. RM (Opsional)</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Contoh: 12-34-56"
                                        className="pl-10 h-12 rounded-xl"
                                        value={formData.patientRM}
                                        onChange={(e) => setFormData({ ...formData, patientRM: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Foto Resep Fisik</Label>
                                <div
                                    className={cn(
                                        "border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center group cursor-pointer",
                                        preview ? "border-primary/50 bg-primary/5" : "border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                                    )}
                                    onClick={() => document.getElementById("resep-upload")?.click()}
                                >
                                    {preview ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                <p className="text-white text-xs font-bold">Ganti Foto</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                                <Upload className="h-6 w-6" />
                                            </div>
                                            <p className="font-bold text-sm">Klik untuk Upload Resep</p>
                                            <p className="text-xs text-muted-foreground mt-1 text-balance">Format: JPG, PNG, atau PDF (Max 5MB)</p>
                                        </>
                                    )}
                                    <input
                                        id="resep-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-center block">Metode Pengambilan</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, deliveryMethod: "PICKUP" })}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2",
                                            formData.deliveryMethod === "PICKUP"
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-slate-100 hover:border-primary/30"
                                        )}
                                    >
                                        <Pill className={cn("h-6 w-6", formData.deliveryMethod === "PICKUP" ? "text-primary" : "text-slate-400")} />
                                        <p className="font-bold text-sm">Ambil di Apotek</p>
                                        <p className="text-[10px] text-muted-foreground">Tersedia 24 Jam</p>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, deliveryMethod: "DELIVERY" })}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2",
                                            formData.deliveryMethod === "DELIVERY"
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-slate-100 hover:border-primary/30"
                                        )}
                                    >
                                        <Truck className={cn("h-6 w-6", formData.deliveryMethod === "DELIVERY" ? "text-primary" : "text-slate-400")} />
                                        <p className="font-bold text-sm">Antar ke Rumah</p>
                                        <p className="text-[10px] text-muted-foreground">Via RSI-DELIVER</p>
                                    </button>
                                </div>
                            </div>

                            {formData.deliveryMethod === "DELIVERY" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <Label className="text-xs font-bold uppercase tracking-wider">Alamat Lengkap</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            placeholder="Masukkan alamat pengiriman..."
                                            className="pl-10 rounded-xl min-h-[80px]"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Catatan Tambahan (Opsional)</Label>
                                <Textarea
                                    placeholder="Misal: Alergi obat tertentu, minta obat paten/generik..."
                                    className="rounded-xl min-h-[60px]"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-500">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold">Resep Anda Sedang Diverifikasi</h3>
                            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 w-full">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Nomor Referensi (Tracking ID)</p>
                                <p className="text-2xl font-black text-primary tracking-tight">{referenceId?.slice(-8).toUpperCase()}</p>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-[320px]">
                                Apoteker kami akan menghubungi Anda via WhatsApp di **{formData.patientPhone}** untuk konfirmasi harga dan ketersediaan stok.
                            </p>
                            <div className="pt-6 w-full">
                                <div className="bg-slate-50 rounded-2xl p-4 border text-left">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">PENTING</p>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                        *Mohon simpan resep fisik Anda. Apoteker mungkin meminta resep asli saat pengambilan atau pengantaran.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 pt-0">
                    {step === 1 && (
                        <Button
                            className="w-full h-14 rounded-2xl font-bold text-lg"
                            disabled={!formData.patientName || !formData.patientPhone || !formData.prescriptionImage}
                            onClick={() => setStep(2)}
                        >
                            Lanjut ke Pengiriman <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    )}
                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Button
                                variant="outline"
                                className="h-14 rounded-2xl font-bold"
                                onClick={() => setStep(1)}
                            >
                                Kembali
                            </Button>
                            <Button
                                className="h-14 rounded-2xl font-bold"
                                disabled={submitMutation.isPending}
                                onClick={handleSubmit}
                            >
                                {submitMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim...
                                    </>
                                ) : (
                                    "Kirim Sekarang"
                                )}
                            </Button>
                        </div>
                    )}
                    {step === 3 && (
                        <Button
                            className="w-full h-14 rounded-2xl font-bold text-lg"
                            onClick={handleClose}
                        >
                            Selesai
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
