import Link from "next/link";
import { requireBusiness } from "@/lib/business";
import { OrderStatusSelect } from "./order-status-select";
import { DeleteButton } from "./delete-button";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// PostgREST embeds a to-one relation as a single object, but without generated
// Supabase types the client can't confirm that shape at compile time — handle
// either an object or an array defensively.
function customerName(customers: unknown): string {
  if (!customers) return "Walk-in customer";
  const row = Array.isArray(customers) ? customers[0] : customers;
  return (row as { name?: string } | undefined)?.name ?? "Walk-in customer";
}

export default async function OrdersPage() {
  const { supabase, business } = await requireBusiness();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at, customers(name)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const rows = orders ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Orders</div>
          <h1 className="text-3xl font-bold text-slate-900">Order flow</h1>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex w-fit items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
        >
          + Create Order
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No orders yet. Click Create Order to add your first one.
        </p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Order</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Customer</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Amount</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{customerName(order.customers)}</td>
                      <td className="px-4 py-3 text-slate-900">{cedis(order.total)}</td>
                      <td className="px-4 py-3">
                        <OrderStatusSelect id={order.id} status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <DeleteButton id={order.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="mt-1 truncate font-medium text-slate-900">
                      {customerName(order.customers)}
                    </div>
                  </div>
                  <div className="shrink-0 font-semibold text-slate-900">
                    {cedis(order.total)}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <OrderStatusSelect id={order.id} status={order.status} />
                  <span className="text-xs text-slate-500">{formatDate(order.created_at)}</span>
                </div>
                <div className="mt-3 flex justify-end">
                  <DeleteButton id={order.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
