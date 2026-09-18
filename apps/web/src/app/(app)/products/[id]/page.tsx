import Link from "next/link";
import { redirect } from "next/navigation";
import { Package2 } from "lucide-react";
import { requireBusiness } from "@/lib/business";
import { DeleteButton } from "../delete-button";

const LOW_STOCK_THRESHOLD = 5;

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, business } = await requireBusiness();

  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, selling_price, cost_price, stock_quantity, category")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (error || !product) {
    redirect("/products");
  }

  const lowStock = product.stock_quantity <= LOW_STOCK_THRESHOLD;
  const stockLabel =
    product.stock_quantity === 0 ? "OUT OF STOCK" : lowStock ? "LOW STOCK" : "IN STOCK";

  return (
    <div className="max-w-2xl">
      <Link
        href="/products"
        className="text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        ← Back to products
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-64 items-center justify-center rounded-xl bg-[#f0eee8]">
          <Package2 className="h-20 w-20 text-slate-400" />
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <div className="mt-1 text-sm text-slate-500">{product.category}</div>
          </div>
          <div
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              lowStock ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {stockLabel}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-5">
          <div>
            <div className="text-sm text-slate-500">Selling price</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {cedis(product.selling_price)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Cost price</div>
            <div className="mt-1 text-2xl font-semibold text-slate-700">
              {cedis(product.cost_price)}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <span>Stock</span>
          <span className="font-semibold text-slate-900">{product.stock_quantity} units</span>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href={`/products/${product.id}/edit`}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <DeleteButton id={product.id} />
        </div>
      </div>
    </div>
  );
}
