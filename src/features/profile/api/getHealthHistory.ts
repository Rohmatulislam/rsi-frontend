import { axiosInstance } from "~/lib/axios";

export interface HealthRecord {
    id: string;
    date: string;
    diagnosis: string;
    doctor: string;
    notes?: string;
}

export const getHealthHistory = async (): Promise<HealthRecord[]> => {
    const res = await axiosInstance.get("users/me/health-history");
    return res.data;
};
