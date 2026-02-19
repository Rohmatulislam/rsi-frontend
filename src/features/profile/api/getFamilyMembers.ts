import { axiosInstance } from "~/lib/axios";

export interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    nik?: string;
    birthDate?: string;
    gender?: string;
    phone?: string;
    noRM?: string | null;
}

export const getFamilyMembers = async (): Promise<FamilyMember[]> => {
    const res = await axiosInstance.get("users/me/family");
    return res.data;
};

export const addFamilyMember = async (data: {
    name: string;
    relationship: string;
    nik?: string;
    birthDate?: string;
    gender?: string;
    phone?: string;
}): Promise<FamilyMember> => {
    const res = await axiosInstance.post("/users/me/family", data);
    return res.data;
};

export const removeFamilyMember = async (id: string): Promise<{ message: string }> => {
    const res = await axiosInstance.delete(`/users/me/family/${id}`);
    return res.data;
};
