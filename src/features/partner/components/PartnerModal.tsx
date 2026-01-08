import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "~/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { useCreatePartner } from "../api/createPartner";
import { useUpdatePartner } from "../api/updatePartner";
import { Partner } from "../services/partnerService";
import { ImageUploadField } from "~/features/admin/components/ImageUploadField";

const partnerSchema = z.object({
    name: z.string().min(1, "Nama mitra wajib diisi"),
    imageUrl: z.string().min(1, "Logo wajib diunggah"),
    link: z.string().url("Link tidak valid").optional().or(z.literal("")),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

type PartnerFormValues = {
    name: string;
    imageUrl: string;
    link: string;
    order: number;
    isActive: boolean;
};

interface PartnerModalProps {
    open: boolean;
    onClose: () => void;
    partner: Partner | null;
}

export function PartnerModal({ open, onClose, partner }: PartnerModalProps) {
    const createMutation = useCreatePartner();
    const updateMutation = useUpdatePartner();

    const defaultValues = useMemo<PartnerFormValues>(() => ({
        name: "",
        imageUrl: "",
        link: "",
        order: 0,
        isActive: true,
    }), []);

    const form = useForm<PartnerFormValues>({
        resolver: zodResolver(partnerSchema) as any,
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            if (partner) {
                form.reset({
                    name: partner.name,
                    imageUrl: partner.imageUrl,
                    link: partner.link || "",
                    order: partner.order || 0,
                    isActive: partner.isActive ?? true,
                });
            } else {
                form.reset(defaultValues);
            }
        }
    }, [partner, form, open, defaultValues]);

    const onSubmit: SubmitHandler<PartnerFormValues> = (values) => {
        if (partner) {
            updateMutation.mutate({ id: partner.id, ...values }, {
                onSuccess: () => onClose(),
            });
        } else {
            createMutation.mutate(values, {
                onSuccess: () => onClose(),
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {partner ? "Edit Mitra" : "Tambah Mitra"}
                    </DialogTitle>
                    <DialogDescription>
                        {partner ? "Perbarui informasi mitra kerja sama rsi." : "Tambahkan mitra kerja sama baru rsi."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Mitra</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: BPJS Kesehatan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo Mitra</FormLabel>
                                    <FormControl>
                                        <ImageUploadField
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Gunakan logo dengan latar belakang transparan (PNG) untuk hasil terbaik.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link Website Partners (Opsional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Urutan</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Status Aktif</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <span className="text-sm font-medium">
                                                    {field.value ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {partner ? "Simpan Perubahan" : "Tambah Mitra"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
