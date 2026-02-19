import { axiosInstance } from "~/lib/axios";

export interface HealthRecord {
    id: string;
    date: string;
    diagnosis: string;
    doctor: string;
    notes?: string;
}

export const getHealthHistory = async (noRM?: string): Promise<HealthRecord[]> => {
    // TODO: Implement actual fetching using noRM
    console.log("Fetching health history for:", noRM);
    const res = await axiosInstance.get("users/me/health-history");
    return res.data;
};
