import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance as axios } from "~/lib/axios";
import { BedAvailability } from "../types";

export const getBedAvailability = async (): Promise<BedAvailability[]> => {
    const response = await axios.get("/inpatient/bed-availability");
    return response.data;
};

export const bedAvailabilityQueryOptions = queryOptions({
    queryKey: ["bed-availability"],
    queryFn: getBedAvailability,
    refetchInterval: 60000, // Refresh every minute for real-time data
});

export const useGetBedAvailability = () => {
    return useQuery(bedAvailabilityQueryOptions);
};
