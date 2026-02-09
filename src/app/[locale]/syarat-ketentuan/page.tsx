export const runtime = 'edge';
import { Metadata } from "next";
import { ServiceHero } from "~/features/services";
import {
    FileCheck,
    Scale,
    UserX,
    AlertTriangle,
    RefreshCw,
    ShieldCheck,
    Gavel,
    Mail,
    CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
    title: "Syarat dan Ketentuan | RSI Siti Hajar Mataram",
    description: "Syarat dan ketentuan penggunaan layanan RSI Siti Hajar Mataram",
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

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LEGAL"
                title="Syarat dan Ketentuan"
                highlightText="Ketentuan Penggunaan"
                subtitle="Harap baca dengan seksama sebelum menggunakan layanan kami"
            />

            <section className="py-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border">
                    <div className="text-sm text-muted-foreground mb-8">
                        Terakhir diperbarui: 17 Desember 2025
                    </div>

                    <Section icon={FileCheck} title="1. Penerimaan Syarat">
                        <p>
                            Dengan mengakses dan menggunakan website serta layanan RSI Siti Hajar Mataram
                            (&ldquo;Layanan&rdquo;), Anda menyatakan telah membaca, memahami, dan menyetujui
                            untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak menyetujui
                            syarat-syarat ini, harap tidak menggunakan Layanan kami.
                        </p>
                    </Section>

                    <Section icon={CheckCircle2} title="2. Penggunaan Layanan">
                        <p>Anda setuju untuk menggunakan Layanan kami hanya untuk tujuan yang sah, termasuk:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Mencari informasi tentang layanan kesehatan kami</li>
                            <li>Melakukan pendaftaran dan booking appointment</li>
                            <li>Mengakses informasi kesehatan dan artikel edukasi</li>
                            <li>Mengelola profil dan riwayat kunjungan Anda</li>
                        </ul>
                        <p className="mt-3">
                            Anda tidak diperkenankan menggunakan Layanan untuk tujuan yang melanggar hukum
                            atau dapat merugikan pihak lain.
                        </p>
                    </Section>

                    <Section icon={UserX} title="3. Akun Pengguna">
                        <p>
                            Untuk menggunakan beberapa fitur Layanan, Anda mungkin perlu membuat akun.
                            Anda bertanggung jawab untuk:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Menjaga kerahasiaan kredensial akun Anda</li>
                            <li>Memberikan informasi yang akurat dan terkini</li>
                            <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
                            <li>Segera melaporkan jika terjadi penggunaan tidak sah</li>
                        </ul>
                    </Section>

                    <Section icon={AlertTriangle} title="4. Disclaimer Medis">
                        <p>
                            <strong>PENTING:</strong> Informasi yang tersedia di website ini bersifat
                            umum dan edukatif. Informasi tersebut:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Tidak dimaksudkan sebagai pengganti konsultasi medis profesional</li>
                            <li>Tidak boleh digunakan untuk mendiagnosis atau mengobati kondisi kesehatan</li>
                            <li>Tidak menggantikan saran dari dokter atau tenaga medis profesional</li>
                        </ul>
                        <p className="mt-3">
                            Selalu konsultasikan kondisi kesehatan Anda dengan dokter atau tenaga
                            medis yang berkualifikasi.
                        </p>
                    </Section>

                    <Section icon={Scale} title="5. Batasan Tanggung Jawab">
                        <p>
                            RSI Siti Hajar Mataram tidak bertanggung jawab atas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>Kerugian yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan</li>
                            <li>Kesalahan atau ketidakakuratan konten website</li>
                            <li>Gangguan atau penghentian Layanan sementara</li>
                            <li>Tindakan pihak ketiga yang mengakses atau menggunakan data Anda</li>
                            <li>Keputusan yang diambil berdasarkan informasi di website</li>
                        </ul>
                    </Section>

                    <Section icon={ShieldCheck} title="6. Hak Kekayaan Intelektual">
                        <p>
                            Seluruh konten website, termasuk namun tidak terbatas pada teks, grafik,
                            logo, ikon, gambar, dan perangkat lunak, adalah milik RSI Siti Hajar Mataram
                            atau pemberi lisensinya dan dilindungi oleh hukum hak cipta.
                        </p>
                        <p className="mt-3">
                            Anda tidak diperkenankan menyalin, memodifikasi, mendistribusikan, atau
                            menggunakan konten untuk tujuan komersial tanpa izin tertulis.
                        </p>
                    </Section>

                    <Section icon={RefreshCw} title="7. Perubahan Layanan">
                        <p>
                            Kami berhak untuk mengubah, menangguhkan, atau menghentikan Layanan
                            (atau bagian dari Layanan) kapan saja dengan atau tanpa pemberitahuan.
                            Kami juga dapat memperbarui Syarat dan Ketentuan ini dari waktu ke waktu.
                        </p>
                        <p className="mt-3">
                            Penggunaan Layanan secara terus-menerus setelah perubahan dianggap
                            sebagai penerimaan terhadap syarat yang diperbarui.
                        </p>
                    </Section>

                    <Section icon={Gavel} title="8. Hukum yang Berlaku">
                        <p>
                            Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan
                            hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan
                            melalui musyawarah untuk mufakat, dan apabila tidak tercapai, akan
                            diselesaikan di Pengadilan Negeri Mataram.
                        </p>
                    </Section>

                    <Section icon={Mail} title="9. Hubungi Kami">
                        <p>
                            Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
                            silakan hubungi kami:
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
                            Dengan menggunakan layanan kami, Anda menyatakan bahwa Anda telah
                            membaca, memahami, dan menyetujui semua Syarat dan Ketentuan yang
                            tercantum di atas.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
