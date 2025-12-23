import { MetadataRoute } from 'next';
import { getDoctors, DoctorDto } from '~/features/home/api/getDoctors';
import { getArticles } from '~/features/article/api/getArticles';
import { ArticleDto } from '~/features/article/services/articleService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rsisitihajarmataram.com';

    // Fetch dynamic data
    let doctors: DoctorDto[] = [];
    let articles: ArticleDto[] = [];

    try {
        [doctors, articles] = await Promise.all([
            getDoctors(),
            getArticles()
        ]);
    } catch (error) {
        console.error('Sitemap fetch error:', error);
    }

    // Static routes
    const staticRoutes = [
        '',
        '/doctors',
        '/artikel',
        '/tentang-kami',
        '/layanan/rawat-inap',
        '/layanan/rawat-jalan',
        '/layanan/mcu',
        '/layanan/laboratorium',
        '/layanan/radiologi',
        '/layanan/farmasi',
        '/kontak',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Doctor routes
    const doctorRoutes = doctors.filter(d => d.slug).map((doctor) => ({
        url: `${baseUrl}/doctor/${doctor.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Article routes
    const articleRoutes = articles.filter(a => a.slug).map((article) => ({
        url: `${baseUrl}/artikel/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...doctorRoutes, ...articleRoutes];
}
