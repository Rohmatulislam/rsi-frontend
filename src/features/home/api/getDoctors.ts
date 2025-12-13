import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export enum DoctorSortBy {
    RECOMMENDED = "recommended",
}

type GetDoctorsInput = {
    limit?: number;
    sort?: DoctorSortBy;
    isExecutive?: boolean;
};

export type DoctorDto = {
    id: string;
    name: string;
    email: string | null;
    licenseNumber: string | null;
    phone: string | null;
    specialization: string | null;
    department: string | null;
    imageUrl: string | null;
    bio: string | null;
    experience_years: number | null;
    education: string | null;
    certifications: string | null;
    consultation_fee: number | null;
    specialtyImage_url: string | null;
    is_executive: boolean | null;
    sip_number: string | null;
    bpjs: boolean | null;
    slug: string | null;
    kd_dokter: string | null;
    description: string | null;
    isActive: boolean;
    schedules: {
        id: string;
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

