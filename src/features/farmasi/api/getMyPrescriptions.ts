import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { PrescriptionResult } from "../services/farmasiService";

export const getMyPrescriptions = async (userId: string) => {
    if (!userId) return [];
    const response = await axiosInstance.get<PrescriptionResult[]>(
        `/farmasi/prescription/my/${userId}`
    );
    return response.data;
};

export const getMyPrescriptionsQueryOptions = (userId: string) => {
    return queryOptions({
        queryKey: ["my-prescriptions", userId],
        queryFn: () => getMyPrescriptions(userId),
        enabled: !!userId,
    });
};

type UseGetMyPrescriptionsParams = {
    userId?: string;
    queryConfig?: QueryConfig<typeof getMyPrescriptions>;
};

export const useGetMyPrescriptions = ({
    userId,
    queryConfig
}: UseGetMyPrescriptionsParams = {}) => {
    return useQuery({
        ...getMyPrescriptionsQueryOptions(userId || ""),
        ...queryConfig,
    });
};
