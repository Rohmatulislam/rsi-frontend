import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { MobileBottomNav } from "~/components/shared/MobileBottomNav";
import { ChatBot } from "~/components/shared/ChatBot";
import "../globals.css";
import { Toaster } from "sonner";
import Providers from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "~/i18n";

export const runtime = 'edge';

export const metadata: Metadata = {
  // ... existing metadata
  metadataBase: new URL("https://rsisitihajarmataram.com"), // Placeholder domain
  title: {
    default: "RSI Siti Hajar Mataram - Pelayanan Kesehatan Islami",
    template: "%s | RSI Siti Hajar Mataram"
  },
  description: "Rumah Sakit Islam Siti Hajar Mataram - Memberikan pelayanan kesehatan terbaik dengan nilai-nilai Islami untuk masyarakat Mataram dan NTB.",
  keywords: ["RSI Siti Hajar", "RS Islam Mataram", "Rumah Sakit Mataram", "Layanan Kesehatan Islami", "Dokter Mataram"],
  authors: [{ name: "RSI Siti Hajar Mataram" }],
  creator: "RSI Siti Hajar Mataram",
  publisher: "RSI Siti Hajar Mataram",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rsisitihajarmataram.com",
    siteName: "RSI Siti Hajar Mataram",
    title: "RSI Siti Hajar Mataram - Pelayanan Kesehatan Islami",
    description: "Rumah Sakit Islam Siti Hajar Mataram memberikan pelayanan terbaik dengan nilai syariah.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "RSI Siti Hajar Mataram",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RSI Siti Hajar Mataram",
    description: "Rumah Sakit Islam Siti Hajar Mataram - Pelayanan Kesehatan Islami",
    images: ["/logo.png"],
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});


export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hospital",
              "name": "RSI Siti Hajar Mataram",
              "image": "https://rsisitihajarmataram.com/logo.png",
              "@id": "",
              "url": "https://rsisitihajarmataram.com",
              "telephone": "087865733233",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jalan Catur Warga No. 10 B, Pajang, Kecamatan Mataram",
                "addressLocality": "Mataram",
                "postalCode": "83126",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -8.5833,
                "longitude": 116.1167
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            })
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <ChatBot />
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
