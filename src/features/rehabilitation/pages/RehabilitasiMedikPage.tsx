"use client";

import { ServiceHero, ServiceCTA } from "~/features/services";
import {
    Brain, Baby, Bone, Dumbbell, MessageSquare,
    Activity, Stethoscope, ClipboardList, UserCheck,
    Home, BarChart3
} from "lucide-react";
import { useState } from "react";
import { useGetRehabProgress } from "~/features/rehabilitation/api/getRehabProgress";
import { useGetRehabTherapies } from "~/features/rehabilitation/api/getRehabTherapies";
import {
    JourneyStep,
    Specialty,
    TherapyService
} from "../services/rehabilitationService";

// Modular Components
import { RehabJourney } from "../components/RehabJourney";
import { RehabTherapyCatalog } from "../components/RehabTherapyCatalog";
import { RehabProgressTracker } from "../components/RehabProgressTracker";
import { RehabSpecialPrograms } from "../components/RehabSpecialPrograms";

const therapyServicesStatic: TherapyService[] = [
    {
        icon: Dumbbell,
        title: "Fisioterapi",
        description: "Pemulihan gerak dan kekuatan otot menggunakan manual therapy & modalitas alat.",
    },
    {
        icon: MessageSquare,
        title: "Terapi Wicara",
        description: "Penanganan gangguan bicara, bahasa, suara, dan gangguan menelan.",
    },
    {
        icon: Brain,
        title: "Terapi Okupasi",
        description: "Pelatihan aktivitas mandiri pasca cedera untuk kembali ke produktivitas normal.",
    },
    {
        icon: Baby,
        title: "Pediatrik Rehab",
        description: "Layanan stimulasi tumbuh kembang anak khusus (ABK) dan speech delay.",
    },
];

const journeySteps: JourneyStep[] = [
    {
        icon: Stethoscope,
        title: "Konsultasi Dokter Sp.KFR",
        desc: "Asesmen medis awal untuk menentukan diagnosis fungsional."
    },
    {
        icon: ClipboardList,
        title: "Program Terapi khusus",
        desc: "Penyusunan rencana terapi (Exercise, Modalitas, atau Alat bantu)."
    },
    {
        icon: UserCheck,
        title: "Pelaksanaan Terapi",
        desc: "Sesi terapi rutin oleh Fisioterapis/Okupasi Terapis handal."
    },
    {
        icon: BarChart3,
        title: "Evaluasi Progres",
        desc: "Peninjauan berkala untuk memastikan target pemulihan tercapai."
    }
];

const specialties: Specialty[] = [
    { title: "Neuro Rehabilitasi", desc: "Pasca Stroke, Parkinson, Cedera Saraf.", icon: Activity },
    { title: "Muskuloskeletal", desc: "Nyeri Punggung (HNP), Osteoartritis, Cedera Otot.", icon: Bone },
    { title: "Rehabilitasi Anak", desc: "Cerebral Palsy, Down Syndrome, Keterlambatan Gerak.", icon: Baby },
    { title: "Home-Care Service", desc: "Layanan kunjungan terapis langsung ke rumah pasien.", icon: Home },
];

export const RehabilitasiMedikPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [identifier, setIdentifier] = useState("");

    // API Hooks
    const { data: progress, isLoading: isProgressLoading, isError } = useGetRehabProgress({ identifier });
    const { data: therapies, isLoading: isTherapiesLoading } = useGetRehabTherapies();

    // Mapping dynamic therapies if available, otherwise use static
    const displayTherapies = therapies && therapies.length > 0
        ? therapies.map(t => ({
            icon: "💊", // Fallback icon for DB entries
            title: t.name,
            description: `Layanan ${t.category || 'Rehabilitasi'} dengan standar kualitas RSI.`
        }))
        : therapyServicesStatic;

    return (
        <div className="min-h-screen pb-24">
            <ServiceHero
                badge="Premium Rehabilitation Center"
                title="Rehabilitasi"
                highlightText="Kembali Beraktivitas Tanpa Batas"
                subtitle="Layanan kedokteran fisik yang berfokus pada pemulihan kemandirian pasien melalui pendekatan multidisiplin yang terukur."
            />

            <RehabJourney steps={journeySteps} />

            <RehabTherapyCatalog services={displayTherapies} />

            <RehabProgressTracker
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={() => setIdentifier(searchQuery)}
                isLoading={isProgressLoading}
                progress={progress || null}
                isError={isError}
            />

            <RehabSpecialPrograms specialties={specialties} />

            {/* CTA Section */}
            <div className="mt-12">
                <ServiceCTA
                    title="Konsultasikan Pemulihan Anda"
                    subtitle="Tanyakan jadwal dokter Sp.KFR atau koordinasikan jadwal terapi ulang via tim administrasi kami."
                    primaryAction={{
                        label: "Koordinasi via WhatsApp",
                        href: "https://wa.me/6281234567890?text=Halo, saya ingin menjadwalkan terapi rehabilitasi medik",
                        icon: "whatsapp",
                    }}
                />
            </div>
        </div>
    );
};
