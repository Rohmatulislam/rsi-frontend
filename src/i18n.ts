import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
    // In Next.js 15 / next-intl v4, locale is accessed through requestLocale promise
    const locale = await requestLocale;
    console.log('>>> [i18n] Resolved locale from promise:', locale);

    if (!locale || !locales.includes(locale as any)) {
        console.log('>>> [i18n] Invalid locale or not found:', locale);
        notFound();
    }

    return {
        locale: locale as string,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
