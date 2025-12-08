import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "~/components/layout/Navbar";
import "./globals.css";
import {Toaster} from "sonner";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Rsi Frontend",
  description: "Rsi Frontend",
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
    <html lang="en">
      <Providers>
      <body className={`${plusJakartaSans.variable} font-sans antialiased pb-20`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
      </Providers>
    </html>
  );
}
