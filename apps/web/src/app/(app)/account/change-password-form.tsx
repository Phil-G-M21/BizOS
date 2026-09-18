"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const field =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const label = "block text-sm font-medium text-slate-700";

export function ChangePasswordForm() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }
    setStatus({ type: "success", message: "Password updated." });
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
      <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={label}>
            New password
            <input
              className={field}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className={label}>
            Confirm password
            <input
              className={field}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>

        {status && (
          <p className={`text-sm ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving || !password || !confirmPassword}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
