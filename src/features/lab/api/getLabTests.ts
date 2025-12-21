import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { LabTest } from "../services/labService";

export const getLabTests = async (kd_pj?: string): Promise<LabTest[]> => {
    const response = await axiosInstance.get("/lab/tests", {
        params: { kd_pj }
    });
    return response.data;
};

export const getLabTestsQueryOptions = (kd_pj?: string) => {
    return queryOptions({
        queryKey: ["lab", "tests", kd_pj || "default"],
        queryFn: () => getLabTests(kd_pj),
    });
};

type UseLabTestsOptions = {
    kd_pj?: string;
    queryConfig?: QueryConfig<typeof getLabTests>;
};

export const useLabTests = ({ kd_pj, queryConfig }: UseLabTestsOptions = {}) => {
    return useQuery({
        ...getLabTestsQueryOptions(kd_pj),
        ...queryConfig,
    });
};
