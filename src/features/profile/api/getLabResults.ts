import { axiosInstance } from "~/lib/axios";

export interface LabHistory {
    no_rawat: string;
    tgl_periksa: string;
    jam: string;
    kd_jenis_prw: string;
    nm_perawatan: string;
    nm_dokter: string;
    status: string;
}

export interface LabResultDetail {
    id_template: string;
    name: string;
    nilai: string;
    satuan: string;
    nilai_rujukan: string;
    keterangan: string;
    isAbnormal: boolean;
}

export const getLabHistory = async (noRM: string): Promise<LabHistory[]> => {
    console.log("Fetching Lab History for RM:", noRM);
    const res = await axiosInstance.get(`lab/history/${noRM}`);
    return res.data;
};

export const getLabResultDetails = async (noRawat: string, kdJenisPrw: string): Promise<LabResultDetail[]> => {
    const res = await axiosInstance.get(`lab/results/${noRawat}/${kdJenisPrw}`);
    return res.data;
};

export const getLabResultPdfUrl = (noRawat: string, kdJenisPrw: string, noRM: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/lab/download-pdf/${noRawat}/${kdJenisPrw}?noRM=${noRM}`;
};
