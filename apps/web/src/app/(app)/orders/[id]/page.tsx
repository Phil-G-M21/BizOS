import Link from "next/link";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { ShareOrderActions } from "../share-order-actions";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const EDITABLE_STATUSES = ["draft", "pending_payment"];

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending_payment: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

function customerInfo(customers: unknown): { id: string; name: string; phone: string | null } | null {
  if (!customers) return null;
  const row = Array.isArray(customers) ? customers[0] : customers;
  return (row as { id: string; name: string; phone: string | null } | undefined) ?? null;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, business } = await requireBusiness();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, status, total, delivery_fee, created_at, public_token, customers(id, name, phone)"
    )
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (error || !order) {
    redirect("/orders");
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, name, unit_price, quantity")
    .eq("order_id", id);
  const itemRows = items ?? [];

  const customer = customerInfo(order.customers);
  const orderRef = order.id.slice(0, 8).toUpperCase();
  const isEditable = EDITABLE_STATUSES.includes(order.status);
  const subtotal = itemRows.reduce(
    (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
    0
  );

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/orders" className="text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Back to orders
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order #{orderRef}</h1>
            <div className="mt-1 text-sm text-slate-500">{formatDate(order.created_at)}</div>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {order.status.replace("_", " ")}
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          {isEditable ? (
            <Link
              href={`/orders/${order.id}/edit`}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
          ) : (
            <span className="text-xs text-slate-400">
              Paid orders can&apos;t be edited — cancel or refund instead.
            </span>
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <span className="text-slate-400">Customer: </span>
          {customer ? (
            <Link href={`/customers/${customer.id}`} className="font-medium text-teal-700 hover:underline">
              {customer.name}
            </Link>
          ) : (
            "Walk-in customer"
          )}
        </div>

        <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
          {itemRows.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">No items on this order.</p>
          ) : (
            itemRows.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3">
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

        <div className="mt-6 border-t border-slate-100 pt-5">
          <ShareOrderActions
            publicToken={order.public_token}
            orderRef={orderRef}
            businessName={business.name}
          />
        </div>
      </div>
    </div>
  );
}
