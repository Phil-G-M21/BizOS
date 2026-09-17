"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Customer = { id: string; name: string };
type Product = { id: string; name: string; selling_price: number };
type Line = {
  key: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

const cedis = (n: number) => "GH₵" + n.toLocaleString();

const field =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const label = "block text-sm font-medium text-slate-700";

function newLine(): Line {
  return { key: crypto.randomUUID(), productId: "", name: "", unitPrice: 0, quantity: 1 };
}

export default function NewOrderPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [lines, setLines] = useState<Line[]>([newLine()]);

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

      const [{ data: customersData }, { data: productsData }] = await Promise.all([
        supabase
          .from("customers")
          .select("id, name")
          .eq("business_id", business.id)
          .order("name", { ascending: true }),
        supabase
          .from("products")
          .select("id, name, selling_price")
          .eq("business_id", business.id)
          .order("name", { ascending: true }),
      ]);

      setCustomers(customersData ?? []);
      setProducts(productsData ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addLine() {
    setLines((current) => [...current, newLine()]);
  }

  function removeLine(key: string) {
    setLines((current) => (current.length > 1 ? current.filter((l) => l.key !== key) : current));
  }

  function setLineProduct(key: string, productId: string) {
    const product = products.find((p) => p.id === productId);
    setLines((current) =>
      current.map((l) =>
        l.key === key
          ? {
              ...l,
              productId,
              name: product?.name ?? "",
              unitPrice: product?.selling_price ?? 0,
            }
          : l
      )
    );
  }

  function setLineQuantity(key: string, quantity: number) {
    setLines((current) =>
      current.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, quantity) } : l))
    );
  }

  const itemsTotal = useMemo(
    () => lines.reduce((sum, l) => (l.productId ? sum + l.unitPrice * l.quantity : sum), 0),
    [lines]
  );
  const deliveryFeeNumber = Number(deliveryFee) || 0;
  const orderTotal = itemsTotal + deliveryFeeNumber;

  async function save() {
    const validLines = lines.filter((l) => l.productId);
    if (validLines.length === 0) {
      setError("Add at least one product line.");
      return;
    }
    if (!businessId) return;

    setSaving(true);
    setError(null);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        business_id: businessId,
        customer_id: customerId || null,
        status: "draft",
        delivery_fee: deliveryFeeNumber,
        total: orderTotal,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setSaving(false);
      setError(orderError?.message ?? "Could not create the order.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      validLines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        name: l.name,
        unit_price: l.unitPrice,
        quantity: l.quantity,
      }))
    );

    setSaving(false);
    if (itemsError) {
      setError(
        `Order #${order.id.slice(0, 8).toUpperCase()} was created but its items failed to save (${itemsError.message}). You can delete it from the orders list and try again.`
      );
      return;
    }

    router.push("/orders");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Orders</div>
        <h1 className="text-2xl font-bold text-slate-900">Create an order</h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a customer, add products, and set a delivery fee. The total is calculated as you go.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className={label}>
            Customer
            <select
              className={field}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Walk-in / no customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className={label}>Items</div>
            <div className="mt-1.5 space-y-3">
              {lines.map((line) => (
                <div
                  key={line.key}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-end"
                >
                  <label className="flex-1 text-sm font-medium text-slate-700">
                    Product
                    <select
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      value={line.productId}
                      onChange={(e) => setLineProduct(line.key, e.target.value)}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {cedis(p.selling_price)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="w-full text-sm font-medium text-slate-700 sm:w-24">
                    Qty
                    <input
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) => setLineQuantity(line.key, Number(e.target.value) || 1)}
                    />
                  </label>

                  <div className="w-full text-sm text-slate-600 sm:w-28">
                    <div className="text-xs text-slate-400">Subtotal</div>
                    <div className="mt-1.5 py-2.5 font-semibold text-slate-900">
                      {cedis(line.unitPrice * line.quantity)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    disabled={lines.length === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 sm:self-end"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLine}
              className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              + Add item
            </button>
          </div>

          <label className={label}>
            Delivery fee
            <input
              className={field}
              placeholder="0.00"
              inputMode="numeric"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />
          </label>

          <div className="flex items-center justify-between rounded-lg bg-teal-50 px-4 py-3">
            <span className="text-sm font-medium text-teal-800">Order total</span>
            <strong className="text-lg text-teal-900">{cedis(orderTotal)}</strong>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/orders")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save order"}
          </button>
        </div>
      </div>
    </div>
  );
}
