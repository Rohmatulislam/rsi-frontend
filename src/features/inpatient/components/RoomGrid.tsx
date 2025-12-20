import React from "react";
import { ArrowLeft, BedDouble } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { InpatientRoom, Building, RoomClass } from "../types";

interface RoomGridProps {
    selectedBuilding: Building;
    selectedClass: RoomClass;
    rooms: InpatientRoom[];
    onSelectRoom: (room: InpatientRoom) => void;
    onBack: () => void;
}

export const RoomGrid: React.FC<RoomGridProps> = ({
    selectedBuilding,
    selectedClass,
    rooms,
    onSelectRoom,
    onBack
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <Button variant="outline" onClick={onBack} className="gap-2 rounded-full px-6">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Kelas
                </Button>
            </div>

            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Pilih Kamar & Bed</h2>
                <p className="text-muted-foreground">
                    Tersedia di {selectedBuilding.name} - {selectedClass.name}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {rooms.map((room) => {
                    const isAvailable = room.status === 'KOSONG';
                    return (
                        <div
                            key={room.id}
                            onClick={() => isAvailable && onSelectRoom(room)}
                            className={`relative group rounded-2xl border p-4 transition-all duration-300 ${isAvailable
                                    ? "cursor-pointer hover:border-primary hover:shadow-lg border-border/60"
                                    : "opacity-60 grayscale cursor-not-allowed bg-muted/30"
                                }`}
                        >
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className={`p-3 rounded-xl ${isAvailable ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                    <BedDouble className="h-6 w-6" />
                                </div>
                                <div className="font-bold text-lg">{room.id}</div>
                                <Badge
                                    variant={isAvailable ? "default" : "outline"}
                                    className={isAvailable ? "bg-green-500 hover:bg-green-600 border-none px-2 text-[10px]" : "px-2 text-[10px]"}
                                >
                                    {isAvailable ? "KOSONG" : "TERISI"}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
