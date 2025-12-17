/**
 * API functions for uploading doctor images
 * @module features/admin/api/uploadDoctorImage
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { ImageUploadResult } from "../types/imageUpload.types";
import { IMAGE_UPLOAD_ERRORS } from "../constants/imageUpload.constants";

/** Parameters for uploading a doctor image */
interface UploadDoctorImageParams {
    /** Doctor ID */
    id: string;
    /** Image file to upload */
    file: File;
}

/**
 * Uploads a doctor profile image
 * @param params - Upload parameters containing doctor ID and file
 * @returns Promise with the upload result containing new image URL
 * @throws Error if upload fails
 */
export async function uploadDoctorImage({
    id,
    file,
}: UploadDoctorImageParams): Promise<ImageUploadResult> {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axiosInstance.post<ImageUploadResult>(
            `/doctors/${id}/upload-image`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        // Enhance error message
        const message = error.response?.data?.message
            || error.message
            || IMAGE_UPLOAD_ERRORS.UPLOAD_FAILED;
        throw new Error(message);
    }
}

/**
 * React Query hook for uploading doctor images
 * Handles cache invalidation and error handling
 */
export function useUploadDoctorImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadDoctorImage,
        onSuccess: () => {
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
        },
        onError: (error: Error) => {
            console.error("[useUploadDoctorImage] Upload failed:", error.message);
        },
    });
}
