"use client";

import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { useSyncDoctors } from "~/features/admin/api/syncDoctors";
import { useUpdateDoctor } from "~/features/admin/api/updateDoctor";
import { useDeleteDoctor } from "~/features/admin/api/deleteDoctor";
import { RefreshCw, Search, Edit2, Save, X, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { DoctorDto } from "~/features/home/api/getDoctors";

export default function AdminDoctorsPage() {
    const { data: doctors, isLoading } = useGetDoctorsList({
        input: { limit: 1000 }
    });

    const { mutate: sync, isPending: isSyncing } = useSyncDoctors();
    const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();
    const { mutate: deleteDoctor, isPending: isDeleting } = useDeleteDoctor();

    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<DoctorDto>>({});

    const filteredDoctors = doctors?.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.kd_dokter && d.kd_dokter.toLowerCase().includes(search.toLowerCase()))
    ) || [];

    const handleEdit = (doctor: DoctorDto) => {
        setEditingId(doctor.id);
        setEditForm(doctor);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = () => {
        if (editingId && editForm) {
            updateDoctor({ id: editingId, data: editForm }, {
                onSuccess: () => {
                    setEditingId(null);
                }
            });
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            deleteDoctor(id);
        }
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
                    <p className="text-slate-500">Manage doctor data (Synced from Khanza)</p>
                </div>
                <button
                    onClick={() => sync()}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Sync from SIMRS"}</span>
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search doctor name or code..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="p-4 font-medium">Image</th>
                                <th className="p-4 font-medium">Doctor Name</th>
                                <th className="p-4 font-medium">Code (Khanza)</th>
                                <th className="p-4 font-medium">Specialization</th>
                                <th className="p-4 font-medium">Fee</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.map((doc) => {
                                const isEditing = editingId === doc.id;

                                return (
                                    <tr key={doc.id} className="hover:bg-slate-50/50">
                                        <td className="p-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    className="w-20 p-2 border rounded text-xs"
                                                    value={editForm.imageUrl || ""}
                                                    onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                                    {doc.imageUrl ? (
                                                        <img
                                                            src={doc.imageUrl}
                                                            alt={doc.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doc.name);
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                            No Img
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-2 border rounded"
                                                    value={editForm.name || ""}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                />
                                            ) : (
                                                <div className="font-medium text-slate-900">{doc.name}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-500 font-mono">
                                            {doc.kd_dokter || <span className="text-red-500">Missing</span>}
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-2 border rounded"
                                                    value={editForm.specialization || ""}
                                                    onChange={e => setEditForm({ ...editForm, specialization: e.target.value })}
                                                />
                                            ) : (
                                                doc.specialization
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="w-24 p-2 border rounded"
                                                    value={editForm.consultation_fee || 0}
                                                    onChange={e => setEditForm({ ...editForm, consultation_fee: parseFloat(e.target.value) })}
                                                />
                                            ) : (
                                                formatCurrency(doc.consultation_fee)
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {isEditing ? (
                                                <select
                                                    className="p-2 border rounded bg-white"
                                                    value={editForm.is_executive ? "true" : "false"}
                                                    onChange={e => setEditForm({ ...editForm, is_executive: e.target.value === 'true' })}
                                                >
                                                    <option value="false">Regular</option>
                                                    <option value="true">Executive</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${doc.is_executive ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {doc.is_executive ? 'Executive' : 'Regular'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {isEditing ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={handleSave} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={handleCancel} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(doc)} className="p-2 hover:bg-slate-100 rounded text-slate-500">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(doc.id, doc.name)} className="p-2 hover:bg-red-100 rounded text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDoctors.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        No doctors found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
