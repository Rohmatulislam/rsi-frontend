import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { LabTemplateWithParent } from "../services/labService";

export const getLabTemplate = async (id: number): Promise<LabTemplateWithParent> => {
    const response = await axiosInstance.get(`/lab/template/${id}`);
    return response.data;
};

export const getLabTemplateQueryOptions = (id: number) => {
    return queryOptions({
        queryKey: ["lab", "template", id],
        queryFn: () => getLabTemplate(id),
    });
};

type UseLabTemplateOptions = {
    id: number | null;
    queryConfig?: QueryConfig<typeof getLabTemplate>;
};

export const useLabTemplate = ({ id, queryConfig }: UseLabTemplateOptions) => {
    return useQuery({
        ...getLabTemplateQueryOptions(id!),
        ...queryConfig,
        enabled: !!id,
    });
};
