"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as bcrypt from "bcryptjs";
import type { QuoteStatus } from "@prisma/client";
import { prisma } from "@/src/server/db/client";
import {
  createSession,
  clearSession,
  verifySession,
} from "@/src/server/auth/session";
import {
  adminAccommodationSchema,
  adminExcursionSchema,
  adminTransportSchema,
  type ActionResult,
} from "@/src/lib/validators/admin.schema";

async function requireAdmin() {
  const s = await verifySession();
  if (!s) redirect("/admin/login");
  return s;
}

// ─── AUTH ────────────────────────────────────────────────────
export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    return { ok: false, error: "Compte introuvable ou désactivé." };
  }
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return { ok: false, error: "Mot de passe incorrect." };

  await createSession(admin.id, admin.role);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

// ─── DEVIS ───────────────────────────────────────────────────
export async function updateQuoteStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as QuoteStatus;
  await prisma.quote.update({ where: { id }, data: { status } });
  revalidatePath("/admin/devis");
  revalidatePath("/admin");
}

// ─── HÉBERGEMENTS ────────────────────────────────────────────
export async function saveAccommodationAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = adminAccommodationSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }
  const d = parsed.data;
  const data = {
    name: d.name,
    slug: d.slug,
    category: d.category,
    zone: d.zone,
    descriptionFr: d.descriptionFr,
    pricePerNightLowSeason: d.pricePerNightLowSeason,
    pricePerNightHighSeason: d.pricePerNightHighSeason,
    capacity: d.capacity,
    stars: d.stars,
    amenities: d.amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  if (d.id) {
    await prisma.accommodation.update({ where: { id: d.id }, data });
  } else {
    await prisma.accommodation.create({ data });
  }
  revalidatePath("/admin/hebergements");
  revalidatePath("/admin");
  redirect("/admin/hebergements");
}

export async function toggleAccommodationActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const acc = await prisma.accommodation.findUnique({ where: { id } });
  if (acc) {
    await prisma.accommodation.update({
      where: { id },
      data: { isActive: !acc.isActive },
    });
  }
  revalidatePath("/admin/hebergements");
}

export async function deleteAccommodationAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.accommodation.delete({ where: { id } });
  revalidatePath("/admin/hebergements");
  revalidatePath("/admin");
}

// ─── EXCURSIONS ──────────────────────────────────────────────
export async function saveExcursionAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = adminExcursionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }
  const d = parsed.data;
  const data = {
    name: d.name,
    slug: d.slug,
    descriptionFr: d.descriptionFr,
    pricePerPerson: d.pricePerPerson,
    duration: d.duration,
    includesLunch: formData.get("includesLunch") === "on",
    includesTransfer: formData.get("includesTransfer") === "on",
  };

  if (d.id) {
    await prisma.excursion.update({ where: { id: d.id }, data });
  } else {
    await prisma.excursion.create({ data });
  }
  revalidatePath("/admin/excursions");
  revalidatePath("/admin");
  redirect("/admin/excursions");
}

export async function deleteExcursionAction(formData: FormData) {
  await requireAdmin();
  await prisma.excursion.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/excursions");
  revalidatePath("/admin");
}

// ─── TRANSPORTS ──────────────────────────────────────────────
export async function saveTransportAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = adminTransportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }
  const d = parsed.data;
  const data = {
    name: d.name,
    slug: d.slug,
    transportType: d.transportType,
    price: d.price,
    unit: d.unit,
    capacity: d.capacity,
    descriptionFr: d.descriptionFr,
    withDriver: formData.get("withDriver") === "on",
  };

  if (d.id) {
    await prisma.transportOption.update({ where: { id: d.id }, data });
  } else {
    await prisma.transportOption.create({ data });
  }
  revalidatePath("/admin/transports");
  revalidatePath("/admin");
  redirect("/admin/transports");
}

export async function deleteTransportAction(formData: FormData) {
  await requireAdmin();
  await prisma.transportOption.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidatePath("/admin/transports");
  revalidatePath("/admin");
}
