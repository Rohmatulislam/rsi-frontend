"use client";

import { ServiceHero } from "~/features/services";
import { Phone, Ambulance, Clock, Activity, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

const UGD_PHONE = "087864331678";
const AMBULANCE_PHONE = "087872154493";

const ACTIVE_DOCTORS = [
    "dr. Lina Efiantari",
    "dr. Restu Ardi Safiru",
    "dr. Emira Alifia",
    "dr. M. Imam Setiawan",
    "dr. Farida Pratiwi",
    "dr. M. Miftahul Hadi",
    "dr. Baiq Febri Aryani",
    "dr. Tri Wira Jati Kusuma H",
    "dr. M. Abdizil Ikram",
    "dr. L. Anugrah Nugraha"
];

export const IGDPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <ServiceHero
                badge="LAYANAN DARURAT 24 JAM"
                title="Unit Gawat Darurat"
                highlightText="Respon Cepat & Tepat"
                subtitle="Siap melayani kasus kegawatdaruratan medis 24 jam sehari, 7 hari seminggu dengan tim medis terlatih di RSI Siti Hajar Mataram."
            />

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Emergency Numbers Card */}
                <Card className="border-red-100 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="bg-red-600 p-1"></div>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                            <div className="space-y-2 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Butuh Bantuan Segera?</h3>
                                <p className="text-slate-500">Hubungi call center gawat darurat kami</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="h-16 text-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none animate-pulse">
                                    <a href={`https://wa.me/${UGD_PHONE.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer">
                                        <Phone className="mr-2 h-6 w-6" />
                                        UGD: {UGD_PHONE}
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-16 text-lg border-2 border-red-200 hover:bg-red-50 text-red-700 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/50">
                                    <a href={`tel:${AMBULANCE_PHONE}`}>
                                        <Ambulance className="mr-2 h-6 w-6" />
                                        Ambulans: {AMBULANCE_PHONE}
                                    </a>
                                </Button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-end gap-2 text-red-600 font-semibold bg-red-50 dark:bg-red-950/30 py-3 px-6 rounded-xl">
                                <Clock className="h-5 w-5" />
                                <span>SIAGA 24 JAM</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Left: Facilities & Info */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Capabilities */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                                <Activity className="text-red-600 h-8 w-8" />
                                Kapabilitas Layanan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <AlertCircle className="text-red-500 h-5 w-5" />
                                            Penanganan Trauma
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm">
                                        Penanganan kecelakaan lalu lintas, cedera kerja, dan trauma fisik lainnya dengan tim bedah siap panggil.
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Activity className="text-blue-500 h-5 w-5" />
                                            Masalah Jantung
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm">
                                        Penanganan serangan jantung akut (ACS) dengan fasilitas EKG dan obat-obatan life-saving lengkap.
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CheckCircle2 className="text-green-500 h-5 w-5" />
                                            Resusitasi Lengkap
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm">
                                        Ruang resusitasi dengan peralatan ventilator dan monitor tanda vital canggih untuk stabilisasi pasien kritis.
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Ambulance className="text-orange-500 h-5 w-5" />
                                            Layanan Ambulans
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm">
                                        Armada ambulans transport dan advance yang siap menjemput pasien dalam kondisi gawat darurat.
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Triage System Info */}
                        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                            <h2 className="text-2xl font-bold mb-4">Sistem Triase UGD</h2>
                            <p className="text-muted-foreground mb-6">
                                Kami menggunakan sistem triase untuk memprioritaskan pasien berdasarkan tingkat kegawatdaruratan penyakitnya, bukan berdasarkan urutan kedatangan.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <Badge className="bg-red-500 hover:bg-red-600 h-8 px-3 shrink-0">MERAH</Badge>
                                    <div>
                                        <h4 className="font-bold">Gawat Darurat (Resusitasi)</h4>
                                        <p className="text-sm text-slate-500">Pasien dalam kondisi mengancam nyawa yang memerlukan penanganan segera. (Contoh: Henti jantung, pendarahan hebat, sesak nafas berat)</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600 h-8 px-3 shrink-0">KUNING</Badge>
                                    <div>
                                        <h4 className="font-bold">Gawat Tidak Darurat (Emergensi)</h4>
                                        <p className="text-sm text-slate-500">Pasien yang memerlukan tindakan segera namun tanda vital stabil. (Contoh: Patah tulang terbuka, demam sangat tinggi, nyeri dada stabil)</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Badge className="bg-green-500 hover:bg-green-600 h-8 px-3 shrink-0">HIJAU</Badge>
                                    <div>
                                        <h4 className="font-bold">Tidak Gawat Tidak Darurat</h4>
                                        <p className="text-sm text-slate-500">Pasien dengan cedera ringan atau penyakit ringan yang tidak membahayakan nyawa. (Contoh: Luka lecet, batuk pilek ringan)</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Badge className="bg-slate-800 hover:bg-slate-900 h-8 px-3 shrink-0">HITAM</Badge>
                                    <div>
                                        <h4 className="font-bold">Meninggal Dunia</h4>
                                        <p className="text-sm text-slate-500">Pasien yang datang dalam keadaan meninggal dunia atau cedera parah yang tidak memungkinkan untuk diselamatkan.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Sidebar Info */}
                    <div className="space-y-6">
                        {/* Flow */}
                        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
                            <CardHeader>
                                <CardTitle className="text-blue-900 dark:text-blue-100 text-xl flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                    Alur Pelayanan UGD
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    "Datang ke UGD",
                                    "Pemeriksaan triase oleh perawat",
                                    "Pemeriksaan dokter",
                                    "Persetujuan tindakan",
                                    "Pendaftaran administrasi (keluarga)",
                                    "Observasi/rawat inap/rujuk/pulang"
                                ].map((step, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 shrink-0 text-sm">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm pt-1 leading-relaxed text-blue-900 dark:text-blue-200">{step}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Doctors List */}
                        <Card className="border-indigo-100 dark:border-indigo-900">
                            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20">
                                <CardTitle className="text-indigo-900 dark:text-indigo-100 text-xl flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-indigo-600" />
                                    Dokter Jaga Aktif
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-indigo-50 dark:divide-indigo-900">
                                    {ACTIVE_DOCTORS.map((doctor, index) => (
                                        <div key={index} className="px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{doctor}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl border-t">
                                    <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider font-semibold">
                                        Siaga Melayani 24 Jam
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Insurance - Simplified */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Asuransi Rekanan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">BPJS Kesehatan</Badge>
                                    <Badge variant="outline">BPJS Ketenagakerjaan</Badge>
                                    <Badge variant="outline">Jasa Raharja</Badge>
                                    <Badge variant="outline">Asuransi Swasta Lainnya</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    *Rujukan tidak diperlukan untuk kasus kegawatdaruratan.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
