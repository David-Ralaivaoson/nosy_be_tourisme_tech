import { Suspense } from "react";
import { accommodationsService } from "@/src/server/modules";
import HebergementsClient from "./client";

export const metadata = {
  title: "Hébergements Sainte-Marie — Hôtels, Lodges, Villas",
  description:
    "Découvrez les meilleurs hébergements de Sainte-Marie : hôtels, bungalows, écolodges et villas de luxe. Filtrez par zone, budget et équipements.",
};

export default async function HebergementsPage() {
  const accommodations = await accommodationsService.getAccommodations();

  return (
    <Suspense fallback={<div className="p-20 text-center">Chargement...</div>}>
      <HebergementsClient initialAccommodations={accommodations} />
    </Suspense>
  );
}
