import { notFound } from "next/navigation";
import { excursionsService } from "@/src/server/modules";
import ExcursionDetailsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const excursion = await excursionsService.getExcursionBySlug(slug);

  if (!excursion) {
    return { title: "Excursion introuvable" };
  }

  return {
    title: `${excursion.name} — Excursion Sainte-Marie`,
    description: excursion.descriptionFr,
  };
}

export default async function ExcursionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const excursion = await excursionsService.getExcursionBySlug(slug);

  if (!excursion) {
    notFound();
  }

  return <ExcursionDetailsClient excursion={excursion} />;
}
