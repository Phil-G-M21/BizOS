"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Fashion", "Beauty", "Electronics", "Food", "Shoes", "Cosmetics", "Home", "Other"];

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [selling, setSelling] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [sku, setSku] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
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

    const { error } = await supabase.from("products").insert({
      business_id: business.id,
      name,
      selling_price: Number(selling) || 0,
      cost_price: Number(cost) || 0,
      stock_quantity: Number(stock) || 0,
      category,
      sku: sku.trim() || null,
      low_stock_threshold: Number(lowStockThreshold) || 5,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/products");
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Products</div>
        <h1 className="text-2xl font-bold text-slate-900">Add a product</h1>
        <p className="mt-1 text-sm text-slate-500">Add a new product to your catalog.</p>
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
            <label className={label}>
              Stock quantity
              <input
                className={field}
                placeholder="0"
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </label>
            <label className={label}>
              Category
              <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={label}>
              SKU <span className="font-normal text-slate-400">(optional)</span>
              <input
                className={field}
                placeholder="e.g. BD-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </label>
            <label className={label}>
              Low stock threshold
              <input
                className={field}
                placeholder="5"
                inputMode="numeric"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
              />
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
            disabled={loading || !name}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
}
