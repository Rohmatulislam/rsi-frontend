// features/admin/components/ImageUploadField.tsx
import { useState, useRef, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ImagePlus, X } from "lucide-react";
import { getImageSrc } from "~/lib/utils";

interface ImageUploadFieldProps {
    label?: string;
    value: string | undefined;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    shape?: "rounded" | "circle";
}

export const ImageUploadField = ({
    label = "Gambar",
    value,
    onChange,
    disabled = false,
    placeholder = "Klik untuk upload",
    shape = "rounded"
}: ImageUploadFieldProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreviewUrl(value || null);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi file
            if (!file.type.startsWith('image/')) {
                setError("Silakan pilih file gambar (jpg, png, gif)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB
                setError("Ukuran file terlalu besar. Maksimal 5MB");
                return;
            }

            setError(null);

            // Buat preview dan convert ke base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreviewUrl(result);
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        onChange(url);
        if (url) {
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
        setError(null);
    };

    const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

    return (
        <div className="space-y-3">
            <Label>{label}</Label>
            <div className="flex flex-col items-center space-y-3">
                <div
                    className={`relative w-32 h-32 ${shapeClass} overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 transition-all`}
                    onClick={handleUploadClick}
                >
                    {previewUrl ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getImageSrc(previewUrl)}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={() => {
                                    setPreviewUrl(null);
                                    setError("Gagal memuat gambar");
                                }}
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-slate-400 flex flex-col items-center gap-1">
                            <ImagePlus className="w-8 h-8" />
                            <span className="text-xs">{placeholder}</span>
                        </div>
                    )}
                </div>

                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled}
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <div className="w-full">
                    <Input
                        type="text"
                        placeholder="Atau masukkan URL gambar..."
                        value={value || ""}
                        onChange={handleUrlChange}
                        disabled={disabled}
                        className="text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
