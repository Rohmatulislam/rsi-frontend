import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { DoctorDto } from "~/features/home/api/getDoctors";

export const getDoctorBySlug = async (slug: string) => {
    const response = await axiosInstance.get<DoctorDto>(`/doctors/${slug}`);
    return response.data;
};

export const getDoctorBySlugQueryKey = (slug: string) => ["doctors", slug];

export const getDoctorBySlugQueryOptions = (slug: string) => {
    return queryOptions({
        queryKey: getDoctorBySlugQueryKey(slug),
        queryFn: () => getDoctorBySlug(slug),
    });
};

type UseGetDoctorBySlugParams = {
    slug: string;
    queryConfig?: QueryConfig<typeof getDoctorBySlug>;
};

export const useGetDoctorBySlug = ({ slug, queryConfig }: UseGetDoctorBySlugParams) => {
    return useQuery({
        ...getDoctorBySlugQueryOptions(slug),
        ...queryConfig,
        enabled: !!slug,
    });
};
