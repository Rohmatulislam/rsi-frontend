"use client";

import { useState } from "react";
import { updateDoctorImage } from "~/features/doctor/services/doctorService";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface DoctorImageUploadProps {
  doctorId: string;
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string) => void;
}

export const DoctorImageUpload = ({ 
  doctorId, 
  currentImageUrl, 
  onImageUpdate 
}: DoctorImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setSelectedFile(file);
      
      // Buat preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Silakan pilih file terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        try {
          const updatedDoctor = await updateDoctorImage(doctorId, reader.result as string);
          onImageUpdate(updatedDoctor.imageUrl || "");
        } catch (uploadError) {
          setError("Gagal mengunggah gambar: " + (uploadError as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError("Gagal membaca file");
        setIsLoading(false);
      };
    } catch (error) {
      setError("Gagal mengunggah gambar: " + (error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview dokter" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 border-2 border-dashed flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full max-w-md"
        />
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={isLoading || !selectedFile}
            className="w-full"
          >
            {isLoading ? "Mengunggah..." : "Unggah Gambar"}
          </Button>
        </div>
      </div>
    </div>
  );
};