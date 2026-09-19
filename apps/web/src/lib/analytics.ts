// Shared, honest analytics computations derived from existing orders/order_items/products
// data. No new tables — everything here is a pure function over rows the caller fetched.

export const REVENUE_STATUSES = ["paid", "processing", "completed"] as const;
export const LOW_STOCK_THRESHOLD = 5;

type OrderLike = { id: string; status: string; total: number; created_at: string };
type ItemLike = { product_id: string | null; name: string; unit_price: number; quantity: number };
type ProductCost = { id: string; cost_price: number };

function isRevenueStatus(status: string): boolean {
  return (REVENUE_STATUSES as readonly string[]).includes(status);
}

export function splitOrders(orders: OrderLike[]) {
  const fulfilled = orders.filter((o) => isRevenueStatus(o.status));
  const totalRevenue = fulfilled.reduce((sum, o) => sum + Number(o.total), 0);
  const paidCount = fulfilled.length;
  const totalOrders = orders.length;
  const unpaidCount = totalOrders - paidCount;
  return { fulfilled, totalRevenue, paidCount, unpaidCount, totalOrders };
}

export function pendingPaymentsTotal(orders: OrderLike[]) {
  return orders
    .filter((o) => o.status === "draft" || o.status === "pending_payment")
    .reduce((sum, o) => sum + Number(o.total), 0);
}

// Sums (unit_price - cost_price) * quantity for fulfilled-order items. Items whose
// product was deleted (product_id null, or id no longer in `products`) can't have their
// cost priced in, so they're skipped and counted so the caller can flag the estimate
// as approximate.
export function estimateGrossProfit(items: ItemLike[], products: ProductCost[]) {
  const costById = new Map(products.map((p) => [p.id, Number(p.cost_price)]));
  let profit = 0;
  let skipped = 0;
  for (const item of items) {
    const cost = item.product_id ? costById.get(item.product_id) : undefined;
    if (cost === undefined) {
      skipped++;
      continue;
    }
    profit += (Number(item.unit_price) - cost) * Number(item.quantity);
  }
  return { profit, skipped };
}

export type ExpenseLike = { category: string; amount: number };

export function summarizeExpenses(expenses: ExpenseLike[]) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const byCategory = new Map<string, number>();
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + Number(e.amount));
  }
  return {
    total,
    byCategory: [...byCategory.entries()]
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total),
  };
}

export function topProductsByQuantity(items: ItemLike[], limit = 5) {
  const byName = new Map<string, number>();
  for (const item of items) {
    byName.set(item.name, (byName.get(item.name) ?? 0) + Number(item.quantity));
  }
  return [...byName.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export type DailySalesBucket = { date: string; label: string; total: number };

// Buckets fulfilled-order totals by UTC calendar day for the last `days` days
// (including today). Days with no sales are real zeros, not omitted.
export function getDailySales(orders: OrderLike[], days: number): DailySalesBucket[] {
  const now = new Date();
  const buckets: DailySalesBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GH", { day: "numeric", month: "short", timeZone: "UTC" }),
      total: 0,
    });
  }

  const byDate = new Map(buckets.map((b) => [b.date, b]));
  for (const order of orders) {
    if (!isRevenueStatus(order.status)) continue;
    const bucket = byDate.get(order.created_at.slice(0, 10));
    if (bucket) bucket.total += Number(order.total);
  }

  return buckets;
}
