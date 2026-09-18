import Link from "next/link";
import { Layers } from "lucide-react";
import { requireBusiness } from "@/lib/business";

export default async function CatalogsPage() {
  const { supabase, business } = await requireBusiness();

  const { data: catalogs } = await supabase
    .from("catalogs")
    .select("id, name, created_at, catalog_products(count)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const rows = catalogs ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Catalogs</div>
          <h1 className="text-3xl font-bold text-slate-900">All catalogs</h1>
        </div>
        <Link
          href="/catalogs/new"
          className="inline-flex w-fit items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
        >
          + New catalog
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No catalogs yet. Click New catalog to group your products into a collection.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((catalog) => {
            const count = catalog.catalog_products?.[0]?.count ?? 0;
            return (
              <Link
                key={catalog.id}
                href={`/catalogs/${catalog.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center rounded-xl bg-[#f0eee8]">
                  <Layers className="h-12 w-12 text-slate-400" />
                </div>
                <div className="mt-4 text-xl font-semibold text-slate-900">{catalog.name}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {count} {count === 1 ? "product" : "products"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
