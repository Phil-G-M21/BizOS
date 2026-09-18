"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function del() {
    if (!confirm("Delete this catalog? Its products will not be deleted.")) return;
    await supabase.from("catalog_products").delete().eq("catalog_id", id);
    await supabase.from("catalogs").delete().eq("id", id);
    router.push("/catalogs");
    router.refresh();
  }

  return (
    <button
      onClick={del}
      className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Delete catalog
    </button>
  );
}
