"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const REGIONS = ["Ashanti", "Greater Accra", "Western", "Eastern", "Central", "Northern", "Volta", "Other"];
const CATEGORIES = ["Fashion", "Beauty", "Electronics", "Food", "Shoes", "Cosmetics", "Home", "Other"];

const field =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const label = "block text-sm font-medium text-slate-700";

export function BusinessDetailsForm({
  businessId,
  ownerId,
  initialName,
  initialRegion,
  initialCity,
  initialCategory,
  initialWhatsapp,
}: {
  businessId: string;
  ownerId: string;
  initialName: string;
  initialRegion: string;
  initialCity: string;
  initialCategory: string;
  initialWhatsapp: string;
}) {
  const supabase = createClient();

  const [name, setName] = useState(initialName);
  const [region, setRegion] = useState(initialRegion || REGIONS[0]);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory || CATEGORIES[0]);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus(null);

    const { error } = await supabase
      .from("businesses")
      .update({ name, region, city, category, whatsapp: whatsapp || null })
      .eq("id", businessId)
      .eq("owner_id", ownerId);

    setSaving(false);
    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }
    setStatus({ type: "success", message: "Business details saved." });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Business details</h2>
      <p className="mt-1 text-sm text-slate-500">Update your business name and location.</p>

      <div className="mt-4 space-y-4">
        <label className={label}>
          Business name
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={label}>
            Region
            <select className={field} value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            City
            <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
        </div>

        <label className={label}>
          Category
          <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className={label}>
          WhatsApp number
          <input
            className={field}
            type="tel"
            placeholder="e.g. 233241234567"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <span className="mt-1 block text-xs font-normal text-slate-400">
            Used for the &quot;Order on WhatsApp&quot; button on your public catalog. Include the
            country code, no spaces or plus sign.
          </span>
        </label>

        {status && (
          <p className={`text-sm ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving || !name}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
