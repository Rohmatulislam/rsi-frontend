import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { PrescriptionStatusDto } from "../services/farmasiService";

export const getPrescriptionStatus = async (identifier: string) => {
    if (!identifier) return null;
    const response = await axiosInstance.get<PrescriptionStatusDto>(
        `/farmasi/prescription/status/${identifier}`
    );
    return response.data;
};

export const getPrescriptionStatusQueryOptions = (identifier: string) => {
    return queryOptions({
        queryKey: ["prescription-status", identifier],
        queryFn: () => getPrescriptionStatus(identifier),
        enabled: !!identifier,
        retry: false, // Don't retry if not found
    });
};

type UseGetPrescriptionStatusParams = {
    identifier: string;
    queryConfig?: QueryConfig<typeof getPrescriptionStatus>;
};

export const useGetPrescriptionStatus = ({
    identifier,
    queryConfig
}: UseGetPrescriptionStatusParams) => {
    return useQuery({
        ...getPrescriptionStatusQueryOptions(identifier),
        ...queryConfig,
    });
};
