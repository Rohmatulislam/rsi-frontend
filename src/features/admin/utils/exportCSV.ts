/**
 * Export data to CSV file and trigger download.
 */
export function exportToCSV(
    data: Record<string, string | number>[],
    filename: string,
    headers?: { key: string; label: string }[]
) {
    if (!data || data.length === 0) return;

    const keys = headers ? headers.map(h => h.key) : Object.keys(data[0]);
    const labels = headers ? headers.map(h => h.label) : keys;

    const csvRows: string[] = [];

    // Header row
    csvRows.push(labels.map(l => `"${l}"`).join(','));

    // Data rows
    for (const row of data) {
        const values = keys.map(key => {
            const val = row[key];
            if (typeof val === 'number') return val;
            return `"${String(val ?? '').replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvContent = '\uFEFF' + csvRows.join('\n'); // BOM for Excel UTF-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

/**
 * Format Rupiah
 */
export function formatRupiah(value: number): string {
    return `Rp ${value.toLocaleString('id-ID')}`;
}
