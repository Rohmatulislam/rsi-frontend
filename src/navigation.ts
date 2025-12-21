import { createNavigation } from 'next-intl/navigation';

export const locales = ['id', 'en'] as const;
export const localePrefix = 'always';

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation({ locales, localePrefix });
