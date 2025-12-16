"use client";

import { ServiceHero } from "~/features/services";
import { MapPin, Navigation, Car, Bus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export const LocationPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <ServiceHero
                badge="LOKASI & AKSES"
                title="Peta Lokasi"
                highlightText="Mudah Dijangkau"
                subtitle="Berlokasi strategis di Kota Mataram, mudah diakses dari berbagai arah."
            />

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <Card className="shadow-xl bg-white dark:bg-slate-900 overflow-hidden mb-8">
                    <CardContent className="p-0 relative">
                        {/* Google Maps Embed with Traffic Layer */}
                        <div className="w-full h-[500px] bg-slate-200">
                            <iframe
                                src="https://maps.google.com/maps?q=Rumah%20Sakit%20Islam%20Siti%20Hajar%20Mataram&t=m&z=15&layer=t&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Lokasi RSI Siti Hajar Mataram"
                            ></iframe>
                        </div>

                        {/* Floating Navigation Buttons */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                            <Button className="shadow-lg bg-white text-slate-800 hover:bg-slate-50 border border-slate-200" size="lg" asChild>
                                <a href="https://www.google.com/maps/dir/?api=1&destination=Rumah+Sakit+Islam+Siti+Hajar+Mataram" target="_blank" rel="noopener noreferrer">
                                    <MapPin className="text-red-600 mr-2 h-5 w-5" />
                                    Rute Google Maps
                                </a>
                            </Button>
                            <Button className="shadow-lg bg-sky-500 text-white hover:bg-sky-600 border-none" size="lg" asChild>
                                <a href="https://waze.com/ul?q=Rumah+Sakit+Islam+Siti+Hajar+Mataram&navigate=yes" target="_blank" rel="noopener noreferrer">
                                    <Navigation className="mr-2 h-5 w-5" />
                                    Navigasi Waze
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Alamat Lengkap</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Jl. Catur Warga No.8, Mataram Timur, Kec. Mataram, Kota Mataram, Nusa Tenggara Barat 83126
                                </p>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <a href="https://maps.google.com/?q=Rumah+Sakit+Islam+Siti+Hajar+Mataram" target="_blank" rel="noopener noreferrer">
                                    Buka di Google Maps
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                                <Car className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Akses Kendaraan Pribadi</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tersedia area parkir luas untuk mobil dan sepeda motor. Akses masuk melalui gerbang utama Kota Citra Graha.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                                <Bus className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Transportasi Umum</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Dapat diakses menggunakan BRT Banjarbakula (Halte Kota Citra Graha) atau taksi online.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
