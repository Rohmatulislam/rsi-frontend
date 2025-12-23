"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Heart } from "lucide-react";
import logo from "~/assets/logo.png";
import { useTranslations } from "next-intl";

const contactInfo = {
    phone: "087865733233",
    emergency: "087865733233",
    email: "info@rsisitihajar.com",
};

const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/rsisitihajar", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/rsisitihajar", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@rsisitihajar", label: "YouTube" },
];

export const Footer = () => {
    const t = useTranslations("Footer");
    const n = useTranslations("Navbar");
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: n("home"), href: "/" },
        { label: n("about"), href: "/tentang-kami" },
        { label: n("doctors"), href: "/doctors" },
        { label: n("news"), href: "/artikel" },
        { label: n("faq"), href: "/faq" },
    ];

    const serviceLinks = [
        { label: n("outpatient"), href: "/layanan/rawat-jalan" },
        { label: n("inpatient"), href: "/layanan/rawat-inap" },
        { label: n("igd"), href: "/igd" },
        { label: n("lab"), href: "/layanan/laboratorium" },
        { label: n("radiology"), href: "/layanan/radiologi" },
        { label: n("pharmacy"), href: "/layanan/farmasi" },
    ];

    const address = "Jalan Catur Warga No. 10 B, Pajang, Kecamatan Mataram, Kota Mataram, Nusa Tenggara Barat (NTB), kode pos 83126";

    return (
        <footer className="bg-slate-900 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Hospital Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src={logo}
                                alt="RSI Siti Hajar"
                                width={50}
                                height={50}
                                className="rounded-lg"
                            />
                            <div>
                                <h3 className="font-bold text-lg">RSI Siti Hajar</h3>
                                <p className="text-slate-400 text-sm">Mataram</p>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t("description")}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t("quick_links")}</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t("services")}</h4>
                        <ul className="space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t("contact")}</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-slate-400">{address}</span>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <div className="text-slate-400">
                                    <p>{contactInfo.phone}</p>
                                    <p className="text-xs text-primary mt-1">IGD: {contactInfo.emergency}</p>
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <a href={`mailto:${contactInfo.email}`} className="text-slate-400 hover:text-primary transition-colors">
                                    {contactInfo.email}
                                </a>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <Clock className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-slate-400">{t("igd_24h")}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                        <p className="flex items-center gap-1">
                            © {currentYear} RSI Siti Hajar Mataram.
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1" />
                            {t("privacy") === "Privacy Policy" ? "Made for the health of the community." : "untuk kesehatan umat."}
                        </p>
                        <div className="flex gap-6">
                            <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors">
                                {t("privacy")}
                            </Link>
                            <Link href="/syarat-ketentuan" className="hover:text-primary transition-colors">
                                {t("terms")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
