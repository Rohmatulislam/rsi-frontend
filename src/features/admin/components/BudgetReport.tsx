"use client";

import { useBudgets, useBudgetVariance, useUpsertBudget, useDeleteBudget, BudgetVariance } from "../api/getFinanceReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, PieChart, AlertCircle, Plus, Trash2, Edit2, Check, X, Target, BarChart4 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { formatRupiah } from "../utils/exportCSV";
import { toast } from "sonner";

interface BudgetReportProps {
    period: string;
    date: string;
}

export const BudgetReport = ({ period, date }: BudgetReportProps) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = period === 'monthly' ? d.getMonth() + 1 : undefined;

    const { data: variance, isLoading, error, refetch } = useBudgetVariance(period, year, month);
    const { mutateAsync: upsertBudget } = useUpsertBudget();
    const { mutateAsync: deleteBudget } = useDeleteBudget();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        notes: ""
    });

    const handleSave = async () => {
        try {
            if (!formData.category || !formData.amount) {
                toast.error("Kategori dan Jumlah harus diisi");
                return;
            }

            await upsertBudget({
                category: formData.category,
                amount: parseFloat(formData.amount),
                period,
                year,
                month,
                notes: formData.notes
            });

            toast.success("Anggaran berhasil disimpan");
            setIsAdding(false);
            setEditingId(null);
            setFormData({ category: "", amount: "", notes: "" });
            refetch();
        } catch (err) {
            toast.error("Gagal menyimpan anggaran");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus anggaran ini?")) return;
        try {
            await deleteBudget(id);
            toast.success("Anggaran dihapus");
            refetch();
        } catch (err) {
            toast.error("Gagal menghapus anggaran");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Memuat data anggaran...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <AlertCircle className="h-8 w-8" />
                <p className="text-sm font-medium">Gagal memuat data anggaran.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Manajemen Anggaran</h3>
                    <p className="text-sm text-muted-foreground">
                        Monitoring perbandingan anggaran vs realita (Variance Analysis)
                    </p>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Anggaran
                </Button>
            </div>

            {isAdding && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori / Nama Akun</label>
                                <Input
                                    placeholder="Contoh: Gaji, Listrik, atau Total"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Anggaran (Rp)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catatan (Opsional)</label>
                                <Input
                                    placeholder="..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="flex-1">Simpan</Button>
                                <Button variant="outline" onClick={() => setIsAdding(false)}><X className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {variance && variance.length > 0 ? (
                    variance.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-primary" />
                                                <h4 className="font-bold text-lg">{item.category}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => {
                                                    setEditingId(item.id);
                                                    setFormData({ category: item.category, amount: item.budget.toString(), notes: item.notes || "" });
                                                    setIsAdding(true);
                                                }}>
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Anggaran</p>
                                                <p className="font-mono text-sm font-bold text-primary">{formatRupiah(item.budget)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Realisasi</p>
                                                <p className="font-mono text-sm font-bold">{formatRupiah(item.actual)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Selisih</p>
                                                <p className={`font-mono text-sm font-bold ${item.variance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {item.variance < 0 ? '-' : '+'}{formatRupiah(Math.abs(item.variance))}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Persentase Serapan</span>
                                                <span className={`font-bold ${item.percentage > 100 ? 'text-rose-500' : 'text-primary'}`}>
                                                    {item.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <Progress value={Math.min(item.percentage, 100)} className={`h-2 ${item.percentage > 100 ? 'bg-rose-100 [&>div]:bg-rose-500' : ''}`} />
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl min-w-[120px]">
                                        <BarChart4 className={`h-8 w-8 mb-2 ${item.percentage > 100 ? 'text-rose-500' : 'text-emerald-500'}`} />
                                        <p className="text-[10px] uppercase font-black text-muted-foreground">Status</p>
                                        <p className={`text-xs font-bold text-center ${item.percentage > 100 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {item.percentage > 100 ? 'Over Budget' : 'Safe'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                        <PieChart className="h-10 w-10 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-sm font-bold text-muted-foreground">Belum ada target anggaran</p>
                            <p className="text-xs text-muted-foreground">Klik tombol "Tambah Anggaran" untuk memulai monitoring.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
