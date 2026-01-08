"use client";

import { ServiceHero } from "~/features/services";
import { Phone, Mail, MapPin, Instagram, Facebook, Globe, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export const ContactPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <ServiceHero
                badge="HUBUNGI KAMI"
                title="Kontak & Informasi"
                highlightText="Selalu Terhubung"
                subtitle="Kami siap membantu menjawab pertanyaan Anda seputar layanan dan fasilitas RSI Siti Hajar Mataram."
            />

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-xl bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle>Informasi Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase text-muted-foreground mb-1">Alamat</h4>
                                        <p className="text-slate-900 dark:text-white">
                                            Jl. Catur Warga No.8, Mataram Timur, Kec. Mataram, Kota Mataram
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase text-muted-foreground mb-1">Telepon</h4>
                                        <p className="text-slate-900 dark:text-white font-mono text-lg">0878-6433-1678 (UGD)</p>
                                        <p className="text-xs text-muted-foreground mt-1">Informasi: (0370) 623498</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase text-muted-foreground mb-1">Email</h4>
                                        <p className="text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer">
                                            info@rsisitihajar.co.id
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase text-muted-foreground mb-1">Jam Operasional</h4>
                                        <p className="text-slate-900 dark:text-white">UGD & Rawat Inap: 24 Jam</p>
                                        <p className="text-slate-900 dark:text-white">Poliklinik: 08.00 - 21.00</p>
                                        <p className="text-slate-900 dark:text-white">Kantor: 08.00 - 16.00</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Media Sosial</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Instagram className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Facebook className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Globe className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                                <p className="text-muted-foreground">
                                    Punya pertanyaan atau masukan? Silakan kirim pesan kepada kami.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input id="name" placeholder="Masukan nama anda" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="contoh@email.com" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">No. Telepon / WA</Label>
                                            <Input id="phone" type="tel" placeholder="08xxx" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subjek</Label>
                                            <Input id="subject" placeholder="Perihal pesan" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Pesan</Label>
                                        <Textarea id="message" placeholder="Tulis pesan anda disini..." rows={5} />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" size="lg">Kirim Pesan</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
