import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface DiagnosticOrder {
    id: string;
    orderNumber: string;
    patientId: string;
    patientName: string;
    patientNIK: string;
    patientPhone: string;
    patientEmail?: string;
    scheduledDate: string;
    timeSlot: string;
    totalAmount: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    paymentStatus: "UNPAID" | "PAID" | "EXPIRED" | "FAILED" | "REFUNDED";
    paymentMethod?: string;
    createdAt: string;
    items: {
        id: string;
        name: string;
        price: number;
        type: string;
    }[];
}

export const useGetDiagnosticOrders = () => {
    return useQuery({
        queryKey: ["admin", "diagnostic-orders"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<DiagnosticOrder[]>("/diagnostic/orders");
            return data;
        },
    });
};
