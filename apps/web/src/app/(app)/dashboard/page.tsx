import { requireBusiness } from "@/lib/business";
import {
  LOW_STOCK_THRESHOLD,
  estimateGrossProfit,
  getDailySales,
  pendingPaymentsTotal,
  splitOrders,
} from "@/lib/analytics";
import { DailySalesBars } from "../daily-sales-bars";
import { CurrentDateTime } from "./current-datetime";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

const cedis = (n: number) => "GH₵" + Math.round(n).toLocaleString();

export default async function DashboardPage() {
  const { supabase, business } = await requireBusiness();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, selling_price, cost_price, stock_quantity")
    .eq("business_id", business.id);
  const productRows = products ?? [];

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("business_id", business.id);
  const orderRows = orders ?? [];

  const count = productRows.length;
  const costValue = productRows.reduce(
    (s, p) => s + Number(p.cost_price) * Number(p.stock_quantity),
    0
  );
  const retailValue = productRows.reduce(
    (s, p) => s + Number(p.selling_price) * Number(p.stock_quantity),
    0
  );
  const lowStockItems = productRows.filter((p) => p.stock_quantity <= LOW_STOCK_THRESHOLD);

  const { fulfilled, totalRevenue, paidCount, unpaidCount, totalOrders } =
    splitOrders(orderRows);
  const pendingPayments = pendingPaymentsTotal(orderRows);

  const fulfilledIds = fulfilled.map((o) => o.id);
  let items: { product_id: string | null; name: string; unit_price: number; quantity: number }[] =
    [];
  if (fulfilledIds.length > 0) {
    const { data: itemRows } = await supabase
      .from("order_items")
      .select("product_id, name, unit_price, quantity")
      .in("order_id", fulfilledIds);
    items = itemRows ?? [];
  }
  const { profit } = estimateGrossProfit(
    items,
    productRows.map((p) => ({ id: p.id, cost_price: p.cost_price }))
  );

  const dailySales = getDailySales(orderRows, 7);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-500">Dashboard</div>
        <CurrentDateTime />
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          A clear view of your shop.
        </h1>
      </div>

      <div>
        <div className="mb-3 text-sm font-semibold text-slate-500">Sales</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total Revenue" value={cedis(totalRevenue)} />
          <Stat
            label="Orders"
            value={String(totalOrders)}
            hint={`${paidCount} paid · ${unpaidCount} unpaid`}
          />
          <Stat label="Pending Payments" value={cedis(pendingPayments)} />
          <Stat label="Estimated Profit" value={cedis(profit)} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 text-xl font-bold text-slate-900">Sales, last 7 days</div>
        <DailySalesBars data={dailySales} />
      </div>

      <div>
        <div className="mb-3 text-sm font-semibold text-slate-500">Inventory snapshot</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Products" value={String(count)} />
          <Stat label="Stock value (cost)" value={cedis(costValue)} />
          <Stat label="Stock value (retail)" value={cedis(retailValue)} />
          <Stat label="Low stock items" value={String(lowStockItems.length)} />
        </div>
      </div>

      {count === 0 ? (
        <p className="text-sm text-slate-500">
          No products yet. Open Products in the sidebar and add your first one,
          then these numbers fill in automatically.
        </p>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Low stock</div>
          <div className="mt-1 text-xl font-bold text-slate-900">
            Items that need restocking soon
          </div>

          {lowStockItems.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              All products are above the low-stock threshold ({LOW_STOCK_THRESHOLD} units).
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-900">{item.name}</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {item.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
