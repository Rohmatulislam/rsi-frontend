"use client";

import { Eye, FileText, CheckCircle2, Clock, XCircle, ShoppingBag } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { DiagnosticOrder } from "../api/getDiagnosticOrders";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface DiagnosticOrderTableProps {
    orders: DiagnosticOrder[] | undefined;
    isLoading: boolean;
}

export function DiagnosticOrderTable({ orders, isLoading }: DiagnosticOrderTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
            case "CONFIRMED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "COMPLETED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "PAID": return "bg-emerald-500 text-white";
            case "UNPAID": return "bg-slate-200 text-slate-600";
            case "EXPIRED":
            case "FAILED": return "bg-rose-500 text-white";
            default: return "bg-slate-500 text-white";
        }
    };

    return (
        <Card className="border-none shadow-md overflow-hidden ring-1 ring-border">
            <CardHeader className="bg-secondary border-b border-border py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Riwayat Transaksi Diagnostik
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Order ID & Pasien</th>
                                    <th className="px-6 py-4">Tgl Kunjungan</th>
                                    <th className="px-6 py-4">Item & Total</th>
                                    <th className="px-6 py-4">Status Bayar</th>
                                    <th className="px-6 py-4">Status Pesanan</th>
                                    <th className="px-6 py-4 text-right">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders?.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-slate-900">{order.orderNumber}</span>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <span>{order.patientName}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                    <span>RM: {order.patientId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                    <Clock className="h-3 w-3 text-primary" />
                                                    {format(new Date(order.scheduledDate), "dd MMM yyyy", { locale: localeId })}
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-4.5">
                                                    {order.timeSlot}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-wrap gap-1">
                                                    {order.items.slice(0, 2).map((item) => (
                                                        <Badge key={item.id} variant="outline" className="text-[9px] py-0 font-medium whitespace-nowrap">
                                                            {item.name}
                                                        </Badge>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <Badge variant="outline" className="text-[9px] py-0 font-medium">
                                                            +{order.items.length - 2} lainnya
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="font-black text-primary">
                                                    Rp {order.totalAmount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-[10px] font-black border-none shadow-sm`}>
                                                {order.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`${getStatusColor(order.status)} text-[10px] font-bold border-none`}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!orders || orders.length === 0) && (
                            <div className="text-center py-20 bg-muted/10 flex flex-col items-center gap-3">
                                <div className="p-4 rounded-full bg-slate-100">
                                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-slate-400 font-medium italic">Belum ada pesanan diagnostik yang tercatat.</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
