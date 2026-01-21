
import { axiosInstance } from "~/lib/axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Banner, CreateBannerDto } from "~/features/banner/services/bannerService";
import { useCreateBanner } from "~/features/banner/api/createBanner";
import { useUpdateBanner } from "~/features/banner/api/updateBanner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getImageSrc } from "~/lib/utils";

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
    banner?: Banner | null;
}

export const BannerModal = ({ open, onClose, banner }: BannerModalProps) => {
    const isEdit = !!banner;
    const createMutation = useCreateBanner();
    const updateMutation = useUpdateBanner();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateBannerDto>({
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            imageUrl: "",
            link: "",
            linkText: "Selengkapnya",
            order: 0,
            isActive: true,
        },
    });

    const isActive = watch("isActive");

    useEffect(() => {
        if (banner) {
            reset({
                title: banner.title,
                subtitle: banner.subtitle || "",
                description: banner.description || "",
                imageUrl: banner.imageUrl,
                link: banner.link || "",
                linkText: banner.linkText || "Selengkapnya",
                order: banner.order,
                isActive: banner.isActive,
            });
            setImagePreview(getImageSrc(banner.imageUrl));
        } else {
            reset({
                title: "",
                subtitle: "",
                description: "",
                imageUrl: "",
                link: "",
                linkText: "Selengkapnya",
                order: 0,
                isActive: true,
            });
            setImagePreview("");
        }
        setImageFile(null);
    }, [banner, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 5MB");
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axiosInstance.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.url;
        } catch (error: any) {
            console.error("Upload error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to upload image";
            throw new Error(errorMessage);
        }
    };

    const onSubmit = async (data: CreateBannerDto) => {
        try {
            setIsUploading(true);

            // Upload image if new file selected
            if (imageFile) {
                const imageUrl = await uploadImage(imageFile);
                data.imageUrl = imageUrl;
            }

            if (isEdit && banner) {
                await updateMutation.mutateAsync({ id: banner.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }

            onClose();
        } catch (error: any) {
            toast.error(error.message || "Gagal menyimpan banner");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
        setValue("imageUrl", "");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Perbarui informasi banner"
                            : "Buat banner baru untuk homepage"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Input - Tabs for URL or Upload */}
                    <div className="space-y-2">
                        <Label>Gambar Banner *</Label>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageFile(null);
                                    setValue("imageUrl", watch("imageUrl") || "");
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!imageFile
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                Paste URL
                            </button>
                            <button
                                type="button"
                                onClick={() => document.getElementById("image-upload")?.click()}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageFile
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                Upload File
                            </button>
                        </div>

                        {/* URL Input */}
                        {!imageFile && (
                            <div className="space-y-2">
                                <Input
                                    id="imageUrl"
                                    {...register("imageUrl", {
                                        required: !imageFile && "URL gambar atau file wajib diisi",
                                    })}
                                    placeholder="https://images.unsplash.com/photo-xxx"
                                    onChange={(e) => {
                                        setValue("imageUrl", e.target.value);
                                        if (e.target.value) {
                                            setImagePreview(e.target.value);
                                        }
                                    }}
                                />
                                <p className="text-sm text-muted-foreground">
                                    💡 Gunakan gambar dari Unsplash.com atau URL lainnya
                                </p>
                            </div>
                        )}

                        {/* File Upload (Hidden) */}
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        {/* Preview or Upload Area */}
                        {imageFile && (
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                <p className="text-sm text-muted-foreground mb-2">
                                    File dipilih: {imageFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(imageFile.size / 1024).toFixed(2)} KB
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview("");
                                    }}
                                >
                                    Ganti File
                                </Button>
                            </div>
                        )}

                        {errors.imageUrl && !imageFile && (
                            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                        )}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative">
                            <Label>Preview</Label>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg mt-2"
                                onError={() => {
                                    setImagePreview("");
                                    if (!imageFile) {
                                        toast.error("Gambar tidak bisa dimuat. Periksa URL.");
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul *</Label>
                        <Input
                            id="title"
                            {...register("title", { required: "Judul wajib diisi" })}
                            placeholder="Contoh: Promo Spesial Hari Kemerdekaan"
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Subjudul</Label>
                        <Input
                            id="subtitle"
                            {...register("subtitle")}
                            placeholder="Contoh: Diskon hingga 50%"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Deskripsi singkat tentang banner..."
                            rows={3}
                        />
                    </div>

                    {/* Link */}
                    <div className="space-y-2">
                        <Label htmlFor="link">Link (URL)</Label>
                        <Input
                            id="link"
                            {...register("link")}
                            placeholder="https://example.com atau /halaman-internal"
                        />
                        <p className="text-sm text-muted-foreground">
                            Opsional - Link bisa berupa URL lengkap atau path internal
                        </p>
                    </div>

                    {/* Link Text */}
                    <div className="space-y-2">
                        <Label htmlFor="linkText">Teks Tombol</Label>
                        <Input
                            id="linkText"
                            {...register("linkText")}
                            placeholder="Selengkapnya"
                        />
                    </div>

                    {/* Order */}
                    <div className="space-y-2">
                        <Label htmlFor="order">Urutan</Label>
                        <Input
                            id="order"
                            type="number"
                            {...register("order", { valueAsNumber: true })}
                            placeholder="0"
                        />
                        <p className="text-sm text-muted-foreground">
                            Semakin kecil angka, semakin awal ditampilkan
                        </p>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setValue("isActive", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="space-y-0.5">
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Aktifkan banner
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Banner aktif akan ditampilkan di homepage
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUploading || createMutation.isPending || updateMutation.isPending}
                            className="flex-1"
                        >
                            {(isUploading || createMutation.isPending || updateMutation.isPending) && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? "Update" : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
