"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Package2, Search, X } from "lucide-react";
import { DeleteButton } from "./delete-button";

type Product = {
  id: string;
  name: string;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  category: string | null;
};

const LOW_STOCK_THRESHOLD = 5;

const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();

type StockFilter = "All" | "In Stock" | "Low Stock" | "Out of Stock";

export function ProductGrid({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All");

  const visible = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && product.stock_quantity > LOW_STOCK_THRESHOLD) ||
        (stockFilter === "Low Stock" &&
          product.stock_quantity > 0 &&
          product.stock_quantity <= LOW_STOCK_THRESHOLD) ||
        (stockFilter === "Out of Stock" && product.stock_quantity === 0);
      return matchesSearch && matchesFilter;
    });
  }, [products, search, stockFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["All", "In Stock", "Low Stock", "Out of Stock"] as StockFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                stockFilter === filter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">No products match your search.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((product) => {
            const lowStock = product.stock_quantity <= LOW_STOCK_THRESHOLD;
            return (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
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
                    {product.stock_quantity === 0
                      ? "OUT OF STOCK"
                      : lowStock
                        ? "LOW STOCK"
                        : "IN STOCK"}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
                  <div>
                    <div className="text-xs text-slate-500">Selling price</div>
                    <div className="mt-1 font-bold text-slate-900">
                      {cedis(product.selling_price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Cost price</div>
                    <div className="mt-1 font-semibold text-slate-700">
                      {cedis(product.cost_price)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>Stock</span>
                  <span className="font-semibold text-slate-900">
                    {product.stock_quantity} units
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={product.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
