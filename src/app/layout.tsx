import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "RSI Siti Hajar Mataram",
  description: "Rumah Sakit Islam Siti Hajar Mataram - Pelayanan Kesehatan Islami",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <Providers>
        <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
