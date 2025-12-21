"use client";

import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { useSyncDoctors } from "~/features/admin/api/syncDoctors";
import { useUpdateDoctor } from "~/features/admin/api/updateDoctor";
import { useDeleteDoctor } from "~/features/admin/api/deleteDoctor";
import { useCreateDoctor } from "~/features/admin/api/createDoctor";
import { RefreshCw, Search, Edit2, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { DoctorDto } from "~/features/home/api/getDoctors";
import { DoctorModal } from "~/features/admin/components/DoctorModal";
import { CreateDoctorDto, UpdateDoctorDto } from "~/features/admin/types/doctor";
import { Button } from "~/components/ui/button";

export default function AdminDoctorsPage() {
    const { data: doctors, isLoading } = useGetDoctorsList({
        input: { limit: 1000 }
    });

    const { mutate: sync, isPending: isSyncing } = useSyncDoctors();
    const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();
    const { mutate: deleteDoctor, isPending: isDeleting } = useDeleteDoctor();
    const { mutate: createDoctor, isPending: isCreating } = useCreateDoctor();

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<DoctorDto | null>(null);

    const filteredDoctors = doctors?.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.kd_dokter && d.kd_dokter.toLowerCase().includes(search.toLowerCase()))
    ) || [];

    const handleAddDoctor = () => {
        setCurrentDoctor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (doctor: DoctorDto) => {
        setCurrentDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleSave = (data: CreateDoctorDto | UpdateDoctorDto, isEdit: boolean) => {
        if (isEdit) {
            // Update existing doctor
            // Clean up the payload: remove empty strings and undefined values
            const cleanedData: any = {};
            Object.entries(data).forEach(([key, value]) => {
                // Skip base64 imageUrl (should use separate upload endpoint)
                if (key === "imageUrl" && typeof value === "string" && value.startsWith("data:image")) {
                    console.log('⚠️ Skipping base64 imageUrl - use upload endpoint');
                    return;
                }

                // Skip email if it contains invalid characters (double dots, etc.)
                if (key === "email" && typeof value === "string" && value.includes("..")) {
                    console.log('⚠️ Skipping invalid email format:', value);
                    return;
                }

                // Skip empty strings (except for optional fields that can be empty)
                if (value !== "" && value !== undefined && value !== null) {
                    cleanedData[key] = value;
                } else if (value === "" && (key === "phone" || key === "bio" || key === "education" ||
                    key === "certifications" || key === "description" || key === "imageUrl" ||
                    key === "department" || key === "specialtyImage_url" || key === "sip_number" ||
                    key === "kd_dokter" || key === "slug")) {
                    // Keep empty string for optional text fields
                    cleanedData[key] = value;
                }
            });

            console.log('🚀 Update Doctor Payload:', cleanedData);

            updateDoctor({ id: currentDoctor!.id, data: cleanedData }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setCurrentDoctor(null);
                }
            });
        } else {
            // Create new doctor
            console.log('🚀 Create Doctor Payload:', data);
            createDoctor(data as CreateDoctorDto, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setCurrentDoctor(null);
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

    const isSaving = isUpdating || isCreating;

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
                    <p className="text-slate-500">Manage doctor data (Synced from Khanza)</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAddDoctor}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Doctor</span>
                    </Button>
                    <Button
                        onClick={() => sync()}
                        disabled={isSyncing}
                        variant="default"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isSyncing ? "Syncing..." : "Sync from SIMRS"}</span>
                    </Button>
                </div>
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
                            {filteredDoctors.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50">
                                    <td className="p-4">
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
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{doc.name}</div>
                                    </td>
                                    <td className="p-4 text-slate-500 font-mono">
                                        {doc.kd_dokter || <span className="text-red-500">Missing</span>}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {doc.specialization}
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">
                                        {formatCurrency(doc.consultation_fee)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${doc.is_executive ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {doc.is_executive ? 'Executive' : 'Regular'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(doc)} className="p-2 hover:bg-slate-100 rounded text-slate-500">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(doc.id, doc.name)} className="p-2 hover:bg-red-100 rounded text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

            <DoctorModal
                key={currentDoctor?.id || 'new-doctor'}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentDoctor(null);
                }}
                doctor={currentDoctor}
                onSave={handleSave}
                isSaving={isSaving}
            />
        </div>
    );
}
