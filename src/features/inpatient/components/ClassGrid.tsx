import React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, ImageIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { InpatientUnit, RoomClass } from "../services/inpatientService";

interface ClassGridProps {
    selectedUnit: InpatientUnit;
    onSelectClass: (cls: RoomClass) => void;
    onBack: () => void;
}

export const ClassGrid: React.FC<ClassGridProps> = ({ selectedUnit, onSelectClass, onBack }) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <Button variant="outline" onClick={onBack} className="gap-2 rounded-full px-6">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                <div className="lg:col-span-4">
                    <div className="sticky top-24">
                        <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl mb-6">
                            <Image
                                src={selectedUnit.image}
                                alt={selectedUnit.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                                {selectedUnit.name}
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" /> Informasi Unit
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {selectedUnit.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <h3 className="text-2xl font-bold mb-8">Tipe Kelas & Kamar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedUnit.classes.map((cls) => (
                            <div
                                key={cls.name}
                                onClick={() => onSelectClass(cls)}
                                className="group cursor-pointer bg-card border border-border/60 hover:border-primary/50 hover:bg-primary/[0.02] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
                            >
                                <div className="h-48 relative bg-muted overflow-hidden">
                                    {cls.imageUrl ? (
                                        <Image
                                            src={cls.imageUrl}
                                            alt={cls.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-30">
                                            <ImageIcon className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-primary/90 text-white border-none px-4 py-1 font-bold backdrop-blur-sm">
                                            {cls.price}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-7 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{cls.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-1 font-medium">{cls.capacity}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-8">
                                        {cls.facilities.slice(0, 4).map((fac, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-primary opacity-60" />
                                                <span>{fac}</span>
                                            </div>
                                        ))}
                                        {cls.facilities.length > 4 && (
                                            <p className="text-xs text-primary font-semibold pl-7">
                                                +{cls.facilities.length - 4} Fasilitas Lainnya
                                            </p>
                                        )}
                                    </div>
                                    <Button className="w-full mt-auto gap-2 rounded-xl group-hover:bg-primary transition-all">
                                        Pilih Kamar Ini <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
