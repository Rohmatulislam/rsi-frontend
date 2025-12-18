/**
 * Types for image upload functionality
 * @module features/admin/types/imageUpload.types
 */

/** Configuration for image upload */
export interface ImageUploadConfig {
    maxSizeBytes: number;
    allowedTypes: string[];
    maxWidth?: number;
    maxHeight?: number;
}

/** State for image upload component */
export interface ImageUploadState {
    previewUrl: string | null;
    selectedFile: File | null;
    error: string | null;
    isUploading: boolean;
    uploadSuccess: boolean;
}

/** Result from image upload API */
export interface ImageUploadResult {
    id: string;
    imageUrl: string;
}

/** Props for image upload field component */
export interface ImageUploadFieldProps {
    /** Current image URL value */
    value: string;
    /** Callback when URL value changes */
    onChange: (value: string) => void;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Entity ID (e.g., doctor ID) - required for upload mode */
    entityId?: string;
    /** Callback to upload file, returns new URL */
    onUpload?: (file: File) => Promise<string | void>;
    /** Whether upload is in progress */
    isUploading?: boolean;
    /** Label for the field */
    label?: string;
    /** Placeholder text for URL input */
    placeholder?: string;
    /** Callback when a file is selected (before upload) */
    onFileSelect?: (file: File | null) => void;
}

/** Validation result for image file */
export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
}
