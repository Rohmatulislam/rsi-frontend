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
    const res = await axiosInstance.get(`radiology/history/${noRM}`);
    return res.data;
};

export const getRadiologyResultDetails = async (noRawat: string, tgl: string, jam: string): Promise<string | null> => {
    const res = await axiosInstance.get(`radiology/results/${noRawat}/${tgl}/${jam}`);
    return res.data;
};

export const getRadiologyResultPdfUrl = (noRawat: string, tgl: string, jam: string, noRM: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    return `${baseUrl}/radiology/download-pdf/${noRawat}/${tgl}/${jam}?noRM=${noRM}`;
};
