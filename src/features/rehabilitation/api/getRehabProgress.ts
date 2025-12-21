import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export type RehabProgressDto = {
    no_rawat: string;
    no_rm: string;
    nama_pasien: string;
    dokter: string;
    tanggal_terakhir: string;
    diagnosa: string;
    tatalaksana: string;
    evaluasi: string;
    status_program: string;
    programs: Array<{
        tanggal: string;
        program: string;
        keterangan: string;
    }>;
};

export const getRehabProgress = async (identifier: string) => {
    if (!identifier) return null;
    const response = await axiosInstance.get<RehabProgressDto>(
        `/rehabilitation/progress/${identifier}`
    );
    return response.data;
};

export const getRehabProgressQueryOptions = (identifier: string) => {
    return queryOptions({
        queryKey: ["rehab-progress", identifier],
        queryFn: () => getRehabProgress(identifier),
        enabled: !!identifier,
        retry: false,
    });
};

type UseGetRehabProgressParams = {
    identifier: string;
    queryConfig?: QueryConfig<typeof getRehabProgress>;
};

export const useGetRehabProgress = ({
    identifier,
    queryConfig
}: UseGetRehabProgressParams) => {
    return useQuery({
        ...getRehabProgressQueryOptions(identifier),
        ...queryConfig,
    });
};
