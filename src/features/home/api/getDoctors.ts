import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export enum DoctorSortBy {
    RECOMMENDED = "recommended",
}

type GetDoctorsInput = {
   limit?: number;
   sort?: DoctorSortBy;
   
};

export type DoctorDto = {
    id: string;
    name: string;
    specialization: string | null;
    consultation_fee: number | null;
    imageUrl: string | null;
    is_executive: boolean | null;
    bpjs: boolean | null;
    slug: string | null;
    department: string | null;
    schedules: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[];
    categories: {
        name: string;
    }[];
};

type GetDoctorsResponse = DoctorDto[];

export const getDoctors = async (input?: GetDoctorsInput) => {
    const response = await axiosInstance.get<GetDoctorsResponse>("/doctors", {
        params: input,
    });
    return response.data;
};

export const getDoctorsQueryKey = (input?: GetDoctorsInput) => ["doctors", input];

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

export const useGetDoctors = ({ input, queryConfig }: UseGetDoctorsParams = {}) => {
    return useQuery({
        ...getDoctorsQueryOptions(input),
        ...queryConfig,
    });
};

