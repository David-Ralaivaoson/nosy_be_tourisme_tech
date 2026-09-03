import {
  accommodationsService,
  additionalServicesService,
  excursionsService,
  transportsService,
} from "@/src/server/modules";
import DevisClient from "./client";

export const metadata = {
  title: "Mon Devis — Voyage Sainte-Marie Madagascar",
  description:
    "Composez votre voyage à Sainte-Marie : hébergement, excursions, transports. Recevez votre devis détaillé instantanément par email.",
};

export default async function DevisPage() {
  const [accommodations, excursions, transports] = await Promise.all([
    accommodationsService.getAccommodations(),
    excursionsService.getExcursions(),
    transportsService.getTransports(),
  ]);

  const services = await additionalServicesService.getAdditionalServices();

  return (
    <DevisClient
      accommodations={accommodations}
      excursions={excursions}
      transports={transports}
      services={services}
    />
  );
}
