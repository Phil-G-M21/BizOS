import { BriefcaseBusiness, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { waOrderLink } from "@/lib/whatsapp";
import { PublicProductCard, type PublicProduct } from "./public-product-card";

export default async function PublicShopPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const supabase = await createClient();

  // Deliberately restricted to the public views only — never the base
  // businesses/products tables, and never cost_price. These views are the
  // security boundary for this anonymous, unauthenticated page.
  const { data: business, error } = await supabase
    .from("public_catalog_business")
    .select("id, name, city, whatsapp")
    .eq("id", businessId)
    .single();

  if (error || !business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            This catalog link isn&apos;t valid, or the shop is no longer available.
          </p>
        </div>
      </main>
    );
  }

  const { data: products } = await supabase
    .from("public_catalog_products")
    .select("id, name, selling_price, category, in_stock")
    .eq("business_id", businessId)
    .order("name", { ascending: true });

  const rows: PublicProduct[] = products ?? [];
  const whatsappHref = business.whatsapp
    ? waOrderLink(business.whatsapp, `Hi, I'd like to order from ${business.name}`)
    : null;

  return (
    <main className="min-h-screen bg-[#f7f5f0] pb-28">
      <header className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 shadow-sm shadow-teal-900/20">
            <BriefcaseBusiness className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-900">{business.name}</h1>
            {business.city && <div className="text-sm text-slate-500">{business.city}</div>}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No products available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((product) => (
              <PublicProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {whatsappHref && (
        <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-4 [padding-bottom:calc(env(safe-area-inset-bottom,0px)+1rem)]">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>
      )}
    </main>
  );
}
