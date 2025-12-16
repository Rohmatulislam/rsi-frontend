"use client";

import { History, User } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { useGetFounders, Founder } from "../api/getFounders";
import { useGetHistory } from "../api/getAboutContent";
import { getImageSrc } from "~/lib/utils";

// Default founders untuk fallback
const defaultFounders: Founder[] = [
    {
        id: "1",
        name: "dr. Daldiri",
        role: "Pencetus Ide & Inisiator",
        description: "Dokter dari RS Sutomo yang pertama kali mencetuskan gagasan pendirian Rumah Sakit Islam di Mataram.",
        image: "/images/founders/dr_daldiri.png",
        order: 0
    },
    {
        id: "2",
        name: "H.R. Wasita Kusumah",
        role: "Gubernur NTB (1973-1978)",
        description: "Memberikan dukungan penuh dan mandat resmi pemerintah daerah untuk merealisasikan pembangunan.",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Gubernur_NTB_H.R._Wasita_Kusumah.jpg",
        order: 1
    },
    {
        id: "3",
        name: "H. Lalu Nuruddin, S.H.",
        role: "Penerima Mandat",
        description: "Menerima mandat langsung dan memimpin panitia pendirian serta menggalang dukungan masyarakat.",
        image: "/images/founders/h_lalu_nuruddin.png",
        order: 2
    }
];

const defaultHistory = `RSI Siti Hajar Mataram didirikan dengan semangat untuk menghadirkan layanan kesehatan yang tidak hanya berkualitas secara medis, tetapi juga mengedepankan nilai-nilai kemanusiaan dan spiritualitas Islam.

Berawal dari sebuah klinik sederhana yang diinisiasi oleh para tokoh muslim yang peduli akan kesehatan umat, kini kami telah tumbuh menjadi fasilitas kesehatan yang lengkap dan modern.`;

const FounderCard = ({ founder }: { founder: Founder }) => (
    <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-cyan-400/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 -z-10"></div>
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
            <div className="relative h-72 overflow-hidden">
                {founder.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={getImageSrc(founder.image)}
                        alt={founder.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <User className="w-24 h-24 opacity-40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-primary text-primary-foreground border-none shadow-lg px-2.5 py-1 text-[10px] font-bold tracking-wider">
                        {founder.badge || "PENDIRI"}
                    </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="text-lg font-bold mb-1">{founder.name}</h4>
                    <p className="text-sm text-white/80">{founder.role}</p>
                </div>
            </div>
        </div>
    </div>
);

// Helper to chunk founders into a pyramid structure (1, 2, 3, 4...)
const getStructureLayers = (items: Founder[]) => {
    const layers: Founder[][] = [];
    let currentIndex = 0;
    let layerSize = 1;

    while (currentIndex < items.length) {
        const chunk = items.slice(currentIndex, currentIndex + layerSize);
        layers.push(chunk);
        currentIndex += layerSize;
        layerSize++;
    }
    return layers;
};

export const AboutHistory = () => {
    const { data: historyData } = useGetHistory();
    const { data: foundersData } = useGetFounders({});

    const history = historyData?.value || defaultHistory;
    const founders = foundersData?.length ? foundersData : defaultFounders;

    // Split history into paragraphs
    const historyParagraphs = history.split('\n').filter((p: string) => p.trim());

    // Generate pyramid layers
    const founderLayers = getStructureLayers(founders);

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                <History className="w-96 h-96 text-primary" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col gap-20">
                    {/* Text - Centered */}
                    <div className="w-full max-w-4xl mx-auto space-y-8 text-center">
                        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm justify-center bg-primary/5 py-1 px-4 rounded-full">
                            <History className="h-4 w-4" /> Perjalanan Kami
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Sejarah Pendirian</h2>
                        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg max-w-3xl mx-auto">
                            {historyParagraphs.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Founders Organization Tree */}
                    <div className="w-full">
                        <div className="text-center mb-16 relative">
                            <h3 className="text-3xl md:text-4xl font-bold inline-flex flex-col items-center gap-4">
                                Tokoh-Tokoh Penting
                                <span className="h-1.5 w-24 bg-primary rounded-full"></span>
                            </h3>
                            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                                Para visioner yang meletakkan batu pertama dan mendedikasikan hidupnya untuk terwujudnya RSI Siti Hajar Mataram.
                            </p>
                        </div>

                        <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
                            {founderLayers.map((layer, layerIndex) => (
                                <div key={layerIndex} className={`relative flex flex-wrap justify-center gap-8 md:gap-12 w-full ${layerIndex > 0 ? 'mt-16' : ''}`}>

                                    {/* Connector from Previous Layer to Current Layer "Bus" */}
                                    {layerIndex > 0 && (
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200 dark:bg-slate-700" />
                                    )}

                                    {layer.map((founder, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === layer.length - 1;
                                        const isOnly = layer.length === 1;

                                        return (
                                            <div key={founder.id} className="relative flex-1 min-w-[280px] max-w-xs">
                                                {/* Tree Connectors for Items (not root layer) */}
                                                {layerIndex > 0 && (
                                                    <div className="absolute -top-8 left-0 right-0 h-8 pointer-events-none">
                                                        {/* Vertical line down to card */}
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 dark:bg-slate-700" />

                                                        {/* Horizontal Bus Lines */}
                                                        {!isOnly && (
                                                            <>
                                                                {!isFirst && (
                                                                    <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-slate-200 dark:bg-slate-700" />
                                                                )}
                                                                {!isLast && (
                                                                    <div className="absolute top-0 left-1/2 right-0 h-0.5 bg-slate-200 dark:bg-slate-700" />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                <FounderCard founder={founder} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
