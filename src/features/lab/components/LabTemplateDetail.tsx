"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "~/components/ui/sheet";
import { useLabTemplate } from "../api/getLabTemplate";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Info, FlaskConical, Beaker, Activity } from "lucide-react";

interface LabTemplateDetailProps {
    templateId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LabTemplateDetail = ({ templateId, open, onOpenChange }: LabTemplateDetailProps) => {
    const { data: template, isLoading } = useLabTemplate({ id: templateId });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
                <SheetHeader className="sr-only">
                    <SheetTitle>Detail Pemeriksaan Laboratorium</SheetTitle>
                    <SheetDescription>Informasi detail parameter pemeriksaan laboratorium</SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="space-y-6 pt-6 text-left">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Separator />
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                ) : template ? (
                    <div className="space-y-6 pt-6 text-left">
                        <div className="space-y-2">
                            <Badge variant="outline" className="w-fit mb-2">{template.kategori}</Badge>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FlaskConical className="h-6 w-6 text-primary" />
                                {template.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Bagian dari pemeriksaan: <span className="font-semibold text-foreground">{template.parent_name}</span>
                            </p>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Estimasi Biaya</span>
                                <span className="text-xl font-bold text-primary">
                                    Rp {template.price.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Info className="h-4 w-4" /> Informasi Medis
                            </h4>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-3 border rounded-lg bg-muted/30">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Satuan</p>
                                    <p className="font-medium">{template.unit || "-"}</p>
                                </div>

                                <div className="p-4 border rounded-lg space-y-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Nilai Rujukan
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Laki-laki Dewasa</p>
                                            <p className="text-sm">{template.ref_ld || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Perempuan Dewasa</p>
                                            <p className="text-sm">{template.ref_pd || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Laki-laki Anak</p>
                                            <p className="text-sm">{template.ref_la || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Perempuan Anak</p>
                                            <p className="text-sm">{template.ref_pa || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Beaker className="h-4 w-4" /> Persiapan & Prosedur
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Prosedur pemeriksaan ini dilakukan dengan pengambilan sampel (darah/urin/feses) oleh petugas laboratorium terlatih. Harap berkonsultasi dengan dokter untuk instruksi persiapan khusus (seperti puasa) jika diperlukan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="pt-20 text-center">
                        <p className="text-muted-foreground">Detail pemeriksaan tidak ditemukan.</p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
