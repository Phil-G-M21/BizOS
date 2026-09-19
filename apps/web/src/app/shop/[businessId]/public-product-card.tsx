import { Package2 } from "lucide-react";
import { cedis } from "@/app/(app)/products/product-shared";

export type PublicProduct = {
  id: string;
  name: string;
  selling_price: number;
  category: string | null;
  in_stock: boolean;
  image_url: string | null;
};

// Read-only storefront card for anonymous visitors: no click-through, no
// Edit/Delete, no cost_price — deliberately not the private ProductCard.
export function PublicProductCard({ product }: { product: PublicProduct }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[#f0eee8]">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL
          <img src={product.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Package2 className="h-12 w-12 text-slate-400" />
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-slate-900">{product.name}</div>
          <div className="mt-1 text-sm text-slate-500">{product.category}</div>
        </div>
        <div
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
            product.in_stock ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {product.in_stock ? "IN STOCK" : "OUT OF STOCK"}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-500">Price</div>
        <div className="mt-1 text-lg font-bold text-slate-900">{cedis(product.selling_price)}</div>
      </div>
    </div>
  );
}
