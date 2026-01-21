import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { DoctorDto, DoctorSortBy } from "~/features/home/api/getDoctors";

export { DoctorSortBy };
export type { DoctorDto };

type GetDoctorsInput = {
    limit?: number;
    sort?: DoctorSortBy;
    isExecutive?: boolean;
    search?: string;
    showAll?: boolean;
    includeInactive?: boolean;
    poliCode?: string;
};

type GetDoctorsResponse = DoctorDto[];

export const getDoctors = async (input?: GetDoctorsInput) => {
    const response = await axiosInstance.get<GetDoctorsResponse>("/doctors", {
        params: input,
    });
    return response.data;
};

export const getDoctorsQueryKey = (input?: GetDoctorsInput) => ["doctors-list", input];

export const getDoctorsQueryOptions = (input?: GetDoctorsInput) => {
    return queryOptions({
        queryKey: getDoctorsQueryKey(input),
        queryFn: () => getDoctors(input),
    });
}

type UseGetDoctorsParams = {
    input?: GetDoctorsInput;
    queryConfig?: QueryConfig<typeof getDoctors>;
};

export const useGetDoctorsList = ({ input, queryConfig }: UseGetDoctorsParams = {}) => {
    return useQuery({
        ...getDoctorsQueryOptions(input),
        ...queryConfig,
    });
};
