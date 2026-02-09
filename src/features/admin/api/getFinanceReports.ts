import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface DrugProfitData {
    unit: string;
    totalSales: number;
    cost: number;
    profit: number;
}

export interface PaymentMethodData {
    name: string;
    value: number;
    profit: number;
    percentage: number;
}

export interface FinanceSummary {
    totalRevenue: number;
    totalProfit: number;
    transactionCount: number;
}

export const useDrugProfitReport = (period: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<DrugProfitData[]>({
        queryKey: ["finance", "drug-profit", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/drug-profit", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 10000, // Polling every 10 seconds
    });
};

export const usePaymentMethodReport = (period: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<PaymentMethodData[]>({
        queryKey: ["finance", "payment-method", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/payment-method", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 10000, // Polling every 10 seconds
    });
};

export const useFinanceSummary = (period: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<FinanceSummary>({
        queryKey: ["finance", "summary", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/summary", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 10000, // Polling every 10 seconds
    });
};

export interface FinanceTrend {
    month: string;
    bpjs: number;
    umum: number;
    asuransi: number;
}

export const useFinanceTrends = () => {
    return useQuery<FinanceTrend[]>({
        queryKey: ["finance", "trends"],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/trends");
            return response.data;
        },
        refetchInterval: 10000,
    });
};
