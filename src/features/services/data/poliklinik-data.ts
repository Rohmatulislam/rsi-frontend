import { Stethoscope, Heart, Baby, Activity, Brain, Bone, Eye, Ear, User, Scissors } from "lucide-react";

export interface PoliklinikItem {
    slug: string;
    name: string;
    description: string;
    icon: any;
    category: "executive" | "regular";
    specialtyId?: string; // To match with doctor specialty
}

export const poliklinikData: PoliklinikItem[] = [
    // Executive
    {
        slug: "penyakit-dalam-executive",
        name: "Poli Penyakit Dalam Executive",
        description: "Layanan spesialis penyakit dalam dengan fasilitas executive dan prioritas layanan.",
        icon: Activity,
        category: "executive",
        specialtyId: "penyakit-dalam",
    },
    {
        slug: "jantung-executive",
        name: "Poli Jantung Executive",
        description: "Pemeriksaan jantung komprehensif oleh dokter spesialis senior di klinik executive.",
        icon: Heart,
        category: "executive",
        specialtyId: "jantung",
    },
    {
        slug: "kandungan-executive",
        name: "Poli Kandungan Executive",
        description: "Layanan kesehatan ibu dan janin dengan privasi dan kenyamanan ekstra.",
        icon: Baby,
        category: "executive",
        specialtyId: "kandungan",
    },
    {
        slug: "anak-executive",
        name: "Poli Anak Executive",
        description: "Klinik tumbuh kembang dan kesehatan anak dengan suasana yang nyaman.",
        icon: User,
        category: "executive",
        specialtyId: "anak",
    },
    {
        slug: "bedah-executive",
        name: "Poli Bedah Executive",
        description: "Konsultasi bedah dengan dokter senior dan fasilitas premium.",
        icon: Scissors,
        category: "executive",
        specialtyId: "bedah",
    },
    {
        slug: "saraf-executive",
        name: "Poli Saraf Executive",
        description: "Penanganan gangguan saraf oleh ahli neurologi berpengalaman.",
        icon: Brain,
        category: "executive",
        specialtyId: "saraf",
    },

    // Regular (Examples)
    {
        slug: "penyakit-dalam",
        name: "Poli Penyakit Dalam",
        description: "Diagnosis dan penanganan berbagai penyakit dalam.",
        icon: Activity,
        category: "regular",
        specialtyId: "penyakit-dalam",
    },
    {
        slug: "jantung",
        name: "Poli Jantung",
        description: "Layanan kesehatan jantung dan pembuluh darah.",
        icon: Heart,
        category: "regular",
        specialtyId: "jantung",
    },
    {
        slug: "kandungan",
        name: "Poli Kandungan",
        description: "Pemeriksaan kehamilan dan kesehatan reproduksi.",
        icon: Baby,
        category: "regular",
        specialtyId: "kandungan",
    },
    {
        slug: "anak",
        name: "Poli Anak",
        description: "Layanan kesehatan bayi dan anak.",
        icon: User,
        category: "regular",
        specialtyId: "anak",
    },
    {
        slug: "bedah",
        name: "Poli Bedah",
        description: "Layanan konsultasi dan tindakan bedah umum.",
        icon: Scissors,
        category: "regular",
        specialtyId: "bedah",
    },
    {
        slug: "saraf",
        name: "Poli Saraf",
        description: "Layanan kesehatan sistem saraf.",
        icon: Brain,
        category: "regular",
        specialtyId: "saraf",
    },
    {
        slug: "mata",
        name: "Poli Mata",
        description: "Pemeriksaan dan pengobatan kesehatan mata.",
        icon: Eye,
        category: "regular",
        specialtyId: "mata",
    },
    {
        slug: "tht",
        name: "Poli THT",
        description: "Layanan Telinga, Hidung, dan Tenggorokan.",
        icon: Ear,
        category: "regular",
        specialtyId: "tht",
    },
    {
        slug: "orthopedi",
        name: "Poli Orthopedi",
        description: "Layanan kesehatan tulang dan persendian.",
        icon: Bone,
        category: "regular",
        specialtyId: "orthopedi",
    },
];

export const getPoliklinikBySlug = (slug: string) => {
    return poliklinikData.find((item) => item.slug === slug);
};

export const getExecutivePoliklinik = () => {
    return poliklinikData.filter(item => item.category === "executive");
}
