"use client";

import { useState, useMemo } from "react";
import { BedDouble, Eye, EyeOff, Search, Loader2 } from "lucide-react";
import { useGetRooms } from "~/features/inpatient/api/getRooms";
import { useExcludedBeds, useExcludeBed, useUnexcludeBed } from "../api/bedExclusions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

export const BedManagement = () => {
    const { data: rooms, isLoading: roomsLoading } = useGetRooms();
    const { data: excludedBeds, isLoading: excludedLoading } = useExcludedBeds();
    const excludeBed = useExcludeBed();
    const unexcludeBed = useUnexcludeBed();

    const [search, setSearch] = useState("");

    const excludedIds = useMemo(() =>
        new Set(excludedBeds?.map(b => b.id) || []),
        [excludedBeds]);

    const filteredRooms = useMemo(() => {
        if (!rooms) return [];
        return rooms.filter(room =>
            room.id.toLowerCase().includes(search.toLowerCase()) ||
            room.unitName.toLowerCase().includes(search.toLowerCase()) ||
            room.class.toLowerCase().includes(search.toLowerCase())
        );
    }, [rooms, search]);

    const isLoading = roomsLoading || excludedLoading;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Bed & Kamar</h2>
                    <p className="text-muted-foreground">
                        Sembunyikan bed tertentu agar tidak muncul di halaman publik
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari ID Bed, Unit, atau Kelas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRooms.map((room) => {
                    const isHidden = excludedIds.has(room.id);
                    const isPending = (excludeBed.isPending && excludeBed.variables?.id === room.id) ||
                        (unexcludeBed.isPending && unexcludeBed.variables === room.id);

                    return (
                        <Card key={room.id} className={`${isHidden ? "bg-slate-50 opacity-80 border-dashed" : ""} transition-all`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${isHidden ? "bg-slate-200 text-slate-500" : "bg-primary/10 text-primary"}`}>
                                            <BedDouble className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{room.id}</CardTitle>
                                            <CardDescription className="text-xs uppercase font-bold tracking-wide">
                                                {room.unitName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={isHidden ? "outline" : "default"} className={isHidden ? "text-slate-400" : "bg-green-500"}>
                                        {isHidden ? "Hidden" : room.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-medium text-muted-foreground">Kelas: {room.class}</span>
                                    <Button
                                        variant={isHidden ? "ghost" : "outline"}
                                        size="sm"
                                        className="h-8 px-3 gap-2"
                                        disabled={isPending}
                                        onClick={() => {
                                            if (isHidden) unexcludeBed.mutate(room.id);
                                            else excludeBed.mutate({ id: room.id, reason: "Manual Hide" });
                                        }}
                                    >
                                        {isPending ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : isHidden ? (
                                            <><Eye className="h-3 w-3" /> Tampilkan</>
                                        ) : (
                                            <><EyeOff className="h-3 w-3" /> Sembunyikan</>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredRooms.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50">
                    <p className="text-muted-foreground font-medium">Tidak ada bed yang ditemukan</p>
                </div>
            )}
        </div>
    );
};
