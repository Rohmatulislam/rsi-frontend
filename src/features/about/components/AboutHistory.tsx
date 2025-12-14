"use client";

import Image from "next/image";
import { History } from "lucide-react";
import heroImage from "~/assets/baner.webp";

export const AboutHistory = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Text di Kiri */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
                            <History className="h-4 w-4" /> Perjalanan Kami
                        </div>
                        <h2 className="text-3xl font-bold">Sejarah Pendirian & Dedikasi</h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                            <p>
                                RSI Siti Hajar Mataram didirikan dengan semangat untuk menghadirkan layanan kesehatan yang tidak hanya berkualitas secara medis, tetapi juga mengedepankan nilai-nilai kemanusiaan dan spiritualitas Islam.
                            </p>
                            <p>
                                Berawal dari sebuah klinik sederhana yang diinisiasi oleh para tokoh muslim yang peduli akan kesehatan umat, kini kami telah tumbuh menjadi fasilitas kesehatan yang lengkap dan modern.
                            </p>
                            <p>
                                Komitmen kami adalah terus bertumbuh dan berinovasi demi memberikan pelayanan terbaik bagi masyarakat Mataram dan Nusa Tenggara Barat pada umumnya, sebagai wujud ibadah kami kepada Allah SWT.
                            </p>
                        </div>
                        <div className="pt-4">
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border-l-4 border-primary shadow-sm">
                                <p className="italic text-slate-600 dark:text-slate-400 font-medium">
                                    "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery di Kanan */}
                    <div className="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        {/* Gambar Utama (Pendiri) */}
                        <div className="relative col-span-1 row-span-2 rounded-3xl overflow-hidden shadow-xl group">
                            <Image
                                src={heroImage}
                                alt="Ketua Yayasan"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                                <div className="text-white">
                                    <p className="font-bold text-lg">H. Fulan Bin Fulan</p>
                                    <p className="text-xs opacity-80">Pendiri Utama</p>
                                </div>
                            </div>
                        </div>

                        {/* Gambar Galeri 1 */}
                        <div className="relative col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-lg group">
                            <Image
                                src={heroImage} // Gunakan foto berbeda jika ada
                                alt="Gedung Lama"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        </div>

                        {/* Gambar Galeri 2 */}
                        <div className="relative col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-lg group">
                            <Image
                                src={heroImage} // Gunakan foto berbeda jika ada
                                alt="Tim Medis Awal"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 py-1 px-3 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                                Sejak 2005
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
