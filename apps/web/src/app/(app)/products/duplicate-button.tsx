"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SourceProduct = {
  name: string;
  selling_price: number;
  cost_price: number;
  category: string | null;
  sku: string | null;
  low_stock_threshold: number | null;
};

export function DuplicateButton({ product }: { product: SourceProduct }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function duplicate() {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1);
    const business = businesses?.[0];
    if (!business) {
      router.push("/onboarding");
      return;
    }

    const { data: copy, error: insertError } = await supabase
      .from("products")
      .insert({
        business_id: business.id,
        name: `${product.name} (copy)`,
        selling_price: product.selling_price,
        cost_price: product.cost_price,
        category: product.category,
        sku: product.sku,
        low_stock_threshold: product.low_stock_threshold,
        stock_quantity: 0,
      })
      .select("id")
      .single();

    setLoading(false);
    if (insertError || !copy) {
      setError(insertError?.message ?? "Could not duplicate this product.");
      return;
    }

    router.push(`/products/${copy.id}/edit`);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={duplicate}
        disabled={loading}
        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "Duplicating..." : "Duplicate"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
