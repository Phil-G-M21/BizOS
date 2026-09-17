"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Payment = {
  id: string;
  amount: number;
  method: string;
  note: string | null;
  created_at: string;
};

type Method = "cash" | "momo" | "bank" | "other";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const field =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export function RecordPayment({
  orderId,
  businessId,
  history,
}: {
  orderId: string;
  businessId: string;
  history: Payment[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("cash");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("payments").insert({
      business_id: businessId,
      order_id: orderId,
      amount: amt,
      method,
      note: note.trim() || null,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setAmount("");
    setNote("");
    router.refresh();
  }

  async function del(id: string) {
    if (!confirm("Delete this payment?")) return;
    await supabase.from("payments").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        {open ? "Close" : "Record payment"}
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {history.length > 0 && (
            <div className="mb-4 space-y-2">
              {history.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    {cedis(p.amount)} &middot; {p.method}
                    {p.note ? ` — ${p.note}` : ""}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{formatDate(p.created_at)}</span>
                    <button
                      type="button"
                      onClick={() => del(p.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1.5fr_auto]">
            <input
              className={field}
              placeholder="Amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className={field}
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
            >
              <option value="cash">Cash</option>
              <option value="momo">MoMo</option>
              <option value="bank">Bank</option>
              <option value="other">Other</option>
            </select>
            <input
              className={field}
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
