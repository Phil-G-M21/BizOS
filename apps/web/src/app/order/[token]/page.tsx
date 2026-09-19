import { BriefcaseBusiness } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending_payment: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function PublicOrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // Deliberately restricted to the public views only — never the base
  // orders/order_items/businesses/customers tables. These views are the
  // security boundary for this anonymous, unauthenticated page.
  const { data: order, error } = await supabase
    .from("public_order")
    .select(
      "public_token, status, total, delivery_fee, created_at, business_name, business_whatsapp, customer_name"
    )
    .eq("public_token", token)
    .single();

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            This order link isn&apos;t valid, or the order is no longer available.
          </p>
        </div>
      </main>
    );
  }

  const { data: items } = await supabase
    .from("public_order_items")
    .select("name, unit_price, quantity")
    .eq("public_token", token);

  const rows = items ?? [];
  const subtotal = rows.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);

  return (
    <main className="min-h-screen bg-[#f7f5f0] pb-16">
      <header className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 shadow-sm shadow-teal-900/20">
            <BriefcaseBusiness className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-slate-900">{order.business_name}</h1>
            <div className="text-sm text-slate-500">
              Order #{order.public_token.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-500">
              {order.customer_name || "Order"} · {formatDate(order.created_at)}
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
            {rows.length === 0 ? (
              <p className="py-4 text-sm text-slate-500">No items on this order.</p>
            ) : (
              rows.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.quantity} × {cedis(item.unit_price)}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-slate-900">
                    {cedis(Number(item.unit_price) * Number(item.quantity))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{cedis(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery fee</span>
              <span>{cedis(order.delivery_fee)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{cedis(order.total)}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          This is a view-only order summary. Contact {order.business_name} with any questions.
        </p>
      </div>
    </main>
  );
}
