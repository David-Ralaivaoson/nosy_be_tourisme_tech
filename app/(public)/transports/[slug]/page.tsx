import { notFound } from "next/navigation";
import { transportsService } from "@/src/server/modules";
import TransportDetailsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const transport = await transportsService.getTransportBySlug(slug);

  if (!transport) {
    return { title: "Transport introuvable" };
  }

  return {
    title: `${transport.name} — Transport Sainte-Marie`,
    description: transport.descriptionFr,
  };
}

export default async function TransportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const transport = await transportsService.getTransportBySlug(slug);

  if (!transport) {
    notFound();
  }

  return <TransportDetailsClient transport={transport} />;
}
