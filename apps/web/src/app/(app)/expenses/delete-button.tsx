"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function del() {
    if (!confirm("Delete this expense?")) return;
    await supabase.from("expenses").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={del}
      className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
