import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { RadiologiTest } from "../types";

export const getRadioTests = async (kd_pj?: string): Promise<RadiologiTest[]> => {
    const response = await axiosInstance.get("/radiologi/tests", {
        params: { kd_pj }
    });
    return response.data;
};

export const getRadioTestsQueryOptions = (kd_pj?: string) => {
    return queryOptions({
        queryKey: ["radiology", "tests", kd_pj || "default"],
        queryFn: () => getRadioTests(kd_pj),
    });
};

type UseRadioTestsOptions = {
    kd_pj?: string;
    queryConfig?: QueryConfig<typeof getRadioTests>;
};

export const useRadioTests = ({ kd_pj, queryConfig }: UseRadioTestsOptions = {}) => {
    return useQuery({
        ...getRadioTestsQueryOptions(kd_pj),
        ...queryConfig,
    });
};
