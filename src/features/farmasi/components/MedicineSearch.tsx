"use client";

import { useState } from "react";
import { Search, Loader2, Package, Info } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { useSearchMedicines } from "../api/searchMedicines";
import { useDebounce } from "~/hooks/use-debounce";

export const MedicineSearch = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const { data: results, isLoading, isFetched } = useSearchMedicines(debouncedQuery);

    return (
        <div className="bg-white dark:bg-slate-900 border rounded-[2.5rem] p-8 md:p-12 shadow-xl border-primary/10 mb-12">
            <div className="max-w-2xl mx-auto text-center mb-10">
                <Badge className="mb-4 bg-primary/10 text-primary border-none px-4 py-1 font-bold">Stock Check</Badge>
                <h2 className="text-3xl font-bold mb-4">Cek Ketersediaan Obat</h2>
                <p className="text-muted-foreground">Ketik nama obat untuk mengecek ketersediaan stok di unit Farmasi RSI secara real-time.</p>
            </div>

            <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    placeholder="Cari Paracetamol, Vitamin C, dsb..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 pl-12 pr-4 rounded-2xl border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {isFetched && results && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                    {results.map((item) => (
                        <div key={item.id} className="p-5 border rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between group hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.category} • {item.unit}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant={Number(item.total_stock) > 0 ? "default" : "destructive"}>
                                    {Number(item.total_stock) > 0 ? `Stok: ${item.total_stock}` : "Kosong"}
                                </Badge>
                                <p className="text-[10px] text-muted-foreground mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFetched && results && results.length === 0 && debouncedQuery.length >= 3 && (
                <div className="text-center p-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-dashed border-2">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Obat "{debouncedQuery}" tidak ditemukan atau stok kosong.</p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-muted-foreground italic">
                    * Data stok diperbarui otomatis dari sistem gudang farmasi pusat.
                </p>
            </div>
        </div>
    );
};
