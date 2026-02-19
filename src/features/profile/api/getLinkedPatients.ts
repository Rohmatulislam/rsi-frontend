import { axiosInstance } from "~/lib/axios";

export interface LinkedPatient {
    noRM: string;
    name: string;
    type: string;
    lastDate?: string;
}

export const getLinkedPatients = async (): Promise<LinkedPatient[]> => {
    const res = await axiosInstance.get("/users/me/linked-patients");
    return res.data;
};
