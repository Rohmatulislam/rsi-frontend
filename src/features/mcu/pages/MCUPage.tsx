"use client";

import { useState, useMemo } from "react";
import { ServiceHero, ServiceSection, ServiceCTA } from "~/features/services";
import {
    Loader2, ArrowRight,
    ClipboardCheck, Activity, FlaskConical, Zap,
    Search, Filter, ChevronRight,
    ShieldCheck, Microscope, HeartPulse, Star,
    CheckCircle2, Calendar, Package
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useGetMcuPackages } from "~/features/mcu";
import { MCUPageSkeleton } from "~/components/shared/PageSkeletons";
import { McuBenefitsSection } from "../components/McuBenefitsSection";
import { McuInfoSection } from "../components/McuInfoSection";
import { McuPackage } from "../services/mcuService";
import { McuBookingModal } from "../components/McuBookingModal";

export const MCUPage = () => {
    const { data: service, isLoading: serviceLoading } = useGetServiceBySlug({ slug: 'mcu' });
    const { data: mcuPackages, isLoading: mcuLoading } = useGetMcuPackages();

    const [activeStep, setActiveStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPackage, setSelectedPackage] = useState<McuPackage | null>(null);
    const [selectedExams, setSelectedExams] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const categories = useMemo(() => {
        if (!mcuPackages) return [];
        const uniqueNames = Array.from(new Set(mcuPackages.map(pkg => pkg.category).filter(Boolean)));
        return uniqueNames.map(name => {
            let icon = Star;
            let desc = "Pemeriksaan kesehatan terpadu.";
            if (name?.includes('Deteksi Dini')) { icon = ShieldCheck; desc = "Fokus pada deteksi dini penyakit spesifik."; }
            if (name?.includes('Skrining')) { icon = Microscope; desc = "Pemeriksaan laboratorium menyeluruh."; }
            if (name?.includes('Umum')) { icon = HeartPulse; desc = "Paket pemeriksaan kesehatan rutin."; }
            if (name?.includes('Spesial')) { icon = Zap; desc = "Paket pemeriksaan dengan penawaran khusus."; }
            return { name, icon, desc };
        });
    }, [mcuPackages]);

    const filteredPackages = useMemo(() => {
        if (!mcuPackages) return [];
        return mcuPackages.filter(pkg => {
            const matchesCategory = !selectedCategory || pkg.category === selectedCategory;
            const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [mcuPackages, selectedCategory, searchQuery]);

    const parsedExams = useMemo(() => {
        if (!selectedPackage?.features) return [];
        return selectedPackage.features.split(',').map(f => {
            const [name, price] = f.split('|');
            return {
                name: name.trim(),
                price: parseInt(price) || 0
            };
        });
    }, [selectedPackage]);

    const dynamicPricing = useMemo(() => {
        if (!selectedPackage) return { original: 0, final: 0, savings: 0 };
        const selectedNames = new Set(selectedExams);
        const totalGross = parsedExams
            .filter(e => selectedNames.has(e.name))
            .reduce((sum, e) => sum + e.price, 0);

        // Apply 15% discount as per CSV data
        const totalFinal = Math.floor(totalGross * 0.85 / 100) * 100; // Round to nearest 100

        return {
            original: totalGross,
            final: totalFinal,
            savings: totalGross - totalFinal
        };
    }, [selectedPackage, selectedExams, parsedExams]);

    const handleSelectCategory = (cat: string) => {
        setSelectedCategory(cat);
        setActiveStep(2);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

    const handleSelectPackage = (pkg: McuPackage) => {
        setSelectedPackage(pkg);
        const exams = pkg.features ? pkg.features.split(',').map(f => f.split('|')[0].trim()) : [];
        setSelectedExams(exams);
        setActiveStep(3);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

    const toggleExam = (exam: string) => {
        setSelectedExams(prev =>
            prev.includes(exam)
                ? prev.filter(e => e !== exam)
                : [...prev, exam]
        );
    };

    const toggleAllExams = () => {
        if (selectedExams.length === parsedExams.length) {
            setSelectedExams([]);
        } else {
            setSelectedExams(parsedExams.map(e => e.name));
        }
    };

    const resetWizard = () => {
        setActiveStep(1);
        setSelectedCategory("");
        setSelectedPackage(null);
        setSearchQuery("");
    };

    if (serviceLoading) {
        return <MCUPageSkeleton />;
    }

    return (
        <div className="min-h-screen pb-24 bg-slate-50/30 dark:bg-slate-950/30">
            <ServiceHero
                badge="PREVENTIVE CARE"
                title={service?.title || service?.name || "Medical Check Up"}
                highlightText={service?.subtitle || "Investasi Masa Depan"}
                subtitle={service?.description || "Layanan pemeriksaan kesehatan komprehensif didukung laboratorium modern untuk deteksi dini dan pemantauan kondisi tubuh Anda secara mendalam."}
            />

            {/* Premium Stats / Highlights */}
            <div className="container mx-auto px-4 -mt-10 mb-20 relative z-10">
                <div className="bg-card border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative border-primary/10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-bl-[10rem] -mr-20 -mt-20" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {[
                            { icon: ClipboardCheck, label: `${mcuPackages?.length || '12'}+ Paket MCU`, desc: "Pilih Sesuai Kebutuhan" },
                            { icon: Activity, label: "Hasil Digital", desc: "Akses via Portal Pasien" },
                            { icon: FlaskConical, label: "Lab Bersertifikat", desc: "Akurasi Diagnosa 100%" },
                            { icon: Zap, label: "Booking Instan", desc: "Tanpa Biaya Admin" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 transition-transform hover:scale-110">
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h4 className="font-bold text-base mb-1">{item.label}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Wizard Selection Area */}
            <section className="py-20 relative overflow-hidden min-h-[800px]">
                <div className="container mx-auto px-4">
                    {/* Step Progress Indicator */}
                    <div className="max-w-3xl mx-auto mb-20">
                        <div className="flex items-center justify-between relative text-center">
                            <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                            {[
                                { step: 1, label: "Kategori", icon: Filter },
                                { step: 2, label: "Pilih Paket", icon: Package },
                                { step: 3, label: "Rincian Pemeriksaan", icon: ClipboardCheck },
                            ].map((s) => (
                                <div key={s.step} className="flex flex-col items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeStep === s.step ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" :
                                        activeStep > s.step ? "bg-green-500 text-white" : "bg-white dark:bg-slate-900 border-2 text-muted-foreground"
                                        }`}>
                                        <s.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep === s.step ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Pilih Kategori */}
                    {activeStep === 1 && (
                        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="text-center space-y-4">
                                <Badge className="bg-primary/10 text-primary border-none uppercase tracking-widest px-4 font-bold">Step 1</Badge>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Apa Kebutuhan Anda?</h2>
                                <p className="text-muted-foreground text-lg">Pilih kategori MCU untuk melihat paket yang tersedia.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectCategory(cat.name)}
                                        className="group bg-card border border-border/60 p-8 rounded-[2.5rem] text-left transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 flex flex-col items-start gap-6"
                                    >
                                        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <cat.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                                        </div>
                                        <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                                            Lihat Paket <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="max-w-xl mx-auto pt-8">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama paket langsung..."
                                        className="pl-11 rounded-full h-14 bg-white/50 border-border/50 shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-card border rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="max-h-60 overflow-y-auto space-y-2">
                                                {filteredPackages.length > 0 ? filteredPackages.slice(0, 5).map(pkg => (
                                                    <button
                                                        key={pkg.id}
                                                        onClick={() => handleSelectPackage(pkg)}
                                                        className="w-full p-3 rounded-xl hover:bg-primary/5 flex items-center justify-between text-left transition-colors"
                                                    >
                                                        <div>
                                                            <div className="font-bold flex items-center gap-2">
                                                                {pkg.name}
                                                                <Badge variant="outline" className="text-[8px] h-4 py-0 uppercase">{pkg.category}</Badge>
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground">Mulai Rp {pkg.price.toLocaleString('id-ID')}</div>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-primary" />
                                                    </button>
                                                )) : (
                                                    <div className="text-center py-4 text-sm text-muted-foreground">Tidak ditemukan paket dengan nama tersebut.</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Pilih Nama Paket */}
                    {activeStep === 2 && (
                        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setActiveStep(1)}
                                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline mb-2"
                                    >
                                        <ArrowRight className="h-3 w-3 rotate-180" /> Kembali ke Kategori
                                    </button>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">Paket {selectedCategory}</h2>
                                    <p className="text-muted-foreground">Pilih salah satu paket di bawah untuk melihat rincian pemeriksaan.</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari di kategori ini..."
                                        className="pl-11 rounded-full h-12"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPackages.map((pkg, idx) => (
                                    <div
                                        key={pkg.id}
                                        className="group bg-card border border-border/60 rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 hover:shadow-2xl hover:border-primary/40 relative overflow-hidden"
                                    >
                                        <h3 className="text-xl font-bold mb-4 pr-8 group-hover:text-primary transition-colors">{pkg.name}</h3>
                                        <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border/40">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-60">Total Biaya</p>
                                            <p className="text-2xl font-black text-primary">Rp {pkg.price.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="space-y-3 mb-8 flex-grow">
                                            {pkg.features?.split(',').slice(0, 3).map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> {f.trim()}
                                                </div>
                                            ))}
                                            <div className="text-[10px] font-bold text-primary italic pl-8">+ {pkg.features?.split(',').length! - 3} pemeriksaan lainnya</div>
                                        </div>
                                        <Button
                                            onClick={() => handleSelectPackage(pkg)}
                                            className="w-full rounded-2xl h-12 shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all font-bold"
                                        >
                                            Pilih Paket <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Rincian Pemeriksaan */}
                    {activeStep === 3 && selectedPackage && (
                        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left: Package Summary */}
                                <div className="lg:col-span-5 space-y-8">
                                    <button
                                        onClick={() => setActiveStep(2)}
                                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                    >
                                        <ArrowRight className="h-3 w-3 rotate-180" /> Kembali pilih paket
                                    </button>

                                    <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl shadow-primary/40 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-[10rem] -mr-10 -mt-10" />
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none uppercase tracking-widest px-4 mb-6">{selectedPackage.category}</Badge>
                                        <h2 className="text-4xl font-black mb-4 leading-tight">{selectedPackage.name}</h2>
                                        <p className="text-primary-foreground/80 mb-8 text-sm leading-relaxed">Paket pemeriksaan komprehensif untuk mendeteksi kondisi kesehatan Anda secara menyeluruh dengan hasil yang akurat.</p>
                                        <div className="pt-8 border-t border-white/20 flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Estimasi Total (Hemat Rp {dynamicPricing.savings.toLocaleString('id-ID')})</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm line-through opacity-40 font-bold">Rp {dynamicPricing.original.toLocaleString('id-ID')}</span>
                                                    <p className="text-3xl font-black">Rp {dynamicPricing.final.toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                            <McuBookingModal
                                                package={{ ...selectedPackage, price: dynamicPricing.final }}
                                                selectedExams={selectedExams}
                                                trigger={
                                                    <Button
                                                        disabled={selectedExams.length === 0}
                                                        className="bg-white text-primary hover:bg-slate-100 h-14 rounded-2xl px-8 font-black shadow-xl"
                                                    >
                                                        Booking
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-card border p-6 rounded-[2rem] space-y-2">
                                            <Calendar className="h-6 w-6 text-primary" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimasi</p>
                                            <p className="font-bold">2-4 Jam</p>
                                        </div>
                                        <div className="bg-card border p-6 rounded-[2rem] space-y-2">
                                            <Activity className="h-6 w-6 text-primary" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hasil</p>
                                            <p className="font-bold">H+1 Kerja</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Detailed List of Exams */}
                                <div className="lg:col-span-7">
                                    <div className="bg-card border rounded-[3rem] p-10 space-y-8 flex flex-col h-full">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black flex items-center gap-3">
                                                <ClipboardCheck className="h-7 w-7 text-primary" />
                                                Pilih Pemeriksaan
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[10px] font-black uppercase tracking-widest"
                                                    onClick={toggleAllExams}
                                                >
                                                    {selectedExams.length === (selectedPackage.features?.split(',').length || 0) ? "Batal Semua" : "Pilih Semua"}
                                                </Button>
                                                <Badge variant="secondary" className="rounded-full px-4">{selectedExams.length} terpilih</Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-primary/10 pl-1 py-1">
                                            {parsedExams.map((exam, i) => {
                                                const isSelected = selectedExams.includes(exam.name);
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => toggleExam(exam.name)}
                                                        className={`flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 text-left ${isSelected
                                                            ? "bg-primary/5 border-primary shadow-sm"
                                                            : "bg-white dark:bg-slate-900 border-border/40 opacity-60 hover:opacity-100 hover:border-primary/20"
                                                            }`}
                                                    >
                                                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? "bg-primary border-primary" : "border-border/60"
                                                            }`}>
                                                            {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className={`text-sm font-bold transition-colors ${isSelected ? "text-primary" : "text-muted-foreground"}`}>{exam.name}</span>
                                                            <span className="text-[10px] opacity-60 font-medium">Rp {exam.price.toLocaleString('id-ID')}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-auto pt-8 border-t border-dashed space-y-4">
                                            <div className="flex items-start gap-3 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                                                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                                                <p>Disarankan berpuasa mulai pukul 22.00 malam sebelum pemeriksaan (10-12 jam).</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 rounded-xl text-primary border-primary/20 hover:bg-primary/5 font-bold"
                                                onClick={() => window.open(`https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang paket ${selectedPackage?.name}`, '_blank')}
                                            >
                                                Tanya via WhatsApp <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Selection */}
            <ServiceSection
                title="Pentingnya Pemeriksaan Rutin"
                subtitle="Mencegah lebih baik daripada mengobati. Awasi kesehatan Anda dengan standar medis terbaik."
            >
                <McuBenefitsSection />
            </ServiceSection>

            {/* Informational FAQ-style section */}
            <McuInfoSection />

            <ServiceCTA
                title="Cek Kesehatan Anda Sekarang"
                subtitle="Dapatkan hasil pemeriksaan yang akurat dan konsultasi dengan dokter kami untuk langkah pencegahan terbaik."
                primaryAction={{
                    label: "Konsultasi Paket via WA",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang paket MCU di RSI Siti Hajar`,
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Profil Dokter MCU",
                    href: "/doctors",
                }}
            />
        </div>
    );
};
