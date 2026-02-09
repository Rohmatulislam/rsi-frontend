"use client";

import { useGetServiceItemById } from "~/features/services/api/getServiceItemById";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { useGetPoliQueue } from "~/features/outpatient/api/getPoliQueue";
import { useGetPoliQueuePatients } from "~/features/outpatient/api/getPoliQueuePatients";
import { ServiceHero, ServiceSection } from "~/features/services";
import { DoctorCard, DoctorCardSkeleton } from "~/components/shared/DoctorCard";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Stethoscope, Clock, MapPin, Phone, Users, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { ServiceCTA } from "~/features/services/components/ServiceCTA";
import { ServicePageSkeleton } from "~/components/shared/ServicePageSkeleton";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";
import { useState, useEffect, useRef } from "react";

interface PoliDetailPageProps {
    id: string;
}

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const PoliDetailPage = ({ id }: PoliDetailPageProps) => {
    const { data: item, isLoading: itemLoading, error } = useGetServiceItemById(id);
    // Check if this is a SIMRS code (usually short) or a local CUID (long, starts with 'c')
    const isSimrsCode = id.length <= 10 && !id.startsWith('cl');

    // Fetch doctors - if it's a SIMRS code, filter in backend, otherwise fetch all and filter in frontend
    const { data: allDoctors, isLoading: doctorsLoading } = useGetDoctorsList({
        input: {
            limit: 1000,
            poliCode: isSimrsCode ? id : undefined,
            showAll: !isSimrsCode // Show all if we're doing frontend filtering by specialization
        } as any,
    });

    if (itemLoading) {
        return <ServicePageSkeleton variant="detail" />;
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Stethoscope className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Poliklinik Tidak Ditemukan</h1>
                <p className="text-muted-foreground">Data poliklinik yang Anda cari tidak tersedia.</p>
                <Button asChild>
                    <Link href="/layanan/rawat-jalan">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Rawat Jalan
                    </Link>
                </Button>
            </div>
        );
    }

    // Check if this is executive based on service slug or item name
    const isExecutive = item.service?.slug === 'poli-executive' ||
        item.name.toLowerCase().includes('eksekutif') ||
        item.name.toLowerCase().includes('executive');

    // Extract base specialty from item name (remove "Poliklinik", "Poli", "Eksekutif", "Spesialis", etc.)
    const baseSpecialty = item.name
        .replace(/poliklinik|poli|eksekutif|ekskutif|executive|spesialis/gi, '')
        .replace(/umum\/pks/gi, '')
        .trim();

    // Filter doctors by matching specialization
    const filteredDoctors = allDoctors?.filter(doc => {
        // If we already filtered by poliCode in the backend, these are already correct
        if (isSimrsCode) return true;

        const docSpec = doc.specialization?.toLowerCase() || '';
        const specToMatch = baseSpecialty.toLowerCase();

        // Direct match or partial match
        if (docSpec.includes(specToMatch) || specToMatch.includes(docSpec)) {
            // If executive, only show executive doctors
            if (isExecutive) {
                return doc.is_executive === true;
            }
            return true;
        }
        return false;
    }) || [];

    const operatingHours = [
        { day: "Senin - Jumat", hours: "08.00 - 20.00 WITA" },
        { day: "Sabtu", hours: "08.00 - 14.00 WITA" },
        { day: "Minggu & Libur", hours: "Tutup" },
    ];

    // Build breadcrumb items
    const breadcrumbItems = isExecutive
        ? [
            { label: "Layanan Unggulan", href: "/layanan-unggulan" },
            { label: "Poli Eksekutif", href: "/layanan-unggulan/executive" },
            { label: item.name }
        ]
        : [
            { label: "Layanan", href: "/layanan" },
            { label: "Rawat Jalan", href: "/layanan/rawat-jalan" },
            { label: item.name }
        ];

    return (
        <div className="min-h-screen">
            {/* Breadcrumb Navigation */}
            <BreadcrumbContainer items={breadcrumbItems} className="bg-muted/30 border-b" />

            <ServiceHero
                badge={isExecutive ? "POLI EKSEKUTIF" : "POLIKLINIK SPESIALIS"}
                title={item.name}
                highlightText={isExecutive ? "Layanan Premium" : "Layanan Dokter Spesialis"}
                subtitle={item.description || `Layanan konsultasi dan pemeriksaan ${item.name} dengan dokter spesialis berpengalaman.`}
            />

            {/* Live Service Section (Video + Queue) */}
            <section className="py-8 bg-black/5 dark:bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Video Section (Left - 2 Cols) */}
                        <div className="lg:col-span-2">
                            <div className="rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white dark:ring-slate-800">
                                <div className="relative aspect-video bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(item.videoUrl || "https://www.youtube.com/watch?v=FlI7shjrsqA")}?loop=1&playlist=${getYouTubeId(item.videoUrl || "https://www.youtube.com/watch?v=FlI7shjrsqA")}`}
                                        title={`Video ${item.name}`}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Queue Info (Right - 1 Col) */}
                        <div className="flex flex-col h-full">
                            <div className="bg-card border rounded-2xl p-6 h-full shadow-lg relative overflow-hidden">
                                {/* Header with Sound Toggle */}
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        Live Antrian
                                    </h3>
                                </div>
                                <QueueInfoCard poliId={id} poliName={item.name} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section (Hours & Location) */}
            <section className="py-12 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card border rounded-2xl p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Jam Operasional</h4>
                                {operatingHours.map((h, idx) => (
                                    <p key={idx} className="text-sm text-muted-foreground">
                                        {h.day}: {h.hours}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Lokasi</h4>
                                <p className="text-sm text-muted-foreground">
                                    Gedung Rawat Jalan<br />
                                    RSI Siti Hajar Mataram
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <ServiceSection
                title={`Dokter ${baseSpecialty}`}
                subtitle={`Tim dokter spesialis yang siap melayani Anda`}
            >
                <div className="mb-8">
                    <Button variant="outline" asChild>
                        <Link href={isExecutive ? "/layanan-unggulan/executive" : "/layanan/rawat-jalan"}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke {isExecutive ? "Eksekutif" : "Rawat Jalan"}
                        </Link>
                    </Button>
                </div>

                {doctorsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <DoctorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                        <div className="p-4 rounded-full bg-muted inline-flex mb-4">
                            <Stethoscope className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada dokter terdaftar</h3>
                        <p className="text-muted-foreground mb-4">
                            Saat ini belum ada data dokter untuk {item.name}.
                        </p>
                        <Button asChild>
                            <Link href="/doctors">Lihat Semua Dokter</Link>
                        </Button>
                    </div>
                )}
            </ServiceSection>

            <ServiceCTA
                title={`Butuh Layanan ${baseSpecialty}?`}
                subtitle="Hubungi kami untuk informasi jadwal dan pendaftaran"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin daftar di ${item.name}`,
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};

const QueueInfoCard = ({ poliId, poliName }: { poliId: string, poliName: string }) => {
    const { data: queue, isLoading, error } = useGetPoliQueue(poliId);
    const { data: patientsData } = useGetPoliQueuePatients(poliId);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [activePatientTab, setActivePatientTab] = useState<'waiting' | 'served'>('waiting');
    const lastCalledQueue = useRef<string | null>(null);

    // Auto-scroll State
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // 1. Auto-scroll Effect
    useEffect(() => {
        if (isAutoScroll && tableContainerRef.current) {
            const container = tableContainerRef.current;

            scrollIntervalRef.current = setInterval(() => {
                if (!container) return;

                // Simple scroll down logic
                if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
                    // Reached bottom, wait a bit then reset to top
                    setTimeout(() => {
                        if (container) container.scrollTop = 0;
                    }, 2000);
                } else {
                    container.scrollTop += 1; // Smooth slow scroll
                }
            }, 50); // Adjust speed here
        }

        return () => {
            if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        };
    }, [isAutoScroll, patientsData, activePatientTab]);

    // TTS Logic
    useEffect(() => {
        if (!queue || !isAudioEnabled || !queue.current || queue.current === '-') return;

        // Check if queue has changed
        if (lastCalledQueue.current !== queue.current) {
            lastCalledQueue.current = queue.current;

            // Normalize poli name (remove 'Poli' prefix if exists for better speech)
            const spokenPoliName = poliName.replace(/^Poli\s+/i, '');

            // Format text to speech
            const textToSpeak = `Nomor Antrean... ${queue.current.split('').join(' ')}... Silakan masuk ke Poli ${spokenPoliName}`;

            if ('speechSynthesis' in window) {
                // Cancel previous speech if any
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'id-ID'; // Indonesian
                utterance.rate = 0.9; // Slightly slower

                window.speechSynthesis.speak(utterance);
            }
        }
    }, [queue?.current, isAudioEnabled, poliName]);

    if (isLoading) return (
        <>
            <div className="h-12 w-12 rounded-xl bg-muted/50 animate-pulse mb-4" />
            <div className="space-y-4 flex-1">
                <div className="h-8 w-3/4 bg-muted/50 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted/50 animate-pulse rounded" />
                <div className="h-10 w-full bg-muted/50 animate-pulse rounded" />
            </div>
        </>
    );

    if (error || !queue) return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <Users className="h-8 w-8" />
            </div>
            <h4 className="font-bold mb-2">Data Belum Tersedia</h4>
            <p className="text-sm text-muted-foreground">
                Silakan hubungi petugas untuk informasi antrian.
            </p>
        </div>
    );

    return (
        <div className="flex flex-col h-full justify-between relative">
            <div className="absolute top-0 right-0 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-8 w-8 ${isAudioEnabled ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    title={isAudioEnabled ? "Matikan Suara Panggilan" : "Aktifkan Suara Panggilan"}
                >
                    {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
            </div>

            <div className="text-center py-4 border-b border-dashed">
                <p className="text-sm text-muted-foreground mb-1">Sedang Memeriksa</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tighter">
                        {queue.current}
                    </span>
                </div>
                {queue.currentDoctor && queue.currentDoctor !== '-' && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 mt-2">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Dokter</p>
                        <p className="font-medium text-emerald-800 dark:text-emerald-300 line-clamp-2">
                            {queue.currentDoctor}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Pasien</p>
                    <span className="text-xl font-bold">{queue.total}</span>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Sisa Antrian</p>
                    <span className="text-xl font-bold">{queue.remaining}</span>
                </div>
            </div>

            {/* Patient List Section */}
            {patientsData && patientsData.patients.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed">
                    <div className="flex gap-1 mb-3">
                        <button
                            onClick={() => setActivePatientTab('waiting')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activePatientTab === 'waiting'
                                ? 'bg-amber-500 text-white'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Menunggu ({patientsData.patients.filter(p => p.is_waiting).length})
                        </button>
                        <button
                            onClick={() => setActivePatientTab('served')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activePatientTab === 'served'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Selesai ({patientsData.patients.filter(p => !p.is_waiting).length})
                        </button>

                        {/* Auto Scroll Toggle */}
                        <button
                            onClick={() => setIsAutoScroll(!isAutoScroll)}
                            className={`px-2 py-1.5 rounded-lg transition-all ${isAutoScroll ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}
                            title={isAutoScroll ? "Matikan Auto Scroll" : "Aktifkan Auto Scroll"}
                        >
                            {isAutoScroll ? "ON" : "OFF"}
                        </button>
                    </div>

                    <div
                        ref={tableContainerRef}
                        className="max-h-[150px] overflow-y-auto space-y-1 scroll-smooth"
                    >
                        {patientsData.patients
                            .filter(p => activePatientTab === 'waiting' ? p.is_waiting : !p.is_waiting)
                            .map((patient, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-xs">
                                    <span className="font-mono font-bold text-primary w-8">{patient.no_reg}</span>
                                    <span className="flex-1 truncate">{patient.nm_pasien}</span>
                                    <span className="text-muted-foreground">{patient.jam_reg}</span>
                                </div>
                            ))
                        }
                        {patientsData.patients.filter(p => activePatientTab === 'waiting' ? p.is_waiting : !p.is_waiting).length === 0 && (
                            <p className="text-center text-muted-foreground text-xs py-4">
                                {activePatientTab === 'waiting' ? 'Tidak ada pasien menunggu' : 'Belum ada pasien dilayani'}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-dashed">
                <p className="text-xs text-center text-muted-foreground">
                    Diperbarui otomatis setiap 30 detik
                </p>
            </div>
        </div>
    );
}
