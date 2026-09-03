import { Suspense } from "react";
import { transportsService } from "@/src/server/modules";
import TransportsClient from "./client";

export const metadata = {
  title: "Transports & Transferts — Sainte-Marie Madagascar",
  description:
    "Transferts aéroport et port, location de 4x4 avec chauffeur, quads, scooters et tuk-tuk à Sainte-Marie. Réservez vos transports dans votre devis.",
};

export default async function TransportsPage() {
  const transports = await transportsService.getTransports();
  return (
    <Suspense fallback={<div className="p-20 text-center">Chargement...</div>}>
      <TransportsClient initialTransports={transports} />
    </Suspense>
  );
}
