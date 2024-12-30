import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import GlobalLayout from '@/components/GlobalLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Point Blank Hesap Satış",
  description: "En güvenilir Point Blank hesap alım satım platformu",
  keywords: "point blank, hesap, satış, oyun, pb",
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: "Point Blank Hesap Satış",
    description: "En güvenilir Point Blank hesap alım satım platformu",
    images: ["/background/point-blank-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <GlobalLayout>
            {children}
          </GlobalLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
