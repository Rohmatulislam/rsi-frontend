"use client";

import { useGetServices } from "~/features/services/api/getServices";
import { useDeleteService } from "~/features/services/api/deleteService";
import { useCreateService } from "~/features/services/api/createService";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddServiceDialog } from "~/features/services/components/admin/AddServiceDialog";
import { ServiceListTable } from "~/features/services/components/admin/ServiceListTable";

export default function AdminServicesPage() {
    const { data: services, isLoading } = useGetServices();
    const { mutate: deleteService, isPending: isDeleting } = useDeleteService();
    const { mutate: createService, isPending: isCreating } = useCreateService();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleDelete = (id: string) => {
        deleteService({ id });
    };

    const handleCreate = (data: any) => {
        createService({ data }, {
            onSuccess: () => {
                setIsAddDialogOpen(false);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Item & Layanan</h1>
                    <p className="text-muted-foreground text-lg">
                        Kelola konten halaman layanan, paket MCU, dan fasilitas rawat inap.
                    </p>
                </div>

                <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4" /> Tambah Layanan Baru
                </Button>

                <AddServiceDialog
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    isCreating={isCreating}
                    onCreate={handleCreate}
                />
            </div>

            <ServiceListTable
                services={services}
                isLoading={isLoading}
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </div>
    );
}
