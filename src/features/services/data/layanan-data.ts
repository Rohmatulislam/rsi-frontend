import {
    Stethoscope,
    FlaskConical,
    ScanLine,
    Activity,
    Pill,
    BedDouble,
    HeartPulse,
    LucideIcon,
} from "lucide-react";

export interface LayananItem {
    slug: string;
    title: string;
    shortTitle: string;
    description: string;
    icon: LucideIcon;
    color: "primary" | "accent" | "success" | "purple" | "rose" | "cyan";
    heroSubtitle: string;
    highlightText?: string;
}

export const layananData: LayananItem[] = [
    {
        slug: "rawat-jalan",
        title: "Rawat Jalan",
        shortTitle: "Rawat Jalan",
        description: "Layanan pemeriksaan dan konsultasi dengan dokter spesialis tanpa menginap",
        icon: Stethoscope,
        color: "primary",
        heroSubtitle: "Layanan pemeriksaan dan konsultasi dengan dokter spesialis dari berbagai bidang keahlian",
        highlightText: "Berbagai Poliklinik Spesialis",
    },
    {
        slug: "mcu",
        title: "Medical Check Up",
        shortTitle: "MCU",
        description: "Pemeriksaan kesehatan menyeluruh untuk deteksi dini penyakit",
        icon: Activity,
        color: "rose",
        heroSubtitle: "Investasi terbaik untuk kesehatan Anda dengan pemeriksaan menyeluruh dan akurat",
        highlightText: "Paket Lengkap & Terjangkau",
    },
    {
        slug: "laboratorium",
        title: "Laboratorium",
        shortTitle: "Laboratorium",
        description: "Pemeriksaan laboratorium lengkap dengan hasil akurat dan cepat",
        icon: FlaskConical,
        color: "cyan",
        heroSubtitle: "Pemeriksaan laboratorium lengkap dengan teknologi modern dan hasil yang akurat",
        highlightText: "Hasil Cepat & Akurat",
    },
    {
        slug: "radiologi",
        title: "Radiologi",
        shortTitle: "Radiologi",
        description: "Layanan pencitraan medis dengan teknologi terkini",
        icon: ScanLine,
        color: "success",
        heroSubtitle: "Layanan pencitraan medis lengkap untuk diagnosis yang tepat dan akurat",
        highlightText: "Teknologi Pencitraan Modern",
    },
    {
        slug: "farmasi",
        title: "Farmasi 24 Jam",
        shortTitle: "Farmasi",
        description: "Apotek lengkap dengan layanan 24 jam setiap hari",
        icon: Pill,
        color: "accent",
        heroSubtitle: "Layanan farmasi lengkap dengan obat berkualitas tersedia 24 jam setiap hari",
        highlightText: "Buka 24 Jam Non-Stop",
    },
    {
        slug: "rawat-inap",
        title: "Rawat Inap",
        shortTitle: "Rawat Inap",
        description: "Fasilitas rawat inap nyaman dengan berbagai pilihan kelas kamar",
        icon: BedDouble,
        color: "purple",
        heroSubtitle: "Fasilitas rawat inap yang nyaman dan lengkap untuk pemulihan optimal",
        highlightText: "Kamar Nyaman & Fasilitas Lengkap",
    },
    {
        slug: "rehabilitasi-medik",
        title: "Rehabilitasi Medik",
        shortTitle: "Rehab Medik",
        description: "Layanan fisioterapi dan rehabilitasi untuk pemulihan fungsi tubuh",
        icon: HeartPulse,
        color: "rose",
        heroSubtitle: "Layanan rehabilitasi profesional untuk pemulihan fungsi tubuh yang optimal",
        highlightText: "Terapi Profesional & Komprehensif",
    },
];

export const getLayananBySlug = (slug: string) => {
    return layananData.find((item) => item.slug === slug);
};
