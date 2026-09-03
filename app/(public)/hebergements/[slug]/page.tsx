import { notFound } from "next/navigation";
import { accommodationsService } from "@/src/server/modules";
import AccommodationDetailsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const accommodation =
    await accommodationsService.getAccommodationBySlug(slug);

  if (!accommodation) {
    return { title: "Hébergement introuvable" };
  }

  return {
    title: `${accommodation.name} — Hébergement Sainte-Marie`,
    description: accommodation.descriptionFr,
  };
}

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const accommodation =
    await accommodationsService.getAccommodationBySlug(slug);

  if (!accommodation) {
    notFound();
  }

  return <AccommodationDetailsClient accommodation={accommodation} />;
}
