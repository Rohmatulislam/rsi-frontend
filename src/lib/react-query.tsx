import {
    type UseMutationOptions,
    type DefaultOptions,
    type UseQueryOptions
} from "@tanstack/react-query";

export const queryConfig = {
    queries: {
        // throwOnError: true,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 0,
    },
} satisfies DefaultOptions;

export type ApiFinReturnType<FnType extends (...args: any) => Promise<any>> =
    Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
    UseQueryOptions<ApiFinReturnType<T>, Error, ApiFinReturnType<T>, any>,
    "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>
> = UseMutationOptions<
    ApiFinReturnType<MutationFnType>,
    Error,
    Parameters<MutationFnType>[0]
>;
