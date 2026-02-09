import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '~/lib/axios';

export interface JournalEntry {
    no_jurnal: string;
    no_bukti: string;
    tgl_jurnal: string;
    jam_jurnal: string;
    keterangan: string;
    details: {
        kd_rek: string;
        nm_rek: string;
        debet: number;
        kredit: number;
    }[];
}

export interface Account {
    kd_rek: string;
    nm_rek: string;
    tipe: string;
    balance: string;
}

export interface LedgerEntry {
    tgl_jurnal: string;
    no_jurnal: string;
    no_bukti: string;
    keterangan: string;
    debet: number;
    kredit: number;
}

export interface LedgerResponse {
    initial_balance: number;
    entries: LedgerEntry[];
}

export interface FinancialReportItem {
    kd_rek: string;
    nm_rek: string;
    amount: number;
    category: string;
}

// Hooks
export const useJournal = (startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['accounting-journal', startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get<JournalEntry[]>(`/accounting/journal?startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        },
        enabled: !!startDate && !!endDate,
        refetchInterval: 10000,
    });
};

export const useAccounts = () => {
    return useQuery({
        queryKey: ['accounting-accounts'],
        queryFn: async () => {
            const response = await axiosInstance.get<Account[]>('/accounting/accounts');
            return response.data;
        },
    });
};

export const useLedger = (kd_rek: string, startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['accounting-ledger', kd_rek, startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get<LedgerResponse>(`/accounting/ledger?kd_rek=${kd_rek}&startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        },
        enabled: !!kd_rek && !!startDate && !!endDate,
        refetchInterval: 10000,
    });
};

export const useProfitLoss = (startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['accounting-profit-loss', startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get<FinancialReportItem[]>(`/accounting/profit-loss?startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        },
        enabled: !!startDate && !!endDate,
        refetchInterval: 10000,
    });
};

export const useBalanceSheet = (endDate: string) => {
    return useQuery({
        queryKey: ['accounting-balance-sheet', endDate],
        queryFn: async () => {
            const response = await axiosInstance.get<FinancialReportItem[]>(`/accounting/balance-sheet?endDate=${endDate}`);
            return response.data;
        },
        enabled: !!endDate,
        refetchInterval: 10000,
    });
};
