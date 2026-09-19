import Link from "next/link";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { splitOrders } from "@/lib/analytics";
import { DeleteButton } from "../delete-button";

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  processing: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  pending_payment: "bg-amber-100 text-amber-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, business } = await requireBusiness();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, name, phone, email, address, notes")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (error || !customer) {
    redirect("/customers");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("customer_id", id)
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });
  const orderRows = orders ?? [];

  const { fulfilled, totalRevenue } = splitOrders(orderRows);
  const orderCount = fulfilled.length;
  const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : null;
  const lastPurchase = fulfilled[0]?.created_at ?? null;

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/customers"
        className="text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        ← Back to customers
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d97757] text-xl font-bold text-white">
            {customer.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-900">{customer.name}</h1>
            <div className="truncate text-sm text-slate-500">
              {customer.phone || "No phone number"}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-1.5 border-t border-slate-100 pt-5 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <span className="text-slate-400">Email: </span>
            {customer.email || "—"}
          </div>
          <div>
            <span className="text-slate-400">Address: </span>
            {customer.address || "—"}
          </div>
        </div>
        {customer.notes && (
          <div className="mt-3 text-sm text-slate-500">
            <span className="text-slate-400">Notes: </span>
            {customer.notes}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Link
            href={`/customers/${customer.id}/edit`}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <DeleteButton id={customer.id} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total spent" value={cedis(totalRevenue)} />
        <Stat label="Orders" value={String(orderCount)} />
        <Stat
          label="Average order value"
          value={avgOrderValue === null ? "—" : cedis(avgOrderValue)}
        />
        <Stat
          label="Last purchase"
          value={lastPurchase ? formatDate(lastPurchase) : "No purchases yet"}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 text-xl font-bold text-slate-900">Order history</div>
        {orderRows.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orderRows.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-500">{formatDate(order.created_at)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {cedis(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
