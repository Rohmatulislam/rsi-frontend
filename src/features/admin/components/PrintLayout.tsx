"use client";

import React, { useRef } from "react";
import { Printer, Building2, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";

interface PrintLayoutProps {
    title: string;
    period: string;
    startDate?: string;
    endDate?: string;
    children: React.ReactNode;
}

const hospitalInfo = {
    name: "RUMAH SAKIT ISLAM SITI HAJAR MATARAM",
    address: "Jl. Catur Warga No. 23, Mataram, NTB 83126",
    phone: "(0370) 632-110",
    tagline: "Melayani Dengan Hati",
};

const formatPrintDate = (d?: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const PrintLayout = ({ title, period, startDate, endDate, children }: PrintLayoutProps) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const win = window.open('', '_blank');
        if (!win) return;

        win.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>${title} - ${hospitalInfo.name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Inter', -apple-system, sans-serif;
                        font-size: 11px;
                        color: #1a1a1a;
                        line-height: 1.5;
                        padding: 20mm 15mm;
                    }

                    .header {
                        text-align: center;
                        border-bottom: 3px double #1a1a1a;
                        padding-bottom: 12px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        font-size: 16px;
                        font-weight: 800;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        margin-bottom: 4px;
                    }
                    .header .address {
                        font-size: 10px;
                        color: #555;
                    }
                    .header .phone {
                        font-size: 10px;
                        color: #555;
                    }
                    .header .tagline {
                        font-size: 9px;
                        font-style: italic;
                        color: #777;
                        margin-top: 4px;
                    }

                    .report-title {
                        text-align: center;
                        font-size: 14px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin: 20px 0 6px;
                    }
                    .report-period {
                        text-align: center;
                        font-size: 10px;
                        color: #555;
                        margin-bottom: 20px;
                    }

                    .content table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 12px 0;
                    }
                    .content table th,
                    .content table td {
                        border: 1px solid #ddd;
                        padding: 6px 10px;
                        text-align: left;
                        font-size: 10px;
                    }
                    .content table th {
                        background: #f5f5f5;
                        font-weight: 600;
                        text-transform: uppercase;
                        font-size: 9px;
                        letter-spacing: 0.5px;
                    }
                    .content table tr:nth-child(even) {
                        background: #fafafa;
                    }
                    .content table tfoot td {
                        font-weight: 700;
                        background: #f0f0f0;
                        border-top: 2px solid #333;
                    }

                    .content h3 {
                        font-size: 12px;
                        font-weight: 700;
                        margin: 16px 0 8px;
                        border-left: 3px solid #333;
                        padding-left: 8px;
                    }

                    .content .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 12px;
                        margin: 12px 0;
                    }
                    .content .summary-card {
                        border: 1px solid #ddd;
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .content .summary-card .label {
                        font-size: 9px;
                        text-transform: uppercase;
                        color: #777;
                        font-weight: 600;
                    }
                    .content .summary-card .value {
                        font-size: 14px;
                        font-weight: 700;
                        margin-top: 2px;
                    }

                    .footer {
                        margin-top: 40px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                    }
                    .footer .sign-block {
                        text-align: center;
                        min-width: 200px;
                    }
                    .footer .sign-line {
                        border-bottom: 1px solid #333;
                        width: 180px;
                        margin: 60px auto 4px;
                    }

                    .print-date {
                        text-align: right;
                        font-size: 9px;
                        color: #555;
                        margin-top: 20px;
                    }

                    @media print {
                        body { padding: 15mm 10mm; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${hospitalInfo.name}</h1>
                    <div class="address">${hospitalInfo.address}</div>
                    <div class="phone">Telp: ${hospitalInfo.phone}</div>
                    <div class="tagline">"${hospitalInfo.tagline}"</div>
                </div>

                <div class="report-title">${title}</div>
                <div class="report-period">
                    Periode: ${startDate && endDate ? `${formatPrintDate(startDate)} s/d ${formatPrintDate(endDate)}` : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </div>

                <div class="content">
                    ${printContent.innerHTML}
                </div>

                <div class="print-date">
                    Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>

                <div class="footer">
                    <div class="sign-block">
                        <div>Mengetahui,</div>
                        <div>Direktur</div>
                        <div class="sign-line"></div>
                        <div style="font-size:9px;color:#888">(Nama & Tanda Tangan)</div>
                    </div>
                    <div class="sign-block">
                        <div>Dibuat oleh,</div>
                        <div>Bagian Keuangan</div>
                        <div class="sign-line"></div>
                        <div style="font-size:9px;color:#888">(Nama & Tanda Tangan)</div>
                    </div>
                </div>
            </body>
            </html>
        `);
        win.document.close();
        setTimeout(() => win.print(), 400);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-bold text-sm">{hospitalInfo.name}</h3>
                        <p className="text-xs text-muted-foreground">{title}</p>
                    </div>
                </div>
                <Button onClick={handlePrint} variant="default" size="sm" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Cetak Laporan
                </Button>
            </div>

            {/* Preview Area */}
            <div className="border rounded-lg p-6 bg-white shadow-inner">
                {/* Letterhead Preview */}
                <div className="text-center border-b-2 border-double border-gray-800 pb-3 mb-5">
                    <h1 className="text-base font-extrabold tracking-widest uppercase">{hospitalInfo.name}</h1>
                    <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {hospitalInfo.address}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                        <Phone className="h-3 w-3" /> {hospitalInfo.phone}
                    </p>
                    <p className="text-[9px] italic text-gray-400 mt-1">"{hospitalInfo.tagline}"</p>
                </div>

                <h2 className="text-center text-sm font-bold uppercase tracking-wider mb-1">{title}</h2>
                <p className="text-center text-[10px] text-gray-500 mb-5 flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {startDate && endDate
                        ? `${formatPrintDate(startDate)} s/d ${formatPrintDate(endDate)}`
                        : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </p>

                {/* Printable content */}
                <div ref={printRef}>
                    {children}
                </div>
            </div>
        </div>
    );
};
