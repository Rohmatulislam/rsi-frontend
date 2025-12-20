"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface AddServiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    onCreate: (data: { name: string; slug: string; isActive: boolean; isFeatured: boolean; order: number }) => void;
}

export function AddServiceDialog({ isOpen, onOpenChange, isCreating, onCreate }: AddServiceDialogProps) {
    const [newService, setNewService] = useState({
        name: "",
        slug: "",
        isActive: true,
        isFeatured: false,
        order: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newService);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Layanan Baru</DialogTitle>
                        <DialogDescription>
                            Buat entitas layanan baru. Anda bisa mengedit detail konten setelah layanan dibuat.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nama</Label>
                            <Input
                                id="name"
                                value={newService.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                    setNewService({ ...newService, name, slug });
                                }}
                                className="col-span-3"
                                placeholder="Contoh: Medical Check Up"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="slug" className="text-right">Slug</Label>
                            <Input
                                id="slug"
                                value={newService.slug}
                                onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                                className="col-span-3"
                                placeholder="mcu"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Layanan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
