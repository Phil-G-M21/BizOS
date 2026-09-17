"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCustomerPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
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

    const { error } = await supabase.from("customers").insert({
      business_id: business.id,
      name,
      phone,
      email,
      address,
      notes,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/customers");
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Customers</div>
        <h1 className="text-2xl font-bold text-slate-900">Add a customer</h1>
        <p className="mt-1 text-sm text-slate-500">Save the people who keep coming back.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className={label}>
            Name
            <input
              className={field}
              placeholder="e.g. Ama Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={label}>
              Phone
              <input
                className={field}
                placeholder="+233 24 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className={label}>
              Email
              <input
                className={field}
                placeholder="customer@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <label className={label}>
            Address
            <input
              className={field}
              placeholder="e.g. 12 Ring Road, Accra"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label className={label}>
            Notes
            <textarea
              className={`${field} min-h-24`}
              placeholder="Anything worth remembering about this customer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/customers")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading || !name}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
