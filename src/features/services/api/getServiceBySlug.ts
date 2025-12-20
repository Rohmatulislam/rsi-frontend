import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { ServiceDto } from "../types";

export const getServiceBySlug = async (slug: string) => {
    const response = await axiosInstance.get<ServiceDto>(`/services/${slug}`);
    return response.data;
};

export const getServiceBySlugQueryOptions = (slug: string) => {
    return queryOptions({
        queryKey: ["service-detail", slug],
        queryFn: () => getServiceBySlug(slug),
        enabled: !!slug,
    });
};

type UseGetServiceBySlugParams = {
    slug: string;
    queryConfig?: QueryConfig<typeof getServiceBySlug>;
};

export const useGetServiceBySlug = ({ slug, queryConfig }: UseGetServiceBySlugParams) => {
    return useQuery({
        ...getServiceBySlugQueryOptions(slug),
        ...queryConfig,
    });
};
