import Link from "next/link";
import { requireBusiness } from "@/lib/business";
import { CustomerGrid } from "./customer-grid";

export default async function CustomersPage() {
  const { supabase, business } = await requireBusiness();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone, email, address, notes")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const rows = customers ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Customers</div>
          <h1 className="text-3xl font-bold text-slate-900">Customer list</h1>
        </div>
        <Link
          href="/customers/new"
          className="inline-flex w-fit items-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
        >
          + Add Customer
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No customers yet. Click Add Customer to save your first one.
        </p>
      ) : (
        <CustomerGrid customers={rows} />
      )}
    </div>
  );
}
