import Link from "next/link";
import { requireBusiness } from "@/lib/business";
import { ProductGrid } from "./product-grid";

export default async function ProductsPage() {
  const { supabase, business } = await requireBusiness();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, selling_price, cost_price, stock_quantity, category")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const rows = products ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Products</div>
          <h1 className="text-3xl font-bold text-slate-900">All products</h1>
        </div>
        <Link
          href="/products/new"
          className="inline-flex w-fit items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
        >
          + Add Product
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products yet. Click Add Product to create your first one.
        </p>
      ) : (
        <ProductGrid products={rows} />
      )}
    </div>
  );
}
