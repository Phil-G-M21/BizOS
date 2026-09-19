"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { DeleteButton } from "./delete-button";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
};

export function CustomerGrid({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return customers.filter((customer) =>
      `${customer.name} ${customer.phone ?? ""} ${customer.email ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className="space-y-5">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
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

      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">No customers match your search.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Link href={`/customers/${customer.id}`} className="block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d97757] text-lg font-bold text-white">
                    {customer.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold text-slate-900 hover:text-teal-700">
                      {customer.name}
                    </div>
                    <div className="truncate text-sm text-slate-500">
                      {customer.phone || "No phone number"}
                    </div>
                  </div>
                </div>

                {(customer.email || customer.address || customer.notes) && (
                  <div className="mt-5 space-y-1.5 text-sm text-slate-600">
                    {customer.email && <div className="truncate">{customer.email}</div>}
                    {customer.address && <div className="truncate">{customer.address}</div>}
                    {customer.notes && (
                      <div className="line-clamp-2 text-slate-500">{customer.notes}</div>
                    )}
                  </div>
                )}
              </Link>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/customers/${customer.id}/edit`}
                  className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Link>
                <DeleteButton id={customer.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
