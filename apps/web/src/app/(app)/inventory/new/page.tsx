"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Product = { id: string; name: string; stock_quantity: number };
type MovementType = "restock" | "return" | "adjustment";

const field =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const label = "block text-sm font-medium text-slate-700";

export default function NewInventoryMovementPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState("");
  const [type, setType] = useState<MovementType>("restock");
  const [direction, setDirection] = useState<"increase" | "decrease">("increase");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

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
      setBusinessId(business.id);

      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .eq("business_id", business.id)
        .order("name", { ascending: true });

      setProducts(productsData ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    const qty = Number(quantity);
    if (!productId) {
      setError("Choose a product.");
      return;
    }
    if (!qty || qty <= 0) {
      setError("Enter a quantity greater than 0.");
      return;
    }
    if (!businessId) return;

    const change = type === "adjustment" && direction === "decrease" ? -qty : qty;

    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("inventory_transactions").insert({
      business_id: businessId,
      product_id: productId,
      order_id: null,
      type,
      change,
      note: note.trim() || null,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/inventory");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Inventory</div>
        <h1 className="text-2xl font-bold text-slate-900">Stock adjustment</h1>
        <p className="mt-1 text-sm text-slate-500">Record stock received, sold, or corrected.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className={label}>
            Product
            <select
              className={field}
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.stock_quantity} in stock
                </option>
              ))}
            </select>
          </label>

          <label className={label}>
            Type
            <select
              className={field}
              value={type}
              onChange={(e) => setType(e.target.value as MovementType)}
            >
              <option value="restock">Restock (adds stock)</option>
              <option value="return">Return (adds stock)</option>
              <option value="adjustment">Adjustment (correct the count)</option>
            </select>
          </label>

          {type === "adjustment" && (
            <label className={label}>
              Direction
              <select
                className={field}
                value={direction}
                onChange={(e) => setDirection(e.target.value as "increase" | "decrease")}
              >
                <option value="increase">Increase stock</option>
                <option value="decrease">Decrease stock</option>
              </select>
            </label>
          )}

          <label className={label}>
            Quantity
            <input
              className={field}
              placeholder="0"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

          <label className={label}>
            Note
            <textarea
              className={`${field} min-h-24`}
              placeholder="Optional — why this movement happened"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/inventory")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save adjustment"}
          </button>
        </div>
      </div>
    </div>
  );
}
