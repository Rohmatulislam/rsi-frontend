import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RehabTherapy } from "../services/rehabilitationService";

export const useGetRehabTherapies = () => {
    return useQuery<RehabTherapy[]>({
        queryKey: ["rehab-therapies"],
        queryFn: async () => {
            const { data } = await axios.get("/api/rehabilitation/therapies");
            return data;
        },
    });
};
