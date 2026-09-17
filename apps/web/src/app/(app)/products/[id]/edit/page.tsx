"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Fashion", "Beauty", "Electronics", "Food", "Shoes", "Cosmetics", "Home", "Other"];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selling, setSelling] = useState("");
  const [cost, setCost] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
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

      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("id, name, selling_price, cost_price, stock_quantity, category")
        .eq("id", id)
        .eq("business_id", business.id)
        .single();

      if (fetchError || !product) {
        router.push("/products");
        return;
      }

      setName(product.name);
      setSelling(String(product.selling_price));
      setCost(String(product.cost_price));
      setStockQuantity(product.stock_quantity);
      setCategory(product.category ?? CATEGORIES[0]);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save() {
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        selling_price: Number(selling) || 0,
        cost_price: Number(cost) || 0,
        category,
      })
      .eq("id", id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/products");
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "block text-sm font-medium text-slate-700";

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Products</div>
        <h1 className="text-2xl font-bold text-slate-900">Edit product</h1>
        <p className="mt-1 text-sm text-slate-500">Update your product's details.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className={label}>
            Product name
            <input
              className={field}
              placeholder="e.g. Black Dress"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={label}>
              Selling price
              <input
                className={field}
                placeholder="0.00"
                inputMode="numeric"
                value={selling}
                onChange={(e) => setSelling(e.target.value)}
              />
            </label>
            <label className={label}>
              Cost price
              <input
                className={field}
                placeholder="0.00"
                inputMode="numeric"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className={label}>Stock quantity</div>
              <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500">
                {stockQuantity} units
              </div>
              <p className="mt-1 text-xs text-slate-400">Adjust stock from Inventory.</p>
            </div>
            <label className={label}>
              Category
              <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/products")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !name}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
