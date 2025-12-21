"use client";

import { useState } from "react";
import { ServiceHero, ServiceSection, ServiceGrid, ServiceCTA } from "~/features/services";
import { Wifi, Tv, Bath, UtensilsCrossed, Car, Users, ArrowRight, ArrowLeft, BedDouble, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Image, { StaticImageData } from "next/image";
import minaImg from "~/assets/rawat-inap/mina.png";
import multazamImg from "~/assets/rawat-inap/multazam.png";
import zamzamImg from "~/assets/rawat-inap/zamzam.png";
import arafahImg from "~/assets/rawat-inap/arafah.png";
import jabalImg from "~/assets/rawat-inap/jabal-rahmah.png";

// Data Structure
interface RoomClass {
    name: string;
    description: string;
    price: string;
    facilities: string[];
    capacity: string;
}

interface Building {
    id: string;
    name: string;
    description: string;
    image: string | StaticImageData; // We'll use color gradients for now as placeholder
    color: string;
    classes: RoomClass[];
}

const buildings: Building[] = [
    {
        id: "mina",
        name: "Gedung Mina",
        description: "Gedung perawatan dengan kenyamanan standar dan suasana kekeluargaan.",
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        image: minaImg,
        classes: [
            {
                name: "Kelas 3",
                description: "Ruang perawatan ekonomis dengan fasilitas dasar yang memadai.",
                price: "Rp 250.000 / malam",
                capacity: "6 Bed / Kamar",
                facilities: ["AC Central", "Kamar Mandi Dalam", "TV Bersama", "Nakas", "Kursi Penunggu"]
            }
        ]
    },
    {
        id: "multazam",
        name: "Gedung Multazam",
        description: "Gedung perawatan kelas menengah dengan fasilitas yang lebih privat.",
        color: "bg-gradient-to-br from-teal-500 to-teal-600",
        image: multazamImg,
        classes: [
            {
                name: "Kelas 2",
                description: "Kenyamanan lebih dengan kapasitas kamar yang lebih sedikit.",
                price: "Rp 450.000 / malam",
                capacity: "4 Bed / Kamar",
                facilities: ["AC Split", "Kamar Mandi Dalam", "TV LED 32\"", "Tirai Penyekat", "Nakas", "Kursi Penunggu Standar"]
            }
        ]
    },
    {
        id: "zamzam",
        name: "Gedung Zam-zam",
        description: "Gedung perawatan kelas utama dengan privasi tinggi.",
        color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        image: zamzamImg,
        classes: [
            {
                name: "Kelas 1",
                description: "Ruang perawatan privat untuk kenyamanan maksimal pasien dan keluarga.",
                price: "Rp 650.000 / malam",
                capacity: "2 Bed / Kamar",
                facilities: ["AC Split", "Kamar Mandi Dalam (Water Heater)", "TV LED 32\"", "Kulkas", "Sofa Tamu", "Nakas", "Overbed Table"]
            }
        ]
    },
    {
        id: "arafah",
        name: "Gedung Arafah",
        description: "Layanan VIP dengan fasilitas premium dan pelayanan eksklusif.",
        color: "bg-gradient-to-br from-amber-500 to-amber-600",
        image: arafahImg,
        classes: [
            {
                name: "VIP A",
                description: "Kamar VIP luas dengan ruang tunggu terpisah.",
                price: "Rp 1.100.000 / malam",
                capacity: "1 Bed (Electric)",
                facilities: ["AC", "Smart TV 43\"", "Kulkas 2 Pintu", "Dispenser", "Sofa Bed", "Lemari Pakaian", "Kamar Mandi Luas (Water Heater)", "Welcome Fruit"]
            },
            {
                name: "VIP B",
                description: "Kamar VIP standar dengan fasilitas lengkap.",
                price: "Rp 950.000 / malam",
                capacity: "1 Bed (Electric)",
                facilities: ["AC", "TV LED 40\"", "Kulkas 1 Pintu", "Sofa Bed", "Lemari Kecil", "Kamar Mandi Dalam (Water Heater)"]
            }
        ]
    },
    {
        id: "jabal-rahmah",
        name: "Gedung Jabal Rahmah",
        description: "Puncak kemewahan layanan rawat inap (VVIP) untuk kenyamanan paripurna.",
        color: "bg-gradient-to-br from-rose-500 to-rose-600",
        image: jabalImg,
        classes: [
            {
                name: "VVIP Suite",
                description: "Suite mewah dengan ruang tamu dan pantry pribadi.",
                price: "Rp 2.000.000 / malam",
                capacity: "1 Bed Premium (Electric)",
                facilities: ["AC", "Smart TV 50\"", "Private Pantry", "Microwave", "Kulkas Besar", "Ruang Tamu Sofa Kulit", "Meja Makan", "Extra Bed Penunggu", "Amenity Premium"]
            },
            {
                name: "VVIP",
                description: "Kamar VVIP luas dengan fasilitas eksklusif.",
                price: "Rp 1.500.000 / malam",
                capacity: "1 Bed Premium (Electric)",
                facilities: ["AC", "Smart TV 43\"", "Kulkas", "Sofa Bed Premium", "Meja Kerja", "Amenity Lengkap"]
            }
        ]
    }
];

const generalFacilities = [
    { icon: Wifi, title: "WiFi High Speed", description: "Akses internet lancar" },
    { icon: Tv, title: "Multimedia", description: "Hiburan TV kabel" },
    { icon: Bath, title: "Hygiene", description: "Kamar mandi bersih & higienis" },
    { icon: UtensilsCrossed, title: "Gizi", description: "Makanan sehat & konsultasi ahli gizi" },
    { icon: Car, title: "Parkir", description: "Area parkir luas & aman" },
    { icon: Users, title: "Keamanan", description: "Security & CCTV 24 Jam" },
];

import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { Loader2 } from "lucide-react";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";

// Mapping building names to images
const buildingImages: Record<string, StaticImageData> = {
    "Gedung Mina": minaImg,
    "Gedung Multazam": multazamImg,
    "Gedung Zam-zam": zamzamImg,
    "Gedung Arafah": arafahImg,
    "Gedung Jabal Rahmah": jabalImg,
};

const getBuildingColor = (name: string) => {
    if (name.includes("Mina")) return "bg-gradient-to-br from-blue-500 to-blue-600";
    if (name.includes("Multazam")) return "bg-gradient-to-br from-teal-500 to-teal-600";
    if (name.includes("Zam-zam")) return "bg-gradient-to-br from-indigo-500 to-indigo-600";
    if (name.includes("Arafah")) return "bg-gradient-to-br from-amber-500 to-amber-600";
    if (name.includes("Jabal")) return "bg-gradient-to-br from-rose-500 to-rose-600";
    return "bg-gradient-to-br from-primary to-primary/80";
};

export const RawatInapPage = () => {
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'rawat-inap' });
    const [step, setStep] = useState<"building" | "class" | "detail">("building");
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [selectedClass, setSelectedClass] = useState<RoomClass | null>(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Transform dynamic items into building grouped structure
    const dynamicBuildings: Building[] = [];
    const groupedItems: Record<string, RoomClass[]> = {};

    service?.items?.filter(item => item.isActive).forEach(item => {
        const cat = item.category || "Umum";
        if (!groupedItems[cat]) {
            groupedItems[cat] = [];
        }
        groupedItems[cat].push({
            name: item.name,
            description: item.description || "",
            price: item.price ? `Rp ${item.price.toLocaleString('id-ID')} / malam` : "Hubungi Kami",
            capacity: "Cek ketersediaan", // Fallback as capacity might not be in basic item DTO yet or needs mapping
            facilities: item.features ? item.features.split(',').map(f => f.trim()) : []
        });
    });

    Object.keys(groupedItems).forEach(buildingName => {
        dynamicBuildings.push({
            id: buildingName.toLowerCase().replace(/\s+/g, '-'),
            name: buildingName,
            description: `Fasilitas perawatan di ${buildingName}`,
            color: getBuildingColor(buildingName),
            image: buildingImages[buildingName] || minaImg,
            classes: groupedItems[buildingName]
        });
    });

    const displayBuildings = dynamicBuildings.length > 0 ? dynamicBuildings : buildings;

    const handleSelectBuilding = (building: Building) => {
        setSelectedBuilding(building);
        setStep("class");
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleSelectClass = (cls: RoomClass) => {
        setSelectedClass(cls);
        setStep("detail");
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleBack = () => {
        if (step === "detail") setStep("class");
        else if (step === "class") {
            setStep("building");
            setSelectedBuilding(null);
        }
    };

    return (
        <div className="min-h-screen">
            <BreadcrumbContainer
                items={[
                    { label: "Layanan", href: "/layanan" },
                    { label: "Rawat Inap" }
                ]}
                className="bg-muted/30 border-b"
            />
            <ServiceHero
                badge="LAYANAN RAWAT INAP"
                title={service?.title || service?.name || "Fasilitas Rawat Inap"}
                highlightText={service?.subtitle || "Kenyamanan Seperti di Rumah"}
                subtitle={service?.description || "Berbagai pilihan akomodasi rawat inap mulai dari kelas 3 hingga VVIP suite"}
            />

            <section className="py-8 container mx-auto px-4">
                {/* Breadcrumbs / Stepper Indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <span className={step === "building" ? "font-bold text-primary" : ""}>Pilih Gedung</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className={step === "class" ? "font-bold text-primary" : ""}>
                        {selectedBuilding ? `Pilih Kelas (${selectedBuilding.name})` : "Pilih Kelas"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                    <span className={step === "detail" ? "font-bold text-primary" : ""}>
                        {selectedClass ? "Detail Kamar" : "Detail Kamar"}
                    </span>
                </div>

                {/* STEP 1: SELECT BUILDING */}
                {step === "building" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-3">Pilih Gedung Perawatan</h2>
                            <p className="text-muted-foreground">Kami memiliki berbagai gedung perawatan dengan karakteristik berbeda</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayBuildings.map((building) => (
                                <div
                                    key={building.id}
                                    onClick={() => handleSelectBuilding(building)}
                                    className="group cursor-pointer bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="h-48 relative overflow-hidden bg-muted">
                                        <Image
                                            src={building.image}
                                            alt={building.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{building.name}</h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{building.description}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                                                {building.classes.length} Tipe Kelas
                                            </span>
                                            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary group-hover:translate-x-1 transition-all">
                                                Lihat Kelas <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: SELECT CLASS */}
                {step === "class" && selectedBuilding && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto">
                        <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Gedung
                        </Button>

                        <div className="bg-muted/30 rounded-3xl p-8 mb-8 border">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="h-32 w-32 rounded-2xl relative overflow-hidden flex-shrink-0 shadow-lg border-2 border-white">
                                    <Image
                                        src={selectedBuilding.image}
                                        alt={selectedBuilding.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">{selectedBuilding.name}</h2>
                                    <p className="text-muted-foreground text-lg">{selectedBuilding.description}</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-6">Pilih Tipe Kelas Kamar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {selectedBuilding.classes.map((cls) => (
                                <div
                                    key={cls.name}
                                    onClick={() => handleSelectClass(cls)}
                                    className="cursor-pointer bg-card border border-border/50 hover:border-primary/50 hover:bg-accent/5 rounded-xl p-6 transition-all hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-primary">{cls.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{cls.capacity}</p>
                                        </div>
                                        <Badge variant="outline" className="font-bold text-lg px-3 py-1">
                                            {cls.price}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {cls.facilities.slice(0, 3).map((fac, idx) => (
                                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                                {fac}
                                            </span>
                                        ))}
                                        {cls.facilities.length > 3 && (
                                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                                +{cls.facilities.length - 3} Lainnya
                                            </span>
                                        )}
                                    </div>
                                    <Button className="w-full gap-2 group">
                                        Lihat Detail Kamar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: CLASS DETAIL */}
                {step === "detail" && selectedClass && selectedBuilding && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
                        <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Pilih Kelas
                        </Button>

                        <div className="bg-card border rounded-3xl overflow-hidden shadow-lg">
                            <div className="h-64 relative">
                                <Image
                                    src={selectedBuilding.image}
                                    alt={selectedClass.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between text-white z-10">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">{selectedClass.name}</h1>
                                        <p className="text-xl font-medium opacity-90">{selectedBuilding.name}</p>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm opacity-80 mb-1">Harga per malam</p>
                                        <p className="text-3xl font-bold text-amber-400">{selectedClass.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                                        <Users className="h-6 w-6 text-blue-600 mb-2" />
                                        <p className="text-sm text-muted-foreground">Kapasitas</p>
                                        <p className="font-semibold text-lg">{selectedClass.capacity}</p>
                                    </div>
                                    <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <Info className="h-6 w-6 text-gray-600 mb-2" />
                                        <p className="text-sm text-muted-foreground">Deskripsi</p>
                                        <p className="font-medium">{selectedClass.description}</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" /> Fasilitas Lengkap
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                    {selectedClass.facilities.map((fac) => (
                                        <div key={fac} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span>{fac}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t">
                                    <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2" asChild>
                                        <a href={`https://wa.me/6281234567890?text=Halo admin, saya ingin reservasi kamar rawat inap ${selectedBuilding.name} - ${selectedClass.name}`}>
                                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            Hubungi Untuk Reservasi
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>
                                        Pilih Kelas Lain
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* General Facilities */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Fasilitas Umum</h2>
                        <p className="text-muted-foreground">Tersedia untuk semua kelas kamar</p>
                    </div>
                    <ServiceGrid columns={3}>
                        {generalFacilities.map((facility) => (
                            <div key={facility.title} className="flex items-center gap-4 bg-card border rounded-xl p-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <facility.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{facility.title}</h4>
                                    <p className="text-sm text-muted-foreground">{facility.description}</p>
                                </div>
                            </div>
                        ))}
                    </ServiceGrid>
                </div>
            </section>
        </div>
    );
};
