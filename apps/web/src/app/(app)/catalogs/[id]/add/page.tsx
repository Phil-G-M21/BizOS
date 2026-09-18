import Link from "next/link";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { cedis } from "../../../products/product-shared";
import { AddButton } from "./add-button";

export default async function AddToCatalogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, business } = await requireBusiness();

  const { data: catalog, error } = await supabase
    .from("catalogs")
    .select("id, name")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (error || !catalog) {
    redirect("/catalogs");
  }

  const [{ data: products }, { data: links }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, selling_price, category")
      .eq("business_id", business.id)
      .order("name", { ascending: true }),
    supabase.from("catalog_products").select("product_id").eq("catalog_id", id),
  ]);

  const addedIds = new Set((links ?? []).map((link) => link.product_id));
  const rows = products ?? [];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/catalogs/${catalog.id}`}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to {catalog.name}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Add products</h1>
        <p className="mt-1 text-sm text-slate-500">Pick products to add to {catalog.name}.</p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products yet. Add products to your business first.
        </p>
      ) : (
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {rows.map((product) => {
            const added = addedIds.has(product.id);
            return (
              <div key={product.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">
                    {product.category} · {cedis(product.selling_price)}
                  </div>
                </div>
                {added ? (
                  <span className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-400">
                    Added
                  </span>
                ) : (
                  <AddButton catalogId={catalog.id} productId={product.id} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
