import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { RadiologiGuarantor } from "../services/radiologyService";

export const getRadioGuarantors = async (): Promise<RadiologiGuarantor[]> => {
    const response = await axiosInstance.get("/radiologi/guarantors");
    return response.data;
};

export const getRadioGuarantorsQueryOptions = () => {
    return queryOptions({
        queryKey: ["radiology", "guarantors"],
        queryFn: () => getRadioGuarantors(),
    });
};

type UseRadioGuarantorsOptions = {
    queryConfig?: QueryConfig<typeof getRadioGuarantors>;
};

export const useRadioGuarantors = ({ queryConfig }: UseRadioGuarantorsOptions = {}) => {
    return useQuery({
        ...getRadioGuarantorsQueryOptions(),
        ...queryConfig,
    });
};
