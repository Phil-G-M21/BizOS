"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCatalogPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
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

    const { data: catalog, error } = await supabase
      .from("catalogs")
      .insert({ business_id: business.id, name })
      .select("id")
      .single();

    setLoading(false);
    if (error || !catalog) {
      setError(error?.message ?? "Could not create catalog.");
      return;
    }
    router.push(`/catalogs/${catalog.id}`);
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Catalogs</div>
        <h1 className="text-2xl font-bold text-slate-900">New catalog</h1>
        <p className="mt-1 text-sm text-slate-500">Group products into a named collection.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className={label}>
            Catalog name
            <input
              className={field}
              placeholder="e.g. Phones"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/catalogs")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading || !name}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save catalog"}
          </button>
        </div>
      </div>
    </div>
  );
}
