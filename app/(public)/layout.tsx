import { TooltipProvider } from "@/src/components/ui/tooltip";
import { NavbarMenu } from "@/src/components/shared/Navbar-menu";
import { Footer } from "@/src/components/shared/Footer";
import WhatsAppFloat from "@/src/components/shared/WhatsAppFloat";
import QuoteWidget from "@/src/components/shared/QuoteWidget";

export const dynamic = "force-dynamic";
export const revalidate = 60; // pages re-générées toutes les 60 s max

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <TooltipProvider>
    <>
      <NavbarMenu />
      <main className="flex-1 flex flex-col min-h-screen">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <QuoteWidget />
    </>
    // </TooltipProvider>
  );
}
