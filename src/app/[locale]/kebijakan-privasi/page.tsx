import { Metadata } from "next";
import { ServiceHero } from "~/features/services";
import { Shield, Lock, Eye, FileText, UserCheck, Bell, Trash2, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Kebijakan Privasi | RSI Siti Hajar Mataram",
    description: "Kebijakan privasi dan perlindungan data pengguna RSI Siti Hajar Mataram",
};

const Section = ({
    icon: Icon,
    title,
    children
}: {
    icon: any;
    title: string;
    children: React.ReactNode;
}) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="text-muted-foreground leading-relaxed space-y-3 pl-12">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LEGAL"
                title="Kebijakan Privasi"
                highlightText="Perlindungan Data Anda"
                subtitle="Kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda"
            />

            <section className="py-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border">
                    <div className="text-sm text-muted-foreground mb-8">
                        Terakhir diperbarui: 17 Desember 2025
                    </div>

                    <Section icon={Shield} title="1. Pendahuluan">
                        <p>
                            RSI Siti Hajar Mataram (&ldquo;kami&rdquo;, &ldquo;kita&rdquo;, atau &ldquo;Rumah Sakit&rdquo;)
                            menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
                            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
                            menyimpan, dan melindungi informasi pribadi Anda ketika Anda menggunakan
                            layanan website dan aplikasi kami.
                        </p>
                    </Section>

                    <Section icon={FileText} title="2. Informasi yang Kami Kumpulkan">
                        <p>Kami dapat mengumpulkan informasi berikut:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li><strong>Data Identitas:</strong> Nama lengkap, tanggal lahir, jenis kelamin, NIK</li>
                            <li><strong>Data Kontak:</strong> Alamat email, nomor telepon, alamat tempat tinggal</li>
                            <li><strong>Data Kesehatan:</strong> Riwayat medis, keluhan, diagnosis (untuk keperluan pelayanan kesehatan)</li>
                            <li><strong>Data Pendaftaran:</strong> Nomor rekam medis, riwayat kunjungan, data booking</li>
                            <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, perangkat yang digunakan</li>
                        </ul>
                    </Section>

                    <Section icon={Eye} title="3. Penggunaan Informasi">
                        <p>Informasi yang kami kumpulkan digunakan untuk:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Memberikan pelayanan kesehatan yang optimal</li>
                            <li>Memproses pendaftaran dan booking appointment</li>
                            <li>Mengirim notifikasi terkait jadwal kunjungan</li>
                            <li>Meningkatkan kualitas layanan kami</li>
                            <li>Memenuhi kewajiban hukum dan regulasi kesehatan</li>
                            <li>Komunikasi terkait layanan kesehatan Anda</li>
                        </ul>
                    </Section>

                    <Section icon={Lock} title="4. Keamanan Data">
                        <p>
                            Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi
                            data pribadi Anda dari akses yang tidak sah, pengungkapan, perubahan,
                            atau penghancuran. Langkah-langkah ini meliputi:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Enkripsi data sensitif</li>
                            <li>Akses terbatas hanya untuk petugas yang berwenang</li>
                            <li>Audit keamanan secara berkala</li>
                            <li>Penyimpanan data yang aman sesuai standar rumah sakit</li>
                        </ul>
                    </Section>

                    <Section icon={UserCheck} title="5. Hak Anda">
                        <p>Anda memiliki hak untuk:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Mengakses data pribadi Anda yang kami simpan</li>
                            <li>Meminta koreksi data yang tidak akurat</li>
                            <li>Meminta penghapusan data (dengan batasan hukum tertentu)</li>
                            <li>Menolak pemrosesan data untuk tujuan pemasaran</li>
                            <li>Menarik persetujuan yang telah diberikan</li>
                        </ul>
                    </Section>

                    <Section icon={Bell} title="6. Cookie dan Teknologi Pelacakan">
                        <p>
                            Website kami menggunakan cookie dan teknologi serupa untuk meningkatkan
                            pengalaman pengguna. Cookie membantu kami mengingat preferensi Anda
                            dan menganalisis bagaimana website kami digunakan. Anda dapat mengatur
                            browser untuk menolak cookie, namun beberapa fitur mungkin tidak
                            berfungsi dengan optimal.
                        </p>
                    </Section>

                    <Section icon={Trash2} title="7. Retensi Data">
                        <p>
                            Kami menyimpan data pribadi Anda selama diperlukan untuk tujuan yang
                            dijelaskan dalam kebijakan ini, atau sesuai dengan persyaratan hukum
                            yang berlaku. Data rekam medis disimpan sesuai dengan peraturan
                            Kementerian Kesehatan Republik Indonesia.
                        </p>
                    </Section>

                    <Section icon={Mail} title="8. Hubungi Kami">
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau
                            ingin menggunakan hak Anda terkait data pribadi, silakan hubungi kami:
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4 mt-3">
                            <p><strong>RSI Siti Hajar Mataram</strong></p>
                            <p>Jl. TGH. Lopan No.72, Dasan Agung Baru</p>
                            <p>Kec. Sandubaya, Kota Mataram, NTB 83237</p>
                            <p>Telp: (0370) 671000</p>
                            <p>Email: info@rsisitihajar.com</p>
                        </div>
                    </Section>

                    <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
                        <p>
                            Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan
                            penggunaan informasi sesuai dengan Kebijakan Privasi ini. Kami dapat
                            memperbarui kebijakan ini dari waktu ke waktu, dan perubahan akan
                            dipublikasikan di halaman ini.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
