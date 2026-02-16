/**
 * Utility to normalize and check SIMRS poliklinik names in Frontend
 */

export const POLI_KEYWORDS_REGEX = /(poliklinik|poli|klinik|eksekutif|ekskutif|executive)/gi;

/**
 * Normalizes a poliklinik name by removing noise and standardizing "Eksekutif"
 */
export function normalizePoliName(name: string | undefined | null): string {
    if (!name) return '';

    let normalized = name.replace(POLI_KEYWORDS_REGEX, (match) => {
        const lower = match.toLowerCase();
        if (lower.includes('eksekutif') || lower.includes('ekskutif') || lower.includes('executive')) {
            return 'Eksekutif';
        }
        return '';
    });

    return normalized.replace(/\s+/g, ' ').trim();
}

/**
 * Checks if a name indicates executive service
 */
export function isExecutiveName(name: string | undefined | null): boolean {
    if (!name) return false;
    const lower = name.toLowerCase();
    return lower.includes('eksekutif') ||
        lower.includes('ekskutif') ||
        lower.includes('executive');
}

/**
 * Formats name for display, standardizing "Eksekutif"
 */
export function formatDisplayPoliName(name: string | undefined | null): string {
    if (!name) return '';
    return name.replace(/(eksekutif|ekskutif|executive)/gi, 'Eksekutif').trim();
}
