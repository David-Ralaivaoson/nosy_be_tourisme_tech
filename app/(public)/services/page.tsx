import { additionalServicesService } from "@/src/server/modules";
import ServicesClient from "./client";

export const metadata = {
  title: "Services+ — Sainte-Marie Madagascar",
  description:
    "Services premium pour votre voyage : assurance voyage, guide privé, photographe, transferts VIP, location matériel.",
};

export default async function ServicesPage() {
  const services = await additionalServicesService.getAdditionalServices();
  return <ServicesClient initialServices={services} />;
}
