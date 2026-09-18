"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const field =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const label = "block text-sm font-medium text-slate-700";

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus(null);

    const { error } = await supabase.auth.updateUser({ email });

    setSaving(false);
    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }
    setStatus({
      type: "success",
      message:
        "Request submitted. Check the new address (and possibly your current one) for a confirmation link before the change takes effect.",
    });
    setEmail("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Change email</h2>
      <p className="mt-1 text-sm text-slate-500">Current email: {currentEmail}</p>

      <div className="mt-4 space-y-4">
        <label className={label}>
          New email
          <input
            className={field}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {status && (
          <p className={`text-sm ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving || !email}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update email"}
        </button>
      </div>
    </div>
  );
}
