import { axiosInstance } from "~/lib/axios";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    profile?: {
        phone?: string;
        address?: string;
        birthDate?: string;
        gender?: string;
        nik?: string;
        bloodType?: string;
    };
}

export const getProfile = async (): Promise<UserProfile> => {
    const res = await axiosInstance.get("users/me");
    return res.data;
};

export const updateProfile = async (data: {
    name?: string;
    phone?: string;
    image?: string;
    nik?: string;
}): Promise<UserProfile> => {
    const res = await axiosInstance.patch("users/me", data);
    return res.data;
};
