"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Package2 } from "lucide-react";
import { cedis, isLowStock, type Product } from "./product-shared";

export type { Product };

// Shared shopping-style product card: tap the body to open the product detail
// page, while `actions` (Edit/Delete, Remove from catalog, etc.) opts out via
// stopPropagation so nested buttons/links don't trigger the card navigation.
export function ProductCard({ product, actions }: { product: Product; actions: ReactNode }) {
  const router = useRouter();
  const lowStock = isLowStock(product);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/products/${product.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/products/${product.id}`);
        }
      }}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-32 items-center justify-center rounded-xl bg-[#f0eee8]">
        <Package2 className="h-12 w-12 text-slate-400" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-slate-900">{product.name}</div>
          <div className="mt-1 text-sm text-slate-500">{product.category}</div>
        </div>
        <div
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
            lowStock ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {product.stock_quantity === 0 ? "OUT OF STOCK" : lowStock ? "LOW STOCK" : "IN STOCK"}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
        <div>
          <div className="text-xs text-slate-500">Selling price</div>
          <div className="mt-1 font-bold text-slate-900">{cedis(product.selling_price)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Cost price</div>
          <div className="mt-1 font-semibold text-slate-700">{cedis(product.cost_price)}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>Stock</span>
        <span className="font-semibold text-slate-900">{product.stock_quantity} units</span>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        {actions}
      </div>
    </div>
  );
}
