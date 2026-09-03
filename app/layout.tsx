import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import "@/src/lib/three-config"; // Configure Draco au démarrage

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sainte-Marie Travel | Voyage sur mesure à Madagascar",
  description:
    "Agence locale à Sainte-Marie : safari baleines, Baie d'Ampanihy, Île aux Nattes, hébergements et circuits personnalisés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-screen bg-[#fbfaff] text-[#17123a]">
        {children}
      </body>
    </html>
  );
}
