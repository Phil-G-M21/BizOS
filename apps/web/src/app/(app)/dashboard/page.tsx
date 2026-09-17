import { requireBusiness } from "@/lib/business";

const LOW_STOCK_THRESHOLD = 5;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

const cedis = (n: number) => "GH₵" + n.toLocaleString();

export default async function DashboardPage() {
  const { supabase, business } = await requireBusiness();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, selling_price, cost_price, stock_quantity")
    .eq("business_id", business.id);

  const rows = products ?? [];
  const count = rows.length;
  const costValue = rows.reduce(
    (s, p) => s + Number(p.cost_price) * Number(p.stock_quantity),
    0
  );
  const retailValue = rows.reduce(
    (s, p) => s + Number(p.selling_price) * Number(p.stock_quantity),
    0
  );
  const lowStockItems = rows.filter((p) => p.stock_quantity <= LOW_STOCK_THRESHOLD);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-500">Dashboard</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          A clear view of your shop.
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={String(count)} />
        <Stat label="Stock value (cost)" value={cedis(costValue)} />
        <Stat label="Stock value (retail)" value={cedis(retailValue)} />
        <Stat label="Low stock items" value={String(lowStockItems.length)} />
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
