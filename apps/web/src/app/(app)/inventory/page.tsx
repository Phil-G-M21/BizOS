import Link from "next/link";
import { requireBusiness } from "@/lib/business";

const LOW_STOCK_THRESHOLD = 5;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const TYPE_STYLES: Record<string, string> = {
  sale: "bg-slate-100 text-slate-700",
  restock: "bg-emerald-100 text-emerald-700",
  adjustment: "bg-amber-100 text-amber-700",
  return: "bg-blue-100 text-blue-700",
};

// PostgREST embeds a to-one relation as a single object, but without generated
// Supabase types the client can't confirm that shape at compile time — handle
// either an object or an array defensively.
function productName(products: unknown): string {
  if (!products) return "—";
  const row = Array.isArray(products) ? products[0] : products;
  return (row as { name?: string } | undefined)?.name ?? "—";
}

export default async function InventoryPage() {
  const { supabase, business } = await requireBusiness();

  const [{ data: products }, { data: transactions }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, stock_quantity")
      .eq("business_id", business.id)
      .order("name", { ascending: true }),
    supabase
      .from("inventory_transactions")
      .select("id, type, change, note, created_at, products(name)")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const rows = products ?? [];
  const movements = transactions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Inventory</div>
          <h1 className="text-3xl font-bold text-slate-900">Stock overview</h1>
        </div>
        <Link
          href="/inventory/new"
          className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Stock adjustment
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products yet. Add products first, then track their stock here.
        </p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Product</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Quantity</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((product) => {
                    const lowStock = product.stock_quantity <= LOW_STOCK_THRESHOLD;
                    return (
                      <tr key={product.id}>
                        <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                        <td className="px-4 py-3 text-slate-600">{product.stock_quantity}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                              lowStock
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {lowStock ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {lowStock ? "Restock soon" : "Available"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((product) => {
              const lowStock = product.stock_quantity <= LOW_STOCK_THRESHOLD;
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 truncate font-medium text-slate-900">
                      {product.name}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                        lowStock
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {lowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                    <span className="text-slate-500">{product.stock_quantity} units</span>
                    <span className="text-slate-500">
                      {lowStock ? "Restock soon" : "Available"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Recent activity</div>
        <div className="mt-1 text-xl font-bold text-slate-900">Stock movements</div>

        {movements.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No stock movements recorded yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="break-words font-medium text-slate-900">
                      {productName(movement.products)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        TYPE_STYLES[movement.type] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {movement.type}
                    </span>
                  </div>
                  {movement.note && (
                    <div className="mt-1 break-words text-sm text-slate-500">{movement.note}</div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold ${
                      movement.change < 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {movement.change > 0 ? `+${movement.change}` : movement.change}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatDate(movement.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
