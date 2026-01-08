import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Partner } from "../services/partnerService";
import { partnerKeys } from "./getPartners";

export const getActivePartners = async (): Promise<Partner[]> => {
    const { data } = await axiosInstance.get("/partners/active");
    return data;
};

export const useGetActivePartners = () => {
    return useQuery({
        queryKey: partnerKeys.active(),
        queryFn: getActivePartners,
    });
};
