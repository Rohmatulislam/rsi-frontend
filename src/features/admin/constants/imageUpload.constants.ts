/**
 * Constants for image upload functionality
 * @module features/admin/constants/imageUpload.constants
 */

import type { ImageUploadConfig } from "../types/imageUpload.types";

/** Maximum file size in bytes (5MB) */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

/** Maximum file size in MB for display */
export const MAX_IMAGE_SIZE_MB = 5;

/** Allowed image MIME types */
export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
] as const;

/** Allowed image extensions for display */
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

/** Default upload configuration */
export const DEFAULT_UPLOAD_CONFIG: ImageUploadConfig = {
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    allowedTypes: [...ALLOWED_IMAGE_TYPES],
};

/** Localized error messages for image upload */
export const IMAGE_UPLOAD_ERRORS = {
    INVALID_TYPE: "Silakan pilih file gambar (jpg, png, gif, webp)",
    FILE_TOO_LARGE: `Ukuran file terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB}MB`,
    UPLOAD_FAILED: "Gagal upload gambar",
    NO_FILE_SELECTED: "Silakan pilih file terlebih dahulu",
    NETWORK_ERROR: "Koneksi gagal. Silakan coba lagi",
} as const;

/** Success messages */
export const IMAGE_UPLOAD_SUCCESS = {
    UPLOADED: "Foto berhasil diupload!",
} as const;

/** Placeholder avatar URL generator */
export const PLACEHOLDER_AVATAR_BASE_URL = "https://ui-avatars.com/api/";

/** Duration to show success message (ms) */
export const SUCCESS_MESSAGE_DURATION_MS = 3000;
