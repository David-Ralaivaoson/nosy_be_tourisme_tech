import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nosy Be Guide | Découvrez Hell Ville & ses Îles - Madagascar",
  description:
    "Guide touristique complet de Nosy Be Hell Ville. Plages, excursions, hébergements et activités. Vivez l'île aux parfums avec des guides locaux experts.",
  keywords:
    "Nosy Be, Hell Ville, Madagascar, guide touristique, plages, excursions, plongée, Nosy Komba, Nosy Tanikely",
  authors: [{ name: "Nosy Be Guide" }],
  openGraph: {
    title: "Nosy Be Guide | Hell Ville - L'île aux parfums",
    description:
      "Explorez les trésors cachés de Nosy Be. Plages paradisiaques, réserves naturelles et expériences authentiques.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
