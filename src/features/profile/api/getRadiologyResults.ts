import { axiosInstance } from "~/lib/axios";

export interface RadiologyHistory {
    no_rawat: string;
    tgl_periksa: string;
    jam: string;
    kd_jenis_prw: string;
    nm_perawatan: string;
    nm_dokter: string;
    status: string;
}

export const getRadiologyHistory = async (noRM: string): Promise<RadiologyHistory[]> => {
    console.log('Fetching radiology history for RM:', noRM);
    try {
        const res = await axiosInstance.get(`radiology/history/${noRM}`);
        console.log('Radiology history response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching radiology history:', error);
        throw error;
    }
};

export const getRadiologyResultDetails = async (noRawat: string, tgl: string, jam: string): Promise<string | null> => {
    const res = await axiosInstance.get(`radiology/results/${noRawat}/${tgl}/${jam}`);
    return res.data;
};

export const getRadiologyResultPdfUrl = (noRawat: string, tgl: string, jam: string, noRM: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2005/api';
    return `${baseUrl}/radiology/download-pdf/${noRawat}/${tgl}/${jam}?noRM=${noRM}`;
};
