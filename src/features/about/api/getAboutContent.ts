import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export interface AboutContent {
    key: string;
    value: string;
}

type GetAboutContentResponse = AboutContent;

export const getAboutContent = async (key: string) => {
    const response = await axiosInstance.get<GetAboutContentResponse>(`/about/content/${key}`);
    return response.data;
};

export const getAboutContentQueryKey = (key: string) => ["about-content", key];

export const getAboutContentQueryOptions = (key: string) => {
    return queryOptions({
        queryKey: getAboutContentQueryKey(key),
        queryFn: () => getAboutContent(key),
    });
}

type UseGetAboutContentParams = {
    key: string;
    queryConfig?: QueryConfig<typeof getAboutContent>;
};

export const useGetAboutContent = ({ key, queryConfig }: UseGetAboutContentParams) => {
    return useQuery({
        ...getAboutContentQueryOptions(key),
        ...queryConfig,
    });
};

// Specific hooks for common content types
export const useGetHistory = (queryConfig?: QueryConfig<typeof getAboutContent>) => {
    return useGetAboutContent({ key: "history", queryConfig });
};

export const useGetVision = (queryConfig?: QueryConfig<typeof getAboutContent>) => {
    return useGetAboutContent({ key: "vision", queryConfig });
};

export const useGetMission = (queryConfig?: QueryConfig<typeof getAboutContent>) => {
    return useGetAboutContent({ key: "mission", queryConfig });
};
