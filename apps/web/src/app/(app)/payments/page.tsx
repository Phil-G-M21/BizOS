import { requireBusiness } from "@/lib/business";
import { RecordPayment } from "./record-payment";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

// PostgREST embeds a to-one relation as a single object, but without generated
// Supabase types the client can't confirm that shape at compile time — handle
// either an object or an array defensively.
function customerName(customers: unknown): string {
  if (!customers) return "Walk-in customer";
  const row = Array.isArray(customers) ? customers[0] : customers;
  return (row as { name?: string } | undefined)?.name ?? "Walk-in customer";
}

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  "Partly paid": "bg-amber-100 text-amber-700",
  Unpaid: "bg-slate-100 text-slate-700",
};

export default async function PaymentsPage() {
  const { supabase, business } = await requireBusiness();

  const [{ data: orders }, { data: payments }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, total, created_at, customers(name)")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("id, order_id, amount, method, note, created_at")
      .eq("business_id", business.id)
      .order("created_at", { ascending: true }),
  ]);

  const orderRows = orders ?? [];
  const paymentRows = payments ?? [];

  const paymentsByOrder = new Map<string, typeof paymentRows>();
  for (const payment of paymentRows) {
    const list = paymentsByOrder.get(payment.order_id) ?? [];
    list.push(payment);
    paymentsByOrder.set(payment.order_id, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-500">Payments</div>
        <h1 className="text-3xl font-bold text-slate-900">Payment records</h1>
      </div>

      {orderRows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No orders yet. Once you create orders, you can record payments against them here.
        </p>
      ) : (
        <div className="space-y-4">
          {orderRows.map((order) => {
            const history = paymentsByOrder.get(order.id) ?? [];
            const paidSoFar = history.reduce((sum, p) => sum + Number(p.amount), 0);
            const total = Number(order.total);
            const balanceDue = Math.max(0, total - paidSoFar);
            const badge = paidSoFar >= total && total > 0 ? "Paid" : paidSoFar > 0 ? "Partly paid" : "Unpaid";

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {customerName(order.customers)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[badge]}`}
                  >
                    {badge}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 border-y border-slate-100 py-3 sm:grid-cols-3 sm:gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="mt-1 font-semibold text-slate-900">{cedis(total)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Paid</div>
                    <div className="mt-1 font-semibold text-emerald-700">{cedis(paidSoFar)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Balance due</div>
                    <div className="mt-1 font-semibold text-slate-900">{cedis(balanceDue)}</div>
                  </div>
                </div>

                <RecordPayment orderId={order.id} businessId={business.id} history={history} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
