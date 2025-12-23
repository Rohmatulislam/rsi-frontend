import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

// ============ TYPES ============

export interface UnitDto {
    id: string;
    kd_bangsal: string;
    name: string;
    description?: string;
    imageUrl?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============ GET UNITS ============

type GetUnitsResponse = UnitDto[];

export const getUnits = async (): Promise<GetUnitsResponse> => {
    const response = await axiosInstance.get<GetUnitsResponse>("/inpatient/buildings");
    return response.data;
};

export const getUnitsQueryKey = () => ["inpatient-units"];

export const getUnitsQueryOptions = () => {
    return queryOptions({
        queryKey: getUnitsQueryKey(),
        queryFn: getUnits,
    });
};

export const useGetUnits = () => {
    return useQuery({
        ...getUnitsQueryOptions(),
    });
};
