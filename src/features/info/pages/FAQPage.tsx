"use client";

import { ServiceHero } from "~/features/services";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import { Card, CardContent } from "~/components/ui/card";

export const FAQPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <ServiceHero
                badge="TANYA JAWAB (FAQ)"
                title="Pertanyaan Umum"
                highlightText="Informasi Penting"
                subtitle="Temukan jawaban atas pertanyaan yang sering diajukan mengenai layanan dan fasilitas RSI Siti Hajar Mataram."
            />

            <div className="container mx-auto px-4 -mt-16 relative z-20 max-w-4xl">
                <Card className="shadow-xl bg-white dark:bg-slate-900">
                    <CardContent className="p-8">
                        <Accordion type="single" collapsible className="w-full">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4 text-primary">Pendaftaran & Janji Temu</h3>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Bagaimana cara mendaftar secara online?</AccordionTrigger>
                                    <AccordionContent>
                                        Anda dapat mendaftar melalui website ini dengan memilih menu "Cari Dokter", pilih dokter yang diinginkan, dan klik "Buat Janji Temu". Anda juga bisa mendaftar melalui aplikasi Mobile JKN untuk pasien BPJS.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Apakah bisa mendaftar lewat WhatsApp?</AccordionTrigger>
                                    <AccordionContent>
                                        Ya, kami menyediakan layanan pendaftaran melalui WhatsApp Center di nomor 0811-xxx-xxxx. Format: DAFTAR#NIK#NAMA#POLI#DOKTER
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Kapan jadwal pendaftaran dibuka?</AccordionTrigger>
                                    <AccordionContent>
                                        Pendaftaran online dibuka H-7 hingga H-1 sebelum jadwal praktek dokter. Untuk pendaftaran langsung (offline), loket dibuka mulai pukul 07.00 WITA.
                                    </AccordionContent>
                                </AccordionItem>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4 text-primary">BPJS & Asuransi</h3>
                                <AccordionItem value="bpjs-1">
                                    <AccordionTrigger>Apakah RSI Siti Hajar Mataram menerima pasien BPJS?</AccordionTrigger>
                                    <AccordionContent>
                                        Ya, kami melayani pasien BPJS Kesehatan untuk Rawat Jalan (dengan rujukan FKTP) dan Rawat Inap (sesuai indikasi medis / emergensi).
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="bpjs-2">
                                    <AccordionTrigger>Apa syarat berobat menggunakan BPJS?</AccordionTrigger>
                                    <AccordionContent>
                                        Membawa KTP asli, Kartu BPJS (fisik/digital), dan Surat Rujukan dari Faskes 1 (Puskesmas/Klinik) yang masih berlaku. Untuk kasus gawat darurat (IGD), rujukan tidak diperlukan.
                                    </AccordionContent>
                                </AccordionItem>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4 text-primary">Jam Operasional</h3>
                                <AccordionItem value="jam-1">
                                    <AccordionTrigger>Jam berapa jam besuk / waktu berkunjung pasien?</AccordionTrigger>
                                    <AccordionContent>
                                        <ul>
                                            <li>Siang: 11.00 - 13.00 WITA</li>
                                            <li>Sore: 16.00 - 20.00 WITA</li>
                                            <li>Untuk Ruang Intensif (ICU/ICCU), jam besuk dibatasi dan hanya 1 orang penunggu bergantian.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="jam-2">
                                    <AccordionTrigger>Apakah UGD buka 24 jam?</AccordionTrigger>
                                    <AccordionContent>
                                        Ya, Unit Gawat Darurat (UGD), Laboratorium, Farmasi, dan Radiologi kami beroperasi 24 jam setiap hari, termasuk hari libur nasional.
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
