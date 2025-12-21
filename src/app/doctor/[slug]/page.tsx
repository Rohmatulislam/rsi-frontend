import { Metadata } from "next";
import { getDoctorBySlug } from "~/features/doctor/api/getDoctorBySlug";
import DoctorDetailPage from "~/features/doctor/pages/DoctorDetailPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const doctor = await getDoctorBySlug(slug);
        const title = `${doctor.name} - ${doctor.specialization || 'Dokter'}`;
        const description = `Jadwal dan profil lengkap ${doctor.name}, spesialis ${doctor.specialization || 'di RSI Siti Hajar Mataram'}. Booking jadwal konsultasi secara online.`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: doctor.imageUrl ? [doctor.imageUrl] : [],
            },
        };
    } catch {
        return {
            title: "Profil Dokter | RSI Siti Hajar Mataram",
        };
    }
}

export default async function Page() {
    return <DoctorDetailPage />;
}