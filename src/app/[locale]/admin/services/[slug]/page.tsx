"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useUpdateService } from "~/features/services/api/updateService";
import { useCreateServiceItem } from "~/features/services/api/createServiceItem";
import { useUpdateServiceItem } from "~/features/services/api/updateServiceItem";
import { useDeleteServiceItem } from "~/features/services/api/deleteServiceItem";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Loader2, Layout, Package, Building2 } from "lucide-react";
import Link from "next/link";
import { ServiceDetailForm } from "~/features/services/components/admin/ServiceDetailForm";
import { ServiceItemManagement } from "~/features/services/components/admin/ServiceItemManagement";
import { UnitManagement } from "~/features/admin/components/UnitManagement";
import { BedManagement } from "~/features/admin/components/BedManagement";

type TabType = "detail" | "items" | "units" | "beds";

export default function ServiceEditPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const isRawatInap = slug === "rawat-inap";

    const [activeTab, setActiveTab] = useState<TabType>("detail");
    const { data: service, isLoading } = useGetServiceBySlug({ slug });

    // Mutations
    const updateService = useUpdateService();
    const createItem = useCreateServiceItem();
    const updateItem = useUpdateServiceItem();
    const deleteItem = useDeleteServiceItem();

    if (isLoading || !service) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleUpdateService = (data: any) => {
        updateService.mutate({ id: service.id, data });
    };

    const handleCreateItem = (data: any) => {
        createItem.mutate({ data: { ...data, serviceId: service.id } });
    };

    const handleUpdateItem = (id: string, data: any) => {
        updateItem.mutate({ id, data });
    };

    const handleDeleteItem = (id: string) => {
        deleteItem.mutate({ id });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
                        <p className="text-muted-foreground">Kelola konten dan paket layanan rumah sakit.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/layanan/${service.slug}`} target="_blank">
                            Lihat Halaman Publik
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto">
                <button
                    onClick={() => setActiveTab("detail")}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "detail" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Layout className="h-4 w-4" /> Detail Layanan
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("items")}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "items" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" /> Item & Paket Layanan ({service.items?.length || 0})
                    </div>
                </button>
                {isRawatInap && (
                    <>
                        <button
                            onClick={() => setActiveTab("units")}
                            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "units" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Manajemen Unit
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("beds")}
                            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "beds" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" /> Manajemen Bed
                            </div>
                        </button>
                    </>
                )}
            </div>

            {/* Tab: Detail Layanan */}
            {activeTab === "detail" && (
                <ServiceDetailForm
                    service={service as any}
                    isUpdating={updateService.isPending}
                    onUpdate={handleUpdateService}
                />
            )}

            {/* Tab: Item & Paket */}
            {activeTab === "items" && (
                <ServiceItemManagement
                    service={service as any}
                    isCreatingItem={createItem.isPending}
                    isUpdatingItem={updateItem.isPending}
                    isDeletingItem={deleteItem.isPending}
                    onCreateItem={handleCreateItem}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                />
            )}

            {/* Tab: Manajemen Unit (Rawat Inap Only) */}
            {activeTab === "units" && isRawatInap && (
                <UnitManagement />
            )}

            {/* Tab: Manajemen Bed (Rawat Inap Only) */}
            {activeTab === "beds" && isRawatInap && (
                <BedManagement />
            )}
        </div>
    );
}
