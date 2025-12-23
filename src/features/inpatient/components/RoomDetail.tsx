import React from "react";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ServiceCTA } from "~/features/services";
import { InpatientUnit, RoomClass, InpatientRoom } from "../services/inpatientService";

interface RoomDetailProps {
    selectedUnit: InpatientUnit;
    selectedClass: RoomClass;
    selectedRoom: InpatientRoom | null;
    onBack: () => void;
    whatsappLink: (room?: string) => string;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({
    selectedUnit,
    selectedClass,
    selectedRoom,
    onBack,
    whatsappLink
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" onClick={onBack} className="gap-2 rounded-full px-6">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>
            </div>

            <div className="bg-card border rounded-[2rem] overflow-hidden shadow-2xl border-border/40">
                <div className="h-96 relative">
                    <Image
                        src={selectedClass.imageUrl || selectedUnit.image}
                        alt={selectedClass.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row items-end justify-between text-white z-10">
                        <div className="text-left mb-6 md:mb-0">
                            <Badge className="mb-4 bg-primary text-white border-none px-4 py-1">
                                {selectedUnit.name} {selectedRoom ? `- ${selectedRoom.id}` : ""}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold">{selectedClass.name}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-80 mb-1 font-medium">Tarif Layanan</p>
                            <p className="text-4xl font-black text-white">
                                {selectedRoom
                                    ? `Rp ${selectedRoom.price.toLocaleString('id-ID')} / malam`
                                    : selectedClass.price}
                            </p>
                            <p className="text-xs opacity-60 mt-1">*Tarif per malam, belum termasuk tindakan & obat</p>
                        </div>
                    </div>
                </div>

                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Users className="h-8 w-8 text-primary mb-4" />
                            <p className="text-sm text-muted-foreground font-medium mb-1">Kapasitas Pasien</p>
                            <p className="font-bold text-xl">{selectedClass.capacity}</p>
                        </div>
                        <div className="md:col-span-2 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" /> Fasilitas Kamar
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedClass.facilities.map((fac, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {fac}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] p-10 border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold mb-2">Konfirmasi Pemesanan</h3>
                                <p className="text-muted-foreground">
                                    Silakan hubungi tim pendaftaran kami untuk melakukan reservasi di {selectedUnit.name} - {selectedClass.name}.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <Button
                                    size="lg"
                                    className="rounded-xl h-14 px-10 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    onClick={() => window.open(whatsappLink(`${selectedClass.name}${selectedRoom ? ` - ${selectedRoom.id}` : ""} (${selectedUnit.name})`), '_blank')}
                                >
                                    Hubungi Admission
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-xl h-14 px-8 border-primary/20 hover:bg-primary/5 text-primary" onClick={onBack}>
                                    Pilih Tipe Lain
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
