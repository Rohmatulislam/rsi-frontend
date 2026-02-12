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
export interface BudgetData {
    id: string;
    category: string;
    amount: number;
    period: string;
    month?: number;
    year: number;
    notes?: string;
    isActive: boolean;
}

export interface BudgetVariance {
    id: string;
    category: string;
    budget: number;
    actual: number;
    variance: number;
    percentage: number;
    notes?: string;
}

export const useBudgets = (period: string, year: number, month?: number) => {
    return useQuery<BudgetData[]>({
        queryKey: ["finance", "budgets", period, year, month],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/budget", {
                params: { period, year, month }
            });
            return response.data;
        },
    });
};

export const useBudgetVariance = (period: string, year: number, month?: number) => {
    return useQuery<BudgetVariance[]>({
        queryKey: ["finance", "budget-variance", period, year, month],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/budget/variance", {
                params: { period, year, month }
            });
            return response.data;
        },
        refetchInterval: 60000,
    });
};

export const useUpsertBudget = () => {
    return {
        mutateAsync: async (data: Partial<BudgetData>) => {
            const response = await axiosInstance.post("/finance-stats/budget", data);
            return response.data;
        }
    };
};

export const useDeleteBudget = () => {
    return {
        mutateAsync: async (id: string) => {
            const response = await axiosInstance.delete(`/finance-stats/budget/${id}`);
            return response.data;
        }
    };
};

export const useAccountsPayable = (period?: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<any>({
        queryKey: ["finance", "accounts-payable", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/accounts-payable", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 300000, // 5 minutes
    });
};

export const useAccountsReceivable = (period?: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<any>({
        queryKey: ["finance", "accounts-receivable", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/accounts-receivable", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 300000, // 5 minutes
    });
};

export const useBPJSPerformance = (period?: string, date?: string, startDate?: string, endDate?: string) => {
    return useQuery<any>({
        queryKey: ["finance", "bpjs-performance", period, date, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get("/finance-stats/bpjs-performance", {
                params: { period, date, startDate, endDate }
            });
            return response.data;
        },
        refetchInterval: 300000, // 5 minutes
    });
};
