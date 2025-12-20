import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance as axios } from "~/lib/axios";
import { InpatientRoom } from "../types";

export const getRooms = async (): Promise<InpatientRoom[]> => {
    const response = await axios.get("/inpatient/rooms");
    return response.data;
};

export const roomsQueryOptions = queryOptions({
    queryKey: ["inpatient-rooms"],
    queryFn: getRooms,
    refetchInterval: 60000,
});

export const useGetRooms = () => {
    return useQuery(roomsQueryOptions);
};
