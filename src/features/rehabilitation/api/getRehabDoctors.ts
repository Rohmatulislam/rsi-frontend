import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RehabDoctor } from "../services/rehabilitationService";

export const useGetRehabDoctors = () => {
    return useQuery<RehabDoctor[]>({
        queryKey: ["rehab-doctors"],
        queryFn: async () => {
            const { data } = await axios.get("/api/rehabilitation/doctors");
            return data;
        },
    });
};
