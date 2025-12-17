/**
 * Utility functions for image upload
 * @module features/admin/utils/imageUpload.utils
 */

import type { ImageValidationResult } from "../types/imageUpload.types";
import {
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_SIZE_BYTES,
    IMAGE_UPLOAD_ERRORS,
    PLACEHOLDER_AVATAR_BASE_URL,
} from "../constants/imageUpload.constants";

/**
 * Validates an image file for upload
 * @param file - The file to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateImageFile(file: File): ImageValidationResult {
    // Check file type
    if (!file.type.startsWith("image/")) {
        return {
            isValid: false,
            error: IMAGE_UPLOAD_ERRORS.INVALID_TYPE,
        };
    }

    // Check if specific type is allowed
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
        return {
            isValid: false,
            error: IMAGE_UPLOAD_ERRORS.INVALID_TYPE,
        };
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return {
            isValid: false,
            error: IMAGE_UPLOAD_ERRORS.FILE_TOO_LARGE,
        };
    }

    return { isValid: true };
}

/**
 * Creates a preview URL from a file using FileReader
 * @param file - The image file to create preview from
 * @returns Promise that resolves to the data URL
 */
export function createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read file"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Generates a placeholder avatar URL based on name
 * @param name - The name to generate avatar for
 * @returns URL string for the placeholder avatar
 */
export function getPlaceholderUrl(name: string): string {
    const encodedName = encodeURIComponent(name || "User");
    return `${PLACEHOLDER_AVATAR_BASE_URL}?name=${encodedName}`;
}

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string like "2.5 MB"
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Extracts file extension from filename
 * @param filename - The filename to extract extension from
 * @returns The file extension without dot, or empty string
 */
export function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    if (lastDot === -1) return "";
    return filename.substring(lastDot + 1).toLowerCase();
}
