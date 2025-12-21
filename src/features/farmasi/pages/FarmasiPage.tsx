"use client";

import { ServiceHero, ServiceCTA } from "~/features/services";
import {
    Pill, ShieldCheck, MessageCircle, Truck,
    Upload
} from "lucide-react";
import { useState } from "react";
import { useGetPrescriptionStatus } from "../api/getPrescriptionStatus";
import { useGetMyPrescriptions } from "../api/getMyPrescriptions";
import { PrescriptionSubmissionModal } from "../components/PrescriptionSubmissionModal";
import { ServiceDetailModal } from "../components/ServiceDetailModal";
import { ServiceDetail } from "../services/farmasiService";
import { authClient } from "~/lib/auth-client";

// Modularized Components
import { PharmacyWorkflow } from "../components/PharmacyWorkflow";
import { PharmacyCatalog } from "../components/PharmacyCatalog";
import { PharmacyTracking } from "../components/PharmacyTracking";
import { PharmacyHistory } from "../components/PharmacyHistory";
import { PharmacyInfo } from "../components/PharmacyInfo";

const farmasiServices: ServiceDetail[] = [
    {
        icon: Pill,
        title: "Penebusan Resep",
        description: "Layanan penyiapan obat berdasarkan resep dokter (Rawat Jalan & Rawat Inap).",
        longDescription: "Layanan Farmasi RSI menyediakan penebusan resep dokter secara digital maupun fisik. Kami menjamin ketersediaan obat dan proses penyiapan yang sesuai standar farmasi klinis.",
        color: "primary",
        features: ["Integrasi E-Resep Dokter", "Verifikasi Apoteker 24 Jam", "Double Check Keamanan", "Riwayat Penebusan Digital"],
        ctaText: "Kirim Resep Secara Online",
        whatsappText: "Halo, saya ingin bertanya tentang prosedur peneburan resep dokter."
    },
    {
        icon: ShieldCheck,
        title: "Obat Bebas (OTC)",
        description: "Sedia berbagai obat bebas, vitamin, dan alat kesehatan bersertifikat.",
        longDescription: "Dapatkan akses mudah ke berbagai produk kesehatan berkualitas, mulai dari vitamin, suplemen makanan, hingga alat kesehatan yang telah melalui pengecekan mutu ketat.",
        color: "success",
        features: ["Stok Vitamin Lengkap", "Alat Kesehatan Standar RS", "Suplemen Berlisensi BPOM", "Konsultasi Pemilihan Obat"],
        whatsappText: "Halo, saya ingin menanyakan ketersediaan stok vitamin/obat bebas."
    },
    {
        icon: MessageCircle,
        title: "Konseling Farmasi",
        description: "Edukasi gratis tentang cara pakai, efek samping, dan penyimpanan obat.",
        longDescription: "Kesalahan penggunaan obat dapat membahayakan kesehatan. Apoteker kami siap memberikan edukasi mendalam mengenai cara penggunaan obat yang benar dan aman.",
        color: "accent",
        features: ["Konsultasi Gratis 24 Jam", "Edukasi Efek Samping", "Panduan Dosis Spesifik", "Kesesuaian Interaksi Obat"],
        whatsappText: "Halo, saya ingin berkonsultasi mengenai penggunaan obat saya."
    },
    {
        icon: Truck,
        title: "Antar Obat (RSI-DELIVER)",
        description: "Obat dikirim langsung ke rumah Anda setelah selesai diproses.",
        longDescription: "Layanan pengantaran obat RSI-DELIVER memastikan obat sampai ke tangan Anda dengan aman tanpa harus mengantre di rumah sakit. Khusus untuk obat non-racikan dan area tertentu.",
        color: "purple",
        features: ["Pengantaran di Hari yang Sama", "Monitoring Pengiriman Real-time", "Biaya Kirim Terjangkau", "Kemasan Aman & Higienis"],
        whatsappText: "Halo, saya ingin menanyakan layanan RSI-DELIVER untuk pengiriman obat."
    },
];

const steps = [
    {
        title: "E-Resep / Upload",
        desc: "Dokter mengirim E-Resep atau Anda upload foto resep di sini.",
        icon: Upload
    },
    {
        title: "Verifikasi & Bayar",
        desc: "Apoteker memverifikasi stok & harga. Pembayaran via Online/Kasir.",
        icon: ShieldCheck
    },
    {
        title: "Penyiapan Obat",
        desc: "Obat disiapkan dengan double-check untuk keamanan pasien.",
        icon: Pill
    },
    {
        title: "Ambil / Kirim",
        desc: "Ambil di Farmasi 24 Jam atau dikirim via kurir ke rumah.",
        icon: Truck
    }
];

export const FarmasiPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
    const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

    const { data: session } = authClient.useSession();

    const { data: status, isLoading, isError } = useGetPrescriptionStatus({
        identifier
    });

    const { data: myPrescriptions, isLoading: isMyPrescriptionsLoading } = useGetMyPrescriptions({
        userId: session?.user?.id
    });

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setIdentifier(searchQuery);
    };

    const handleTrackFromHistory = (id: string) => {
        setSearchQuery(id);
        setIdentifier(id);
    };

    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="Layanan Farmasi Modern"
                title="Antrean Farmasi"
                highlightText="Aman, Cepat, Terintegrasi"
                subtitle="Komitmen kami adalah menyediakan obat-obatan asli dengan sistem layanan berbasis digital untuk kenyamanan Anda."
            />

            {/* Steps Section */}
            <PharmacyWorkflow
                steps={steps}
                onOpenModal={() => setIsPrescriptionModalOpen(true)}
            />

            {/* Main Content Area */}
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Side: Services & Tracking UI */}
                <div className="lg:col-span-8 space-y-12">
                    <PharmacyCatalog
                        services={farmasiServices}
                        onSelectService={(s) => {
                            setSelectedService({
                                ...s,
                                ctaAction: s.title === "Penebusan Resep" ? () => setIsPrescriptionModalOpen(true) : undefined
                            });
                            setIsServiceDetailOpen(true);
                        }}
                    />

                    <PharmacyTracking
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        status={status ?? null}
                        isError={isError}
                    />

                    {session?.user && (
                        <PharmacyHistory
                            isLoading={isMyPrescriptionsLoading}
                            prescriptions={myPrescriptions ?? null}
                            onTrack={handleTrackFromHistory}
                        />
                    )}
                </div>

                {/* Right Side: Information Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <PharmacyInfo />
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-24">
                <ServiceCTA
                    title="Obat Aman, Pasien Nyaman"
                    subtitle="Hindari antrean fisik dengan sistem E-Resep. Klik untuk memulai proses peneburan resep secara online."
                    primaryAction={{
                        label: "Kirim Foto Resep Sekarang",
                        onClick: () => setIsPrescriptionModalOpen(true),
                    }}
                />
            </div>

            <PrescriptionSubmissionModal
                isOpen={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
            />

            <ServiceDetailModal
                service={selectedService}
                isOpen={isServiceDetailOpen}
                onClose={() => setIsServiceDetailOpen(false)}
            />
        </div>
    );
};
