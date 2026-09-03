import { prisma } from "@/src/server/db/client";

export async function logEmail(params: {
  quoteId?: string;
  to: string;
  subject: string;
  status: "PENDING" | "SENT" | "FAILED";
  provider?: string;
  providerId?: string;
  errorMessage?: string;
}) {
  return prisma.emailLog.create({
    data: {
      quoteId: params.quoteId,
      to: params.to,
      subject: params.subject,
      status: params.status,
      provider: params.provider || "resend",
      providerId: params.providerId,
      errorMessage: params.errorMessage,
      sentAt: params.status === "SENT" ? new Date() : null,
    },
  });
}
