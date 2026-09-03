"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/src/lib/validators/admin.schema";

export default function AdminForm({
  action,
  children,
  className,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={className} data-pending={pending}>
      {state?.error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
          {state.error}
        </div>
      )}
      {children}
    </form>
  );
}
