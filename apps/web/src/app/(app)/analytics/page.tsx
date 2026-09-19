import { requireBusiness } from "@/lib/business";
import {
  LOW_STOCK_THRESHOLD,
  estimateGrossProfit,
  getDailySales,
  splitOrders,
  summarizeExpenses,
  topProductsByQuantity,
} from "@/lib/analytics";
import { DailySalesBars } from "../daily-sales-bars";

const cedis = (n: number) => "GH₵" + Math.round(n).toLocaleString();

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

export default async function AnalyticsPage() {
  const { supabase, business } = await requireBusiness();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("business_id", business.id);
  const orderRows = orders ?? [];

  const { data: products } = await supabase
    .from("products")
    .select("id, cost_price, stock_quantity")
    .eq("business_id", business.id);
  const productRows = products ?? [];

  const { fulfilled, totalRevenue, paidCount, unpaidCount, totalOrders } =
    splitOrders(orderRows);

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

  const { profit: grossProfit, skipped } = estimateGrossProfit(items, productRows);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("category, amount")
    .eq("business_id", business.id);
  const { total: totalExpenses, byCategory: expensesByCategory } = summarizeExpenses(
    expenses ?? []
  );
  const netProfit = grossProfit - totalExpenses;

  const topProducts = topProductsByQuantity(items);
  const lowStockCount = productRows.filter(
    (p) => p.stock_quantity <= LOW_STOCK_THRESHOLD
  ).length;
  const dailySales = getDailySales(orderRows, 7);
  const maxTopQuantity = Math.max(...topProducts.map((p) => p.quantity), 0);

  if (totalOrders === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-sm font-medium text-slate-500">Analytics</div>
          <h1 className="text-3xl font-bold text-slate-900">Business performance</h1>
        </div>
        <p className="text-sm text-slate-500">
          No orders yet. Once you record some orders, your revenue, profit, and top products
          will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-500">Analytics</div>
        <h1 className="text-3xl font-bold text-slate-900">Business performance</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Stat label="Total Revenue" value={cedis(totalRevenue)} />
        <Stat
          label="Orders"
          value={String(totalOrders)}
          hint={`${paidCount} paid · ${unpaidCount} unpaid`}
        />
        <Stat label="Low Stock Items" value={String(lowStockCount)} />
        <Stat
          label="Gross profit"
          value={cedis(grossProfit)}
          hint={
            skipped > 0
              ? `Revenue − COGS, approximate — ${skipped} item(s) from deleted products excluded`
              : "Revenue − cost of goods sold"
          }
        />
        <Stat
          label="Net profit"
          value={cedis(netProfit)}
          hint={`After ${cedis(totalExpenses)} in expenses`}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 text-xl font-bold text-slate-900">Expense summary</div>
        <div className="mb-4">
          <div className="text-sm text-slate-500">Total expenses</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{cedis(totalExpenses)}</div>
        </div>
        {expensesByCategory.length === 0 ? (
          <p className="text-sm text-slate-500">No expenses recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {expensesByCategory.map((entry) => (
              <div key={entry.category} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium text-slate-900">{entry.category}</span>
                    <span className="shrink-0 text-slate-500">{cedis(entry.total)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${totalExpenses ? (entry.total / totalExpenses) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-xl font-bold text-slate-900">Sales, last 7 days</div>
          <DailySalesBars data={dailySales} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-xl font-bold text-slate-900">Top products</div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No fulfilled orders with items yet.
            </p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="w-5 shrink-0 text-sm font-semibold text-slate-400">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium text-slate-900">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-slate-500">{product.quantity} sold</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${maxTopQuantity ? (product.quantity / maxTopQuantity) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
