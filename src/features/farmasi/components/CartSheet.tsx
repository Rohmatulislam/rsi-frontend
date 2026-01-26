"use client";

import { useCart } from "../context/CartContext";
import { Package, ShoppingCart, Plus, Minus, X, ArrowRight, Truck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";

export const CartSheet = () => {
    const { items, removeFromCart, updateQuantity, totalPrice, isOpen, toggleCart, totalCount } = useCart();

    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            Keranjang Belanja
                        </SheetTitle>
                        <Badge variant="secondary" className="rounded-full">{totalCount} Item</Badge>
                    </div>
                    <SheetDescription>
                        Tinjau obat-obatan yang Anda pilih sebelum melanjutkan ke pengiriman.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {items.length > 0 ? (
                        <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/10">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-border/40 group-hover:border-primary/20 transition-colors">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-2xl" />
                                            ) : (
                                                <Package className="h-8 w-8 text-muted-foreground/40" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm leading-tight pr-4">{item.name}</h4>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.unit}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-900 h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="px-2 hover:text-primary transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="px-2 hover:text-primary transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <p className="font-bold text-sm text-primary">
                                                    Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                <ShoppingCart className="h-10 w-10 text-muted-foreground/20" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Keranjang Kosong</h3>
                                <p className="text-sm text-muted-foreground">Belum ada obat yang Anda tambahkan ke keranjang.</p>
                            </div>
                            <Button variant="outline" onClick={() => toggleCart(false)} className="rounded-xl">
                                Mulai Belanja
                            </Button>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="p-6 bg-slate-50 dark:bg-slate-900 border-t flex-col sm:flex-col gap-4">
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Biaya Pengiriman (Estimasi)</span>
                                <span className="text-green-500 font-bold">Gratis*</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg">
                                <span className="font-black">Total Pembayaran</span>
                                <span className="font-black text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <Button className="w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-primary/20 group">
                            Checkout Sekarang <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center">
                            <Truck className="h-3 w-3" />
                            <span>Pengiriman via RSI-DELIVER (Area Mataram)</span>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};
