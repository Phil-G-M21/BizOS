"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AddButton({ catalogId, productId }: { catalogId: string; productId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function add() {
    setLoading(true);
    await supabase.from("catalog_products").insert({ catalog_id: catalogId, product_id: productId });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={add}
      disabled={loading}
      className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add"}
    </button>
  );
}
