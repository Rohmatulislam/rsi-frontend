import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export interface Milestone {
    id: string;
    year: string;
    title: string;
    description: string;
    icon: string;
    highlight: boolean;
    order: number;
}

type GetMilestonesResponse = Milestone[];

export const getMilestones = async () => {
    const response = await axiosInstance.get<GetMilestonesResponse>("/about/milestones");
    return response.data;
};

export const getMilestonesQueryKey = () => ["about-milestones"];

export const getMilestonesQueryOptions = () => {
    return queryOptions({
        queryKey: getMilestonesQueryKey(),
        queryFn: () => getMilestones(),
    });
}

type UseGetMilestonesParams = {
    queryConfig?: QueryConfig<typeof getMilestones>;
};

export const useGetMilestones = ({ queryConfig }: UseGetMilestonesParams = {}) => {
    return useQuery({
        ...getMilestonesQueryOptions(),
        ...queryConfig,
    });
};
