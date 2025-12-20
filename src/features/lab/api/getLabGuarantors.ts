import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { LabGuarantor } from "../types";

export const getLabGuarantors = async (): Promise<LabGuarantor[]> => {
    const response = await axiosInstance.get("/lab/guarantors");
    return response.data;
};

export const getLabGuarantorsQueryOptions = () => {
    return queryOptions({
        queryKey: ["lab", "guarantors"],
        queryFn: getLabGuarantors,
    });
};

type UseLabGuarantorsOptions = {
    queryConfig?: QueryConfig<typeof getLabGuarantors>;
};

export const useLabGuarantors = ({ queryConfig }: UseLabGuarantorsOptions = {}) => {
    return useQuery({
        ...getLabGuarantorsQueryOptions(),
        ...queryConfig,
    });
};
