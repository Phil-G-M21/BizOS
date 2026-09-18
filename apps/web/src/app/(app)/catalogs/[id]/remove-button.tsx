"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RemoveButton({ catalogId, productId }: { catalogId: string; productId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function remove() {
    await supabase
      .from("catalog_products")
      .delete()
      .eq("catalog_id", catalogId)
      .eq("product_id", productId);
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Remove
    </button>
  );
}
