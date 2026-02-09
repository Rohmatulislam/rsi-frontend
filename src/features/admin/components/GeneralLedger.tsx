"use client";

import { useLedger, useAccounts } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, Search, Book, ArrowRight, History } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface GeneralLedgerProps {
    startDate: string;
    endDate: string;
}

export const GeneralLedger = ({ startDate, endDate }: GeneralLedgerProps) => {
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const { data: accounts, isLoading: loadingAccounts } = useAccounts();
    const { data: ledgerData, isLoading: loadingLedger, error } = useLedger(selectedAccount, startDate, endDate);

    if (loadingAccounts) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Memuat daftar rekening...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold">Buku Besar</h3>
                    <p className="text-sm text-muted-foreground">Mutasi harian terperinci untuk rekening tertentu.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm ring-1 ring-border/50 transition-all focus-within:ring-primary/50 flex-1 max-w-md">
                    <div className="pl-3 py-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger className="border-none shadow-none focus:ring-0">
                            <SelectValue placeholder="Pilih rekening untuk melihat mutasi..." />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts?.map(acc => (
                                <SelectItem key={acc.kd_rek} value={acc.kd_rek}>
                                    <span className="font-mono text-[10px] mr-2 text-muted-foreground">[{acc.kd_rek}]</span>
                                    {acc.nm_rek}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedAccount ? (
                <Card className="border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                    <div className="p-4 bg-background rounded-full shadow-sm">
                        <Book className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">Pilih Rekening</p>
                        <p className="text-sm text-muted-foreground">Gunakan pencarian di atas untuk memilih akun yang ingin dianalisis.</p>
                    </div>
                </Card>
            ) : loadingLedger ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Sedang menarik data mutasi buku besar...</p>
                </div>
            ) : error ? (
                <div className="py-20 text-center text-rose-500">Gagal memuat data buku besar.</div>
            ) : (
                <div className="space-y-6">
                    {/* Header Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="shadow-sm border-none bg-slate-50">
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-xs uppercase text-muted-foreground tracking-wider">Saldo Awal</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <p className="text-2xl font-bold text-slate-700">Rp {ledgerData?.initial_balance.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 italic">Per tanggal {new Date(startDate).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>

                        {/* Calculate Final Balance */}
                        {(() => {
                            const totalDebet = ledgerData?.entries.reduce((sum, e) => sum + e.debet, 0) || 0;
                            const totalKredit = ledgerData?.entries.reduce((sum, e) => sum + e.kredit, 0) || 0;
                            const account = accounts?.find(a => a.kd_rek === selectedAccount);
                            let finalBalance = ledgerData?.initial_balance || 0;
                            if (account?.balance === 'D') finalBalance += (totalDebet - totalKredit);
                            else finalBalance += (totalKredit - totalDebet);

                            return (
                                <Card className="shadow-sm border-none bg-primary text-primary-foreground">
                                    <CardHeader className="py-3 px-4">
                                        <CardTitle className="text-xs uppercase text-primary-foreground/70 tracking-wider">Saldo Akhir</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4">
                                        <p className="text-3xl font-black">Rp {finalBalance.toLocaleString()}</p>
                                        <p className="text-[10px] text-primary-foreground/70 mt-1 italic">Per tanggal {new Date(endDate).toLocaleDateString()}</p>
                                    </CardContent>
                                </Card>
                            );
                        })()}
                    </div>

                    <Card className="shadow-sm border-none overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Daftar Mutasi Terperinci</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 text-muted-foreground border-b border-border/50">
                                            <th className="px-6 py-3 text-left font-medium">Tanggal</th>
                                            <th className="px-6 py-3 text-left font-medium">Nomor Jurnal</th>
                                            <th className="px-6 py-3 text-left font-medium">Keterangan</th>
                                            <th className="px-6 py-3 text-right font-medium">Debet</th>
                                            <th className="px-6 py-3 text-right font-medium">Kredit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {ledgerData?.entries.map((entry, i) => (
                                            <tr key={i} className="hover:bg-muted/20 group transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap opacity-70">
                                                    {new Date(entry.tgl_jurnal).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 font-mono font-medium">{entry.no_jurnal}</td>
                                                <td className="px-6 py-4 max-w-md truncate text-muted-foreground group-hover:text-foreground transition-colors italic">
                                                    {entry.keterangan}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                                    {entry.debet > 0 ? `Rp ${entry.debet.toLocaleString()}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-rose-600">
                                                    {entry.kredit > 0 ? `Rp ${entry.kredit.toLocaleString()}` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {ledgerData?.entries.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                                    Tidak ada mutasi ditemukan dalam rentang waktu terpilih.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
