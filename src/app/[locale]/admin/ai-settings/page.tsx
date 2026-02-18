"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { toast } from "sonner";
import {
    Bot, FileText, Activity, History,
    Save, Upload, Search, MessageSquare,
    Play, ThumbsUp, ThumbsDown, AlertCircle,
    ShieldAlert, ExternalLink, RefreshCw,
    BarChart3, PieChart as PieIcon, TrendingUp, Users,
    Trash2, Plus, Info, X
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie
} from "recharts";
import {
    useAiSettings, useUpdateAiPrompt, useUploadMcuCsv,
    useGetAiTreatments, useCreateAiTreatment, useUpdateAiTreatment, useDeleteAiTreatment,
    useSearchAiServices, useGetAiLogs, useGetAiSession, useTestAiPrompt, useAiAnalytics, TreatmentMetadata
} from "~/features/admin/api/aiAdminApi";

export default function AISettingsPage() {
    const [activeTab, setActiveTab] = useState("prompt");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Settings & Knowledge</h1>
                    <p className="text-muted-foreground">Manage Siti AI's personality, medical knowledge, and performance.</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 gap-2 border-primary/20 bg-primary/5 text-primary">
                    <Bot className="w-4 h-4" />
                    Gemini Flash 1.5
                </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-[750px]">
                    <TabsTrigger value="prompt" className="gap-2">
                        <Bot className="w-4 h-4" />
                        Prompt
                    </TabsTrigger>
                    <TabsTrigger value="mcu" className="gap-2">
                        <FileText className="w-4 h-4" />
                        MCU Data
                    </TabsTrigger>
                    <TabsTrigger value="treatments" className="gap-2">
                        <Activity className="w-4 h-4" />
                        Layanan
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="gap-2">
                        <History className="w-4 h-4" />
                        Monitoring
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="prompt" className="space-y-4">
                    <PromptTab />
                </TabsContent>
                <TabsContent value="mcu" className="space-y-4">
                    <McuDataTab />
                </TabsContent>
                <TabsContent value="treatments" className="space-y-4">
                    <TreatmentsTab />
                </TabsContent>
                <TabsContent value="logs" className="space-y-4">
                    <LogsTab />
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                    <AnalyticsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function PromptTab() {
    const { data: settings, isLoading } = useAiSettings();
    const updatePrompt = useUpdateAiPrompt();
    const testPrompt = useTestAiPrompt();
    const [promptValue, setPromptValue] = useState("");
    const [testQuery, setTestQuery] = useState("");
    const [testResponse, setTestResponse] = useState("");

    useEffect(() => {
        if (settings?.prompt) setPromptValue(settings.prompt);
    }, [settings]);

    const handleSave = () => {
        updatePrompt.mutate(promptValue);
    };

    const handleTest = () => {
        if (!testQuery) return;
        testPrompt.mutate({ prompt: promptValue, message: testQuery }, {
            onSuccess: (res) => setTestResponse(res)
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col border-primary/10">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>System Instructions</CardTitle>
                            <CardDescription>Atur kepribadian, aturan, dan batasan Siti AI.</CardDescription>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={updatePrompt.isPending}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {updatePrompt.isPending ? "Saving..." : "Save Prompt"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    {isLoading ? (
                        <Skeleton className="h-[500px] w-full" />
                    ) : (
                        <Textarea
                            value={promptValue}
                            onChange={(e) => setPromptValue(e.target.value)}
                            className="flex-1 min-h-[500px] font-mono text-sm leading-relaxed border-primary/10 focus-visible:ring-primary/20"
                            placeholder="Tulis instruksi sistem di sini..."
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        AI Playground
                    </CardTitle>
                    <CardDescription>Tes instruksi baru Anda di sini sebelum di-publish.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Coba Tanya Siti:</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Misal: Berapa harga paket MCU?"
                                value={testQuery}
                                onChange={(e) => setTestQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                            />
                            <Button variant="secondary" onClick={handleTest} disabled={testPrompt.isPending} className="gap-2">
                                {testPrompt.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                Test
                            </Button>
                        </div>
                    </div>

                    <div className="min-h-[400px] p-6 rounded-xl bg-background border flex flex-col gap-4 shadow-inner">
                        <div className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2 border-b pb-2">
                            <Bot className="w-3 h-3" />
                            AI Response Preview
                        </div>
                        {testResponse ? (
                            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                                {testResponse}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic flex flex-col items-center justify-center flex-1 gap-2">
                                <MessageSquare className="w-8 h-8 opacity-10" />
                                Hasil uji coba akan muncul di sini...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function McuDataTab() {
    const { data: settings } = useAiSettings();
    const uploadMcu = useUploadMcuCsv();
    const [file, setFile] = useState<File | null>(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>MCU Package Data (CSV)</CardTitle>
                <CardDescription>Unggah file CSV untuk memperbarui daftar harga dan paket MCU secara massal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center gap-4 bg-muted/50 transition-all hover:bg-muted/80 hover:border-primary/20 group">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{file ? file.name : "Pilih File CSV"}</p>
                        <p className="text-sm text-muted-foreground">Format: Paket MCU 2026.csv (Pemisah titik koma)</p>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        id="mcu-upload"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => document.getElementById('mcu-upload')?.click()}>
                            Browse File
                        </Button>
                        {file && (
                            <Button onClick={() => uploadMcu.mutate(file)} disabled={uploadMcu.isPending}>
                                {uploadMcu.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                Upload Now
                            </Button>
                        )}
                    </div>
                </div>

                {settings?.mcuFile && (
                    <div className="flex items-center justify-between p-4 rounded-xl border bg-background shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10 text-green-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Main Database: {settings.mcuFile.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                                    Terakhir Diupdate: {new Date(settings.mcuFile.updatedAt).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="font-mono">{(settings.mcuFile.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function TreatmentsTab() {
    const { data: treatments, isLoading } = useGetAiTreatments();
    const createTreatment = useCreateAiTreatment();
    const updateTreatment = useUpdateAiTreatment();
    const deleteTreatment = useDeleteAiTreatment();
    const [editingTreatment, setEditingTreatment] = useState<TreatmentMetadata | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newTreatment, setNewTreatment] = useState<{
        treatmentId: string;
        type: string;
        description: string;
        preparation: string;
        estimatedTime: string;
        isPopular: boolean;
    }>({
        treatmentId: "",
        type: "LAB",
        description: "",
        preparation: "",
        estimatedTime: "",
        isPopular: false
    });

    const { data: suggestions, isLoading: isSearching } = useSearchAiServices(newTreatment.treatmentId);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSave = () => {
        if (!editingTreatment) return;
        updateTreatment.mutate({ id: editingTreatment.id, data: editingTreatment }, {
            onSuccess: () => setEditingTreatment(null)
        });
    };

    const handleCreate = () => {
        if (!newTreatment.treatmentId || !newTreatment.description) {
            toast.error("ID and Description are required");
            return;
        }
        createTreatment.mutate(newTreatment, {
            onSuccess: () => {
                setIsAdding(false);
                setNewTreatment({
                    treatmentId: "",
                    type: "LAB",
                    description: "",
                    preparation: "",
                    estimatedTime: "",
                    isPopular: false
                });
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this knowledge? Site AI will forget this info.")) {
            deleteTreatment.mutate(id);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Medical Treatment Knowledge</CardTitle>
                    <CardDescription>Kelola instruksi persiapan dan metadata untuk Lab, Radiologi, dll.</CardDescription>
                </div>
                <Button onClick={() => setIsAdding(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4" />
                    Tambah Pengetahuan
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Layanan (ID)</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Instruksi Persiapan</TableHead>
                                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : treatments?.map((t) => (
                                <TableRow key={t.id} className="hover:bg-muted/20">
                                    <TableCell className="font-medium whitespace-nowrap">
                                        <div className="font-semibold">{t.description || "Tanpa Nama"}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono">{t.treatmentId}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] uppercase">{t.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                            {t.preparation || "Belum ada instruksi persiapan khusus."}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditingTreatment(t)}
                                            className="hover:text-primary"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(t.id)}
                                            className="hover:text-red-600 text-muted-foreground/50"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={!!editingTreatment} onOpenChange={() => setEditingTreatment(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Persiapan: {editingTreatment?.description}</DialogTitle>
                        <DialogDescription>
                            Perubahan ini akan langsung dipelajari oleh Siti AI untuk dijawab ke pasien.
                        </DialogDescription>
                    </DialogHeader>
                    {editingTreatment && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nama Layanan</label>
                                    <Input
                                        value={editingTreatment.description || ""}
                                        onChange={(e) => setEditingTreatment({ ...editingTreatment, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estimasi Waktu</label>
                                    <Input
                                        value={editingTreatment.estimatedTime || ""}
                                        onChange={(e) => setEditingTreatment({ ...editingTreatment, estimatedTime: e.target.value })}
                                        placeholder="Misal: 30 menit"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instruksi Persiapan (Gunakan poin-poin)</label>
                                <Textarea
                                    value={editingTreatment.preparation || ""}
                                    onChange={(e) => setEditingTreatment({ ...editingTreatment, preparation: e.target.value })}
                                    className="min-h-[150px]"
                                    placeholder="Contoh: - Puasa 8 jam sebelum test. - Pakai baju longgar."
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTreatment(null)}>Batal</Button>
                        <Button
                            onClick={handleSave}
                            disabled={updateTreatment.isPending}
                        >
                            {updateTreatment.isPending ? "Syncing..." : "Simpan Pengetahuan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengetahuan Medis Baru</DialogTitle>
                        <DialogDescription>
                            Gunakan Nama atau ID Layanan untuk mencari data dari SIMRS Khanza.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative" ref={suggestionRef}>
                                <label className="text-sm font-medium">Cari ID/Nama Layanan</label>
                                <div className="relative">
                                    <Input
                                        placeholder="Ketik min. 2 huruf..."
                                        value={newTreatment.treatmentId}
                                        onChange={(e) => {
                                            setNewTreatment({ ...newTreatment, treatmentId: e.target.value });
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                    />
                                    {isSearching && <RefreshCw className="w-3 h-3 absolute right-3 top-3 animate-spin text-muted-foreground" />}
                                </div>

                                {showSuggestions && suggestions && suggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                                        {suggestions.map((s) => (
                                            <button
                                                key={s.id}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex flex-col border-b last:border-0"
                                                onClick={() => {
                                                    setNewTreatment({
                                                        ...newTreatment,
                                                        treatmentId: s.id,
                                                        description: s.name,
                                                        type: s.type
                                                    });
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <span className="font-medium">{s.name}</span>
                                                <span className="text-xs text-muted-foreground">{s.id} • {s.type}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipe Layanan</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newTreatment.type}
                                    onChange={(e) => setNewTreatment({ ...newTreatment, type: e.target.value })}
                                >
                                    <option value="LAB">Laboratorium</option>
                                    <option value="RADIOLOGY">Radiologi</option>
                                    <option value="MCU">Medical Check Up</option>
                                    <option value="POLI">Poliklinik</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Layanan (Deskripsi Singkat)</label>
                                <Input
                                    placeholder="Misal: Darah Lengkap"
                                    value={newTreatment.description || ""}
                                    onChange={(e) => setNewTreatment({ ...newTreatment, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estimasi Waktu</label>
                                <Input
                                    placeholder="Misal: 15 menit"
                                    value={newTreatment.estimatedTime || ""}
                                    onChange={(e) => setNewTreatment({ ...newTreatment, estimatedTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Instruksi Persiapan</label>
                            <Textarea
                                placeholder="Poin-poin instruksi..."
                                value={newTreatment.preparation}
                                onChange={(e) => setNewTreatment({ ...newTreatment, preparation: e.target.value })}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
                        <Button
                            onClick={handleCreate}
                            disabled={createTreatment.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {createTreatment.isPending ? "Creating..." : "Tambah Pengetahuan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function LogsTab() {
    const { data: logs, isLoading } = useGetAiLogs();
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const { data: sessionData, isLoading: sessionLoading } = useGetAiSession(selectedSession);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border-primary/5">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Sesi chat real-world dari pasien.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-muted">
                        {isLoading ? (
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="p-4 border-b space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            ))
                        ) : logs?.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground italic h-full items-center justify-center flex">
                                Belum ada riwayat chat.
                            </div>
                        ) : logs?.map((log: any) => (
                            <button
                                key={log.sessionId}
                                onClick={() => setSelectedSession(log.sessionId)}
                                className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-all ${selectedSession === log.sessionId ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <Badge variant="outline" className="text-[10px] font-mono border-muted-foreground/20">
                                        ID: {log.sessionId.substring(0, 8)}...
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase">
                                        {new Date(log._max.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary/60" />
                                    {log._count.id} Messages
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-primary/5">
                <CardHeader className="border-b py-4">
                    <CardTitle className="text-lg flex justify-between items-center">
                        Transcript Viewer
                        {selectedSession && (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">
                                SESSION_ID: {selectedSession}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {!selectedSession ? (
                        <div className="h-[550px] flex flex-col items-center justify-center text-muted-foreground gap-4 bg-muted/5">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <History className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="text-sm font-medium">Pilih percakapan untuk melihat transkrip.</p>
                        </div>
                    ) : sessionLoading ? (
                        <div className="h-[550px] p-6 space-y-6 overflow-auto">
                            <Skeleton className="h-12 w-[60%] rounded-2xl" />
                            <Skeleton className="h-20 w-[80%] rounded-2xl ml-auto" />
                            <Skeleton className="h-12 w-[40%] rounded-2xl" />
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[550px] overflow-auto p-6 bg-muted/5 scrollbar-thin scrollbar-thumb-muted">
                            {sessionData?.map((msg: any) => (
                                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-background border rounded-tl-none text-foreground/90'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 px-1">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                            {msg.role === 'user' ? 'Pasien' : 'Siti AI'}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground/40 font-mono">
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function AnalyticsTab() {
    const { data: stats, isLoading } = useAiAnalytics();

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'];

    if (isLoading) return <Skeleton className="h-[600px] w-full" />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-wider">Total Pesan User</CardDescription>
                        <CardTitle className="text-3xl font-bold">{stats?.totalMessages || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" /> Sejak sistem aktif
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-blue-500/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-wider">Total Feedback</CardDescription>
                        <CardTitle className="text-3xl font-bold">{stats?.totalFeedbacks || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Respon yang dinilai
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-wider">Avg AI Rating</CardDescription>
                        <CardTitle className="text-3xl font-bold flex items-baseline gap-1">
                            {stats?.averageRating?.toFixed(1) || 0}
                            <span className="text-sm font-normal text-muted-foreground">/ 1.0</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> Kepuasan Pasien
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-wider">Top Topic</CardDescription>
                        <CardTitle className="text-xl font-bold truncate">
                            {stats?.topicTrends?.[0]?.name || "N/A"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Tren saat ini
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Tren Topik Pertanyaan
                        </CardTitle>
                        <CardDescription>Kategori yang paling sering ditanyakan pasien (200 pesan terakhir).</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.topicTrends || []} layout="vertical" margin={{ left: 40, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 500 }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-background border rounded-lg p-2 shadow-xl text-xs font-bold">
                                                    {payload[0].value} Pertanyaan
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {stats?.topicTrends?.map((_entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5 text-emerald-500" />
                            Feedback Pasien Terbaru
                        </CardTitle>
                        <CardDescription>10 penilaian terakhir dari pasien terkait akurasi Siti AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.recentFeedback?.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground italic h-full items-center justify-center flex">
                                    Belum ada feedback.
                                </div>
                            ) : stats?.recentFeedback?.map((f: any) => (
                                <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-full",
                                            f.rating === 1 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                                        )}>
                                            {f.rating === 1 ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{f.rating === 1 ? "Sangat Membantu" : "Kurang Akurat"}</p>
                                            <p className="text-[10px] text-muted-foreground">{new Date(f.createdAt).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-mono tracking-tighter opacity-50">
                                        {f.id.substring(0, 8)}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
