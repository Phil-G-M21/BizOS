import Link from "next/link";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { ProductCard } from "../../products/product-card";
import type { Product } from "../../products/product-shared";
import { DeleteButton } from "../delete-button";
import { RemoveButton } from "./remove-button";

export default async function CatalogDetailPage({
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

  const { data: links } = await supabase
    .from("catalog_products")
    .select("product_id, products(id, name, selling_price, cost_price, stock_quantity, category)")
    .eq("catalog_id", id);

  // PostgREST embeds a to-one relation as a single object, but without
  // generated Supabase types the client can't confirm that shape at compile
  // time — handle either an object or an array defensively (see inventory/page.tsx).
  const products: Product[] = (links ?? [])
    .map((link) => (Array.isArray(link.products) ? link.products[0] : link.products))
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/catalogs"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            ← Back to catalogs
          </Link>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{catalog.name}</h1>
          <div className="mt-1 text-sm text-slate-500">
            {products.length} {products.length === 1 ? "product" : "products"}
          </div>
        </div>
        <div className="flex w-fit gap-3">
          <Link
            href={`/catalogs/${catalog.id}/add`}
            className="inline-flex items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
          >
            + Add products
          </Link>
          <DeleteButton id={catalog.id} />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products in this catalog yet. Click Add products to get started.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actions={<RemoveButton catalogId={catalog.id} productId={product.id} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
