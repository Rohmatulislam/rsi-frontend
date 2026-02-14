import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Partner } from "../services/partnerService";

export const partnerKeys = {
    all: ["partners"] as const,
    active: () => [...partnerKeys.all, "active"] as const,
    detail: (id: string) => [...partnerKeys.all, "detail", id] as const,
};

export const getPartners = async (): Promise<Partner[]> => {
    const { data } = await axiosInstance.get("partners");
    return data;
};

export const useGetPartners = () => {
    return useQuery({
        queryKey: partnerKeys.all,
        queryFn: getPartners,
    });
};
