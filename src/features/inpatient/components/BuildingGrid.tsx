import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Building } from "../services/inpatientService";

interface BuildingGridProps {
    buildings: Building[];
    onSelect: (building: Building) => void;
}

export const BuildingGrid: React.FC<BuildingGridProps> = ({ buildings, onSelect }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Gedung Perawatan</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Kami menyediakan berbagai fasilitas gedung perawatan yang dirancang
                    untuk memberikan kenyamanan dan ketenangan selama masa pemulihan Anda.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {buildings.map((building) => (
                    <div
                        key={building.id}
                        onClick={() => onSelect(building)}
                        className="group cursor-pointer bg-card border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className="h-56 relative overflow-hidden bg-muted">
                            <Image
                                src={building.image}
                                alt={building.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30">
                                    {building.classes.length} Pilihan Kelas
                                </Badge>
                            </div>
                        </div>
                        <div className="p-7">
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{building.name}</h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">{building.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-card ${building.color} opacity-${100 - (i * 20)}`} />
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2 text-primary font-bold group-hover:pl-4 transition-all">
                                    Lihat Rincian <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
