import { excursionsService } from "@/src/server/modules";
import ExcursionsClient from "./client";

export const metadata = {
  title: "Excursions & Expériences — Sainte-Marie Madagascar",
  description:
    "Safari baleines à bosse, Baie d'Ampanihy, Île aux Nattes, piscines naturelles, plongée. Réservez vos excursions à Sainte-Marie et composez votre devis instantané.",
};

export default async function ExcursionsPage() {
  const excursions = await excursionsService.getExcursions();
  return <ExcursionsClient initialExcursions={excursions} />;
}
