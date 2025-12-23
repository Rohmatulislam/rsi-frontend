import { Wifi, Tv, Bath, UtensilsCrossed, Car, Users } from "lucide-react";
import { StaticImageData } from "next/image";

// Assets
import minaImg from "~/assets/rawat-inap/mina.png";
import multazamImg from "~/assets/rawat-inap/multazam.png";
import zamzamImg from "~/assets/rawat-inap/zamzam.png";
import arafahImg from "~/assets/rawat-inap/arafah.png";
import jabalImg from "~/assets/rawat-inap/jabal-rahmah.png";

export const unitImages: Record<string, StaticImageData> = {
    "Unit Mina": minaImg,
    "Unit Multazam": multazamImg,
    "Unit Zam-zam": zamzamImg,
    "Unit Arafah": arafahImg,
    "Unit Jabal Rahmah": jabalImg,
    "Unit Safa": zamzamImg,
    "Unit Bayi Safa": zamzamImg,
    "Unit ICU": arafahImg,
    "Unit ICCU": arafahImg,
    "Unit NICU": arafahImg,
    "Unit HCU": arafahImg,
};

export const defaultInpatientImage = minaImg;

export const getUnitColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("mina")) return "bg-gradient-to-br from-blue-500 to-blue-600";
    if (n.includes("multazam")) return "bg-gradient-to-br from-teal-500 to-teal-600";
    if (n.includes("zam-zam") || n.includes("zam zam")) return "bg-gradient-to-br from-indigo-500 to-indigo-600";
    if (n.includes("arafah")) return "bg-gradient-to-br from-amber-500 to-amber-600";
    if (n.includes("jabal")) return "bg-gradient-to-br from-rose-500 to-rose-600";
    if (n.includes("safa")) return "bg-gradient-to-br from-emerald-500 to-emerald-600";
    if (n.includes("icu") || n.includes("iccu")) return "bg-gradient-to-br from-red-500 to-red-600 text-white";
    if (n.includes("nicu") || n.includes("hcu")) return "bg-gradient-to-br from-purple-500 to-purple-600 text-white";
    if (n.includes("marwah")) return "bg-gradient-to-br from-cyan-500 to-cyan-600";
    if (n.includes("muzdalifah")) return "bg-gradient-to-br from-lime-500 to-lime-600";
    return "bg-gradient-to-br from-primary to-primary/80";
};

export const generalFacilities = [
    { icon: Wifi, title: "WiFi High Speed", description: "Akses internet lancar" },
    { icon: Tv, title: "Multimedia", description: "Hiburan TV kabel" },
    { icon: Bath, title: "Hygiene", description: "Kamar mandi bersih & higienis" },
    { icon: UtensilsCrossed, title: "Gizi", description: "Makanan sehat & konsultasi ahli gizi" },
    { icon: Car, title: "Parkir", description: "Area parkir luas & aman" },
    { icon: Users, title: "Keamanan", description: "Security & CCTV 24 Jam" },
];
