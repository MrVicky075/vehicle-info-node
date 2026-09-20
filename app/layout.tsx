import type { Metadata } from "next";
import { Source_Sans_3, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vehicle Information",
  description: "Residential Vehicle Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${ibmPlex.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
