/**
 * Doctor Image Upload Field Component
 * Handles image selection, preview, and upload for doctor profiles
 * 
 * @module features/admin/components/DoctorImageUploadField
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Upload, Loader2, CheckCircle } from "lucide-react";

import type { ImageUploadFieldProps, ImageUploadState } from "../types/imageUpload.types";
import { IMAGE_UPLOAD_SUCCESS, SUCCESS_MESSAGE_DURATION_MS } from "../constants/imageUpload.constants";
import { validateImageFile, createImagePreview, getPlaceholderUrl } from "../utils/imageUpload.utils";

// ============================================================================
// Sub-Components
// ============================================================================

interface ImagePreviewProps {
  previewUrl: string | null;
  onClick: () => void;
  disabled?: boolean;
}

/** Circular image preview with click-to-select functionality */
const ImagePreview = ({ previewUrl, onClick, disabled }: ImagePreviewProps) => (
  <div
    className={`
      w-32 h-32 rounded-full overflow-hidden bg-slate-100 
      border-2 border-dashed flex items-center justify-center 
      transition-colors
      ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary/50"}
    `}
    onClick={disabled ? undefined : onClick}
  >
    {previewUrl ? (
      <img
        src={previewUrl}
        alt="Preview"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getPlaceholderUrl("Doctor");
        }}
      />
    ) : (
      <div className="text-center text-slate-500">
        <Upload className="w-6 h-6 mx-auto mb-1" />
        <span className="text-xs">Klik untuk pilih</span>
      </div>
    )}
  </div>
);

interface UploadButtonProps {
  onClick: () => void;
  isUploading: boolean;
  disabled?: boolean;
}

/** Upload button with loading state */
const UploadButton = ({ onClick, isUploading, disabled }: UploadButtonProps) => (
  <Button
    type="button"
    onClick={onClick}
    disabled={isUploading || disabled}
    className="gap-2"
    variant="default"
  >
    {isUploading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Uploading...
      </>
    ) : (
      <>
        <Upload className="w-4 h-4" />
        Upload Foto
      </>
    )}
  </Button>
);

interface StatusMessageProps {
  error: string | null;
  success: boolean;
  selectedFileName?: string;
}

/** Status messages for error, success, or file selection */
const StatusMessage = ({ error, success, selectedFileName }: StatusMessageProps) => (
  <>
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}

    {selectedFileName && !error && (
      <p className="text-sm text-slate-500">
        File dipilih: {selectedFileName}
      </p>
    )}

    {success && (
      <p className="text-green-600 text-sm flex items-center gap-1">
        <CheckCircle className="w-4 h-4" />
        {IMAGE_UPLOAD_SUCCESS.UPLOADED}
      </p>
    )}
  </>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * Image upload field for doctor profile images
 * Supports both file upload (edit mode) and URL input (create mode)
 */
export const DoctorImageUploadField = ({
  value,
  onChange,
  disabled = false,
  entityId: doctorId,
  onUpload,
  isUploading = false,
  onFileSelect,
  label = "Image",
  placeholder = "Or enter image URL...",
}: ImageUploadFieldProps) => {
  // State
  const [state, setState] = useState<ImageUploadState>({
    previewUrl: value || null,
    selectedFile: null,
    error: null,
    isUploading: false,
    uploadSuccess: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with external value changes
  useEffect(() => {
    if (!state.selectedFile) {
      setState(prev => ({ ...prev, previewUrl: value || null }));
    }
  }, [value, state.selectedFile]);

  // Handlers
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setState(prev => ({ ...prev, error: validation.error || null }));
      return;
    }

    // Create preview
    try {
      const preview = await createImagePreview(file);
      setState(prev => ({
        ...prev,
        selectedFile: file,
        previewUrl: preview,
        error: null,
        uploadSuccess: false,
      }));
      onFileSelect?.(file);
    } catch {
      setState(prev => ({ ...prev, error: "Gagal membaca file" }));
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!state.selectedFile || !onUpload) return;

    try {
      const newImageUrl = await onUpload(state.selectedFile);

      setState(prev => ({
        ...prev,
        previewUrl: newImageUrl || prev.previewUrl,
        selectedFile: null,
        error: null,
        uploadSuccess: true,
      }));

      // Auto-hide success message
      setTimeout(() => {
        setState(prev => ({ ...prev, uploadSuccess: false }));
      }, SUCCESS_MESSAGE_DURATION_MS);
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || "Gagal upload gambar"
      }));
    }
  }, [state.selectedFile, onUpload]);

  const handlePreviewClick = useCallback(() => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  }, [disabled, isUploading]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setState(prev => ({
      ...prev,
      previewUrl: url || null,
      selectedFile: null,
      error: null,
    }));
  }, [onChange]);

  // Derived state
  const isEditMode = !!doctorId;
  const canUpload = isEditMode && state.selectedFile && onUpload;

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div className="flex flex-col items-center space-y-3">
        <ImagePreview
          previewUrl={state.previewUrl}
          onClick={handlePreviewClick}
          disabled={disabled || isUploading}
        />

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <StatusMessage
          error={state.error}
          success={state.uploadSuccess}
          selectedFileName={state.selectedFile?.name}
        />

        {canUpload && (
          <UploadButton
            onClick={handleUpload}
            isUploading={isUploading}
            disabled={disabled}
          />
        )}

        {/* URL input for create mode */}
        {!isEditMode && (
          <Input
            type="text"
            placeholder={placeholder}
            value={value || ""}
            onChange={handleUrlChange}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};