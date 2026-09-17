"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "Advertising",
  "Packaging",
  "Transport",
  "Rent",
  "Utilities",
  "Staff",
  "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

export default function NewExpensePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [spentOn, setSpentOn] = useState(today());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1);
    const business = businesses?.[0];
    if (!business) {
      router.push("/onboarding");
      return;
    }

    const { error } = await supabase.from("expenses").insert({
      business_id: business.id,
      title,
      category,
      amount: Number(amount) || 0,
      spent_on: spentOn,
      note: note.trim() || null,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/expenses");
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Expenses</div>
        <h1 className="text-2xl font-bold text-slate-900">Add an expense</h1>
        <p className="mt-1 text-sm text-slate-500">Keep track of what it costs to run the shop.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className={label}>
            Title
            <input
              className={field}
              placeholder="e.g. Facebook ads"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={label}>
              Category
              <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              Amount
              <input
                className={field}
                placeholder="0.00"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
          </div>

          <label className={label}>
            Date
            <input
              className={field}
              type="date"
              value={spentOn}
              onChange={(e) => setSpentOn(e.target.value)}
            />
          </label>

          <label className={label}>
            Note
            <textarea
              className={`${field} min-h-24`}
              placeholder="Optional"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/expenses")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading || !title || !spentOn}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
