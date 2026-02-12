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
    transactions: number;
    percentage: number;
}

export interface FinanceSummary {
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    netIncome: number;
    transactionCount: number;
    revenueGrowth: number;
    previousRevenue: number;
}

export interface ExpenseSummary {
    totalExpenses: number;
    entryCount: number;
    topCategories: { kd_rek: string; nm_rek: string; amount: number }[];
}

export interface FinanceTrend {
    month: string;
    bpjs: number;
    umum: number;
    asuransi: number;
    totalTransactions: number;
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
        refetchInterval: 60000,
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
        refetchInterval: 60000,
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
        refetchInterval: 60000,
    });
};

export const useFinanceTrends = () => {
    return useQuery<FinanceTrend[]>({
        queryKey: ["finance", "trends"],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/trends");
            return response.data;
        },
        refetchInterval: 60000,
    });
};

export const useExpenseSummary = (period: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<ExpenseSummary>({
        queryKey: ["finance", "expenses", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/expenses", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 60000,
    });
};

export interface PeriodDataPoint {
    revenue: number;
    expenses: number;
    drugProfit: number;
    transactions: number;
    netIncome: number;
    startDate: string;
    endDate: string;
}

export interface PeriodComparisonData {
    current: PeriodDataPoint;
    previous: PeriodDataPoint;
    changes: {
        revenue: number;
        expenses: number;
        drugProfit: number;
        transactions: number;
        netIncome: number;
    };
}

export const usePeriodComparison = (period: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<PeriodComparisonData | null>({
        queryKey: ["finance", "period-comparison", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/period-comparison", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 60000,
    });
};

