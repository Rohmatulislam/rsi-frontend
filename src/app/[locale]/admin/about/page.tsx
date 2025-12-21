"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Plus, Edit, Trash2, Users, Calendar, Loader2, FileText, Heart, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImageUploadField } from "~/features/admin/components/ImageUploadField";
import { axiosInstance } from "~/lib/axios";
import { getImageSrc } from "~/lib/utils";

// Types
interface Founder {
    id: string;
    name: string;
    role: string;
    description?: string;
    image?: string;
    badge?: string;
    order: number;
    isActive: boolean;
}

interface Milestone {
    id: string;
    year: string;
    title: string;
    description: string;
    icon?: string;
    highlight: boolean;
    order: number;
    isActive: boolean;
}

interface AboutContent {
    id: string;
    key: string;
    value: string;
}

interface CoreValue {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

type TabType = "content" | "values" | "founders" | "milestones";

// API functions using axiosInstance (with auth interceptor)
const fetchFounders = async (): Promise<Founder[]> => {
    const res = await axiosInstance.get<Founder[]>("/about/founders");
    return res.data;
};

const fetchMilestones = async (): Promise<Milestone[]> => {
    const res = await axiosInstance.get<Milestone[]>("/about/milestones");
    return res.data;
};

const fetchAboutContent = async (): Promise<AboutContent[]> => {
    const res = await axiosInstance.get<AboutContent[]>("/about/content");
    return res.data;
};

const fetchCoreValues = async (): Promise<CoreValue[]> => {
    const res = await axiosInstance.get<CoreValue[]>("/about/values");
    return res.data;
};

const deleteFounder = async (id: string) => {
    const res = await axiosInstance.delete(`/about/founders/${id}`);
    return res.data;
};

const deleteMilestone = async (id: string) => {
    const res = await axiosInstance.delete(`/about/milestones/${id}`);
    return res.data;
};

const createFounder = async (data: Omit<Founder, "id" | "isActive">) => {
    const res = await axiosInstance.post("/about/founders", data);
    return res.data;
};

const updateFounder = async ({ id, data }: { id: string; data: Partial<Founder> }) => {
    const res = await axiosInstance.patch(`/about/founders/${id}`, data);
    return res.data;
};

const createMilestone = async (data: Omit<Milestone, "id" | "isActive">) => {
    const res = await axiosInstance.post("/about/milestones", data);
    return res.data;
};

const updateMilestone = async ({ id, data }: { id: string; data: Partial<Milestone> }) => {
    const res = await axiosInstance.patch(`/about/milestones/${id}`, data);
    return res.data;
};

const updateAboutContent = async ({ key, value }: { key: string; value: string }) => {
    const res = await axiosInstance.patch(`/about/content/${key}`, { value });
    return res.data;
};

const updateCoreValue = async ({ id, data }: { id: string; data: Partial<CoreValue> }) => {
    const res = await axiosInstance.patch(`/about/values/${id}`, data);
    return res.data;
};

const initializeContent = async () => {
    const res = await axiosInstance.post("/about/content/initialize");
    return res.data;
};

const initializeValues = async () => {
    const res = await axiosInstance.post("/about/values/initialize");
    return res.data;
};

export default function AdminAboutPage() {
    const [activeTab, setActiveTab] = useState<TabType>("content");
    const [editingContent, setEditingContent] = useState<Record<string, string>>({});
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
    const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
    const [isNewFounder, setIsNewFounder] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [isNewMilestone, setIsNewMilestone] = useState(false);
    const queryClient = useQueryClient();

    // Queries
    const { data: founders = [], isLoading: loadingFounders } = useQuery({
        queryKey: ["founders"],
        queryFn: fetchFounders,
    });

    const { data: milestones = [], isLoading: loadingMilestones } = useQuery({
        queryKey: ["milestones"],
        queryFn: fetchMilestones,
    });

    const { data: aboutContent = [], isLoading: loadingContent } = useQuery({
        queryKey: ["aboutContent"],
        queryFn: fetchAboutContent,
    });

    const { data: coreValues = [], isLoading: loadingValues } = useQuery({
        queryKey: ["coreValues"],
        queryFn: fetchCoreValues,
    });

    // Mutations
    const deleteFounderMutation = useMutation({
        mutationFn: deleteFounder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["founders"] });
            toast.success("Founder deleted");
        },
        onError: () => toast.error("Failed to delete founder"),
    });

    const deleteMilestoneMutation = useMutation({
        mutationFn: deleteMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"] });
            toast.success("Milestone deleted");
        },
        onError: () => toast.error("Failed to delete milestone"),
    });

    const createFounderMutation = useMutation({
        mutationFn: createFounder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["founders"] });
            setEditingFounder(null);
            setIsNewFounder(false);
            toast.success("Pendiri berhasil ditambahkan");
        },
        onError: () => toast.error("Gagal menambahkan pendiri"),
    });

    const updateFounderMutation = useMutation({
        mutationFn: updateFounder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["founders"] });
            setEditingFounder(null);
            toast.success("Pendiri berhasil diupdate");
        },
        onError: () => toast.error("Gagal update pendiri"),
    });

    const createMilestoneMutation = useMutation({
        mutationFn: createMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"] });
            setEditingMilestone(null);
            setIsNewMilestone(false);
            toast.success("Milestone berhasil ditambahkan");
        },
        onError: () => toast.error("Gagal menambahkan milestone"),
    });

    const updateMilestoneMutation = useMutation({
        mutationFn: updateMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"] });
            setEditingMilestone(null);
            toast.success("Milestone berhasil diupdate");
        },
        onError: () => toast.error("Gagal update milestone"),
    });

    const updateContentMutation = useMutation({
        mutationFn: updateAboutContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aboutContent"] });
            toast.success("Konten berhasil diupdate");
        },
        onError: () => toast.error("Gagal update konten"),
    });

    const updateValueMutation = useMutation({
        mutationFn: updateCoreValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coreValues"] });
            setEditingValue(null);
            toast.success("Nilai berhasil diupdate");
        },
        onError: () => toast.error("Gagal update nilai"),
    });

    const initContentMutation = useMutation({
        mutationFn: initializeContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aboutContent"] });
            toast.success("Konten default berhasil dibuat");
        },
    });

    const initValuesMutation = useMutation({
        mutationFn: initializeValues,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coreValues"] });
            toast.success("Nilai default berhasil dibuat");
        },
    });

    const getContentValue = (key: string) => {
        return editingContent[key] ?? aboutContent.find(c => c.key === key)?.value ?? "";
    };

    const handleContentChange = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveContent = (key: string) => {
        updateContentMutation.mutate({ key, value: editingContent[key] || getContentValue(key) });
    };

    const tabs = [
        { id: "content" as TabType, label: "Konten", icon: FileText },
        { id: "values" as TabType, label: "Nilai Utama", icon: Heart, count: coreValues.length },
        { id: "founders" as TabType, label: "Tokoh Pendiri", icon: Users, count: founders.length },
        { id: "milestones" as TabType, label: "Timeline", icon: Calendar, count: milestones.length },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage About Page</h1>
                    <p className="text-slate-500">Kelola konten halaman Tentang Kami</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? "border-primary text-primary"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label} {tab.count !== undefined && `(${tab.count})`}
                    </button>
                ))}
            </div>

            {/* Content Tab */}
            {activeTab === "content" && (
                <div className="space-y-6">
                    {loadingContent ? (
                        <div className="p-8 text-center text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading content...
                        </div>
                    ) : aboutContent.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-slate-500 mb-4">Belum ada konten</p>
                            <Button onClick={() => initContentMutation.mutate()} disabled={initContentMutation.isPending}>
                                {initContentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Buat Konten Default
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* History */}
                            <div className="bg-white rounded-2xl shadow-sm border p-6">
                                <h3 className="font-semibold text-lg mb-4">📜 Sejarah</h3>
                                <textarea
                                    className="w-full p-3 border rounded-lg min-h-[150px] text-sm"
                                    value={getContentValue("history")}
                                    onChange={(e) => handleContentChange("history", e.target.value)}
                                    placeholder="Tulis sejarah rumah sakit..."
                                />
                                <div className="flex justify-end mt-3">
                                    <Button size="sm" onClick={() => handleSaveContent("history")} disabled={updateContentMutation.isPending}>
                                        <Save className="w-4 h-4 mr-2" /> Simpan
                                    </Button>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="bg-white rounded-2xl shadow-sm border p-6">
                                <h3 className="font-semibold text-lg mb-4">🎯 Visi</h3>
                                <textarea
                                    className="w-full p-3 border rounded-lg min-h-[100px] text-sm"
                                    value={getContentValue("vision")}
                                    onChange={(e) => handleContentChange("vision", e.target.value)}
                                    placeholder="Tulis visi rumah sakit..."
                                />
                                <div className="flex justify-end mt-3">
                                    <Button size="sm" onClick={() => handleSaveContent("vision")} disabled={updateContentMutation.isPending}>
                                        <Save className="w-4 h-4 mr-2" /> Simpan
                                    </Button>
                                </div>
                            </div>

                            {/* Mission */}
                            <div className="bg-white rounded-2xl shadow-sm border p-6">
                                <h3 className="font-semibold text-lg mb-4">🏆 Misi</h3>
                                <p className="text-sm text-slate-500 mb-2">Format: Satu misi per baris</p>
                                <textarea
                                    className="w-full p-3 border rounded-lg min-h-[150px] text-sm font-mono"
                                    value={(() => {
                                        const val = getContentValue("mission");
                                        try {
                                            return JSON.parse(val).join("\n");
                                        } catch {
                                            return val;
                                        }
                                    })()}
                                    onChange={(e) => {
                                        const lines = e.target.value.split("\n").filter(l => l.trim());
                                        handleContentChange("mission", JSON.stringify(lines));
                                    }}
                                    placeholder="Misi 1&#10;Misi 2&#10;Misi 3"
                                />
                                <div className="flex justify-end mt-3">
                                    <Button size="sm" onClick={() => handleSaveContent("mission")} disabled={updateContentMutation.isPending}>
                                        <Save className="w-4 h-4 mr-2" /> Simpan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Core Values Tab */}
            {activeTab === "values" && (
                <div className="space-y-4">
                    {loadingValues ? (
                        <div className="p-8 text-center text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading values...
                        </div>
                    ) : coreValues.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                            <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-slate-500 mb-4">Belum ada nilai utama</p>
                            <Button onClick={() => initValuesMutation.mutate()} disabled={initValuesMutation.isPending}>
                                {initValuesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Buat Nilai Default
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {coreValues.map((value) => (
                                <div key={value.id} className="bg-white rounded-2xl shadow-sm border p-6">
                                    {editingValue?.id === value.id ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full p-2 border rounded font-semibold"
                                                value={editingValue.title}
                                                onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                                            />
                                            <textarea
                                                className="w-full p-2 border rounded text-sm min-h-[80px]"
                                                value={editingValue.description}
                                                onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                                            />
                                            <input
                                                className="w-full p-2 border rounded text-sm"
                                                value={editingValue.icon}
                                                onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
                                                placeholder="Icon (Heart, Users, Target, CheckCircle2)"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <Button variant="outline" size="sm" onClick={() => setEditingValue(null)}>Batal</Button>
                                                <Button size="sm" onClick={() => updateValueMutation.mutate({ id: value.id, data: editingValue })}>
                                                    <Save className="w-4 h-4 mr-1" /> Simpan
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-lg">{value.title}</h3>
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setEditingValue(value)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <p className="text-slate-600 text-sm">{value.description}</p>
                                            <p className="text-xs text-slate-400 mt-2">Icon: {value.icon}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Founders Tab */}
            {activeTab === "founders" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => {
                            setEditingFounder({ id: "", name: "", role: "", description: "", image: "", order: founders.length, isActive: true });
                            setIsNewFounder(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Pendiri
                        </Button>
                    </div>

                    {/* Form Create/Edit Founder */}
                    {editingFounder && (
                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                            <h3 className="font-semibold text-lg">{isNewFounder ? "Tambah Pendiri Baru" : "Edit Pendiri"}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Nama *</label>
                                    <input
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingFounder.name}
                                        onChange={(e) => setEditingFounder({ ...editingFounder, name: e.target.value })}
                                        placeholder="Nama lengkap pendiri"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Jabatan/Peran *</label>
                                    <input
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingFounder.role}
                                        onChange={(e) => setEditingFounder({ ...editingFounder, role: e.target.value })}
                                        placeholder="Jabatan atau peran"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Badge Label</label>
                                    <input
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingFounder.badge || ""}
                                        onChange={(e) => setEditingFounder({ ...editingFounder, badge: e.target.value })}
                                        placeholder="Label badge (e.g. PENDIRI)"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Deskripsi</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg text-sm min-h-[80px]"
                                    value={editingFounder.description || ""}
                                    onChange={(e) => setEditingFounder({ ...editingFounder, description: e.target.value })}
                                    placeholder="Deskripsi kontribusi pendiri"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 items-start">
                                <ImageUploadField
                                    label="Foto Pendiri"
                                    value={editingFounder.image}
                                    onChange={(value) => setEditingFounder({ ...editingFounder, image: value })}
                                    shape="circle"
                                    placeholder="Upload foto"
                                />
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Urutan</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingFounder.order}
                                        onChange={(e) => setEditingFounder({ ...editingFounder, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <Button variant="outline" onClick={() => { setEditingFounder(null); setIsNewFounder(false); }}>Batal</Button>
                                <Button
                                    onClick={() => {
                                        if (isNewFounder) {
                                            createFounderMutation.mutate({
                                                name: editingFounder.name,
                                                role: editingFounder.role,
                                                description: editingFounder.description,
                                                image: editingFounder.image,
                                                badge: editingFounder.badge,
                                                order: editingFounder.order,
                                            });
                                        } else {
                                            updateFounderMutation.mutate({ id: editingFounder.id, data: editingFounder });
                                        }
                                    }}
                                    disabled={!editingFounder.name || !editingFounder.role || createFounderMutation.isPending || updateFounderMutation.isPending}
                                >
                                    {(createFounderMutation.isPending || updateFounderMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    <Save className="w-4 h-4 mr-2" /> Simpan
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        {loadingFounders ? (
                            <div className="p-8 text-center text-slate-500">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                Loading founders...
                            </div>
                        ) : founders.length === 0 ? (
                            <div className="p-16 text-center text-slate-500">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>Belum ada data pendiri</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b text-slate-500">
                                    <tr>
                                        <th className="p-4 font-medium">Foto</th>
                                        <th className="p-4 font-medium">Nama</th>
                                        <th className="p-4 font-medium">Jabatan</th>
                                        <th className="p-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {founders.map((founder) => (
                                        <tr key={founder.id} className="hover:bg-slate-50/50">
                                            <td className="p-4">
                                                {founder.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={getImageSrc(founder.image)} alt={founder.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium">{founder.name}</td>
                                            <td className="p-4 text-slate-600">{founder.role}</td>
                                            <td className="p-4 text-right space-x-1">
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setEditingFounder(founder); setIsNewFounder(false); }}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500" onClick={() => deleteFounderMutation.mutate(founder.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Milestones Tab */}
            {activeTab === "milestones" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => {
                            setEditingMilestone({ id: "", year: "", title: "", description: "", icon: "Sparkles", highlight: false, order: milestones.length, isActive: true });
                            setIsNewMilestone(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Milestone
                        </Button>
                    </div>

                    {/* Form Create/Edit Milestone */}
                    {editingMilestone && (
                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                            <h3 className="font-semibold text-lg">{isNewMilestone ? "Tambah Milestone Baru" : "Edit Milestone"}</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Tahun *</label>
                                    <input
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingMilestone.year}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                                        placeholder="1985"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Judul *</label>
                                    <input
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingMilestone.title}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                                        placeholder="Judul milestone"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Deskripsi *</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg text-sm min-h-[80px]"
                                    value={editingMilestone.description}
                                    onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                                    placeholder="Deskripsi detail milestone"
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Icon</label>
                                    <select
                                        className="w-full p-3 border rounded-lg text-sm bg-white"
                                        value={editingMilestone.icon || "Sparkles"}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, icon: e.target.value })}
                                    >
                                        <option value="Sparkles">✨ Sparkles</option>
                                        <option value="Building">🏢 Building</option>
                                        <option value="Award">🏆 Award</option>
                                        <option value="Users">👥 Users</option>
                                        <option value="Heart">❤️ Heart</option>
                                        <option value="Calendar">📅 Calendar</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Urutan</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded-lg text-sm"
                                        value={editingMilestone.order}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="highlight"
                                        checked={editingMilestone.highlight}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, highlight: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="highlight" className="text-sm font-medium text-slate-700">Highlight (Milestone Penting)</label>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <Button variant="outline" onClick={() => { setEditingMilestone(null); setIsNewMilestone(false); }}>Batal</Button>
                                <Button
                                    onClick={() => {
                                        if (isNewMilestone) {
                                            createMilestoneMutation.mutate({
                                                year: editingMilestone.year,
                                                title: editingMilestone.title,
                                                description: editingMilestone.description,
                                                icon: editingMilestone.icon,
                                                highlight: editingMilestone.highlight,
                                                order: editingMilestone.order,
                                            });
                                        } else {
                                            updateMilestoneMutation.mutate({ id: editingMilestone.id, data: editingMilestone });
                                        }
                                    }}
                                    disabled={!editingMilestone.year || !editingMilestone.title || !editingMilestone.description || createMilestoneMutation.isPending || updateMilestoneMutation.isPending}
                                >
                                    {(createMilestoneMutation.isPending || updateMilestoneMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    <Save className="w-4 h-4 mr-2" /> Simpan
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        {loadingMilestones ? (
                            <div className="p-8 text-center text-slate-500">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                Loading milestones...
                            </div>
                        ) : milestones.length === 0 ? (
                            <div className="p-16 text-center text-slate-500">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>Belum ada data milestone</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b text-slate-500">
                                    <tr>
                                        <th className="p-4 font-medium">Tahun</th>
                                        <th className="p-4 font-medium">Judul</th>
                                        <th className="p-4 font-medium">Highlight</th>
                                        <th className="p-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {milestones.map((milestone) => (
                                        <tr key={milestone.id} className="hover:bg-slate-50/50">
                                            <td className="p-4">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {milestone.year}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium">{milestone.title}</td>
                                            <td className="p-4">{milestone.highlight ? "✓ Yes" : "No"}</td>
                                            <td className="p-4 text-right space-x-1">
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setEditingMilestone(milestone); setIsNewMilestone(false); }}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500" onClick={() => deleteMilestoneMutation.mutate(milestone.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
