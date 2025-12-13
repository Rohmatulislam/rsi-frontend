// features/admin/components/DoctorImageUploadField.tsx
import { useState, useRef, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface DoctorImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DoctorImageUploadField = ({ 
  value, 
  onChange,
  disabled = false
}: DoctorImageUploadFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(value);
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
      
      // Buat preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onChange(result); // Set base64 ke form data
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
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

  return (
    <div className="space-y-3">
      <Label>Image</Label>
      <div className="flex flex-col items-center space-y-3">
        <div 
          className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-dashed flex items-center justify-center cursor-pointer"
          onClick={handleUploadClick}
        >
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview dokter" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent("Doctor");
              }}
            />
          ) : (
            <div className="text-center text-slate-500">
              <span className="text-xs">Click to upload</span>
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
        
        <Input
          type="text"
          placeholder="Or enter image URL..."
          value={value || ""}
          onChange={handleUrlChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};