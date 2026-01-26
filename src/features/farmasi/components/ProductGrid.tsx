"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Medicine } from "../api/searchMedicines";
import { Package, ShoppingCart, Loader2, Info, ChevronRight, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { axiosInstance } from "~/lib/axios";

const categories = [
    { id: 'OTC', name: 'Obat Bebas', icon: 'Pill' },
    { id: 'VIT', name: 'Vitamin & Suplemen', icon: 'ShieldCheck' },
    { id: 'KID', name: 'Ibu & Anak', icon: 'Heart' },
    { id: 'ALKES', name: 'Alat Kesehatan', icon: 'Activity' },
];

export const ProductGrid = () => {
    const [activeCategory, setActiveCategory] = useState(categories[1].id); // Default to Vitamins
    const [items, setItems] = useState<Medicine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const { data } = await axiosInstance.get(`/farmasi/items/${activeCategory}`);
                setItems(data);
            } catch (e) {
                console.error("Failed to fetch products", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, [activeCategory]);

    return (
        <div className="space-y-10">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${activeCategory === cat.id
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-card border border-border/40 text-muted-foreground hover:border-primary/20 hover:bg-slate-50"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group bg-card border border-border/40 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
                            {/* Image Placeholder */}
                            <div className="aspect-square bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                                {(item as any).image ? (
                                    <img src={(item as any).image} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <Package className="h-16 w-16 text-muted-foreground/10 group-hover:scale-110 transition-transform duration-700" />
                                )}
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 border-none backdrop-blur shadow-sm uppercase text-[8px] font-black">
                                        {item.category || categories.find(c => c.id === activeCategory)?.name}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="mb-4">
                                    <h4 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">{item.name}</h4>
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{item.unit}</p>
                                </div>
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-0.5 opacity-60">Harga</p>
                                            <p className="text-xl font-black text-primary">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                        </div>
                                        <Badge variant={Number(item.total_stock) > 0 ? "outline" : "destructive"} className="h-6 rounded-lg text-[9px] border-primary/20">
                                            {Number(item.total_stock) > 0 ? `Stok Ready` : "Stok Habis"}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => addToCart(item)}
                                        disabled={Number(item.total_stock) <= 0}
                                        className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/5 hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="h-4 w-4" /> Beli Sekarang
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-border/40">
                    <Info className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Produk Tidak Tersedia</h3>
                    <p className="text-muted-foreground">Maaf, saat ini belum ada produk yang tersedia di kategori ini.</p>
                </div>
            )}
        </div>
    );
};
