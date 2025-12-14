import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export type PaymentMethodDto = {
    kd_pj: string;
    png_jawab: string;
};

type GetPaymentMethodsResponse = PaymentMethodDto[];

export const getPaymentMethods = async () => {
    const response = await axiosInstance.get<GetPaymentMethodsResponse>("/doctors/payment-methods");
    return response.data;
};

export const getPaymentMethodsQueryKey = () => ["payment-methods"];

export const getPaymentMethodsQueryOptions = () => {
    return queryOptions({
        queryKey: getPaymentMethodsQueryKey(),
        queryFn: () => getPaymentMethods(),
    });
};

type UseGetPaymentMethodsParams = {
    queryConfig?: QueryConfig<typeof getPaymentMethods>;
};

export const useGetPaymentMethods = ({ queryConfig }: UseGetPaymentMethodsParams = {}) => {
    return useQuery({
        ...getPaymentMethodsQueryOptions(),
        ...queryConfig,
    });
};
