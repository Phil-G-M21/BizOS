"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  BriefcaseBusiness,
  FolderClosed,
  HeartHandshake,
  MoreHorizontal,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

const REGIONS = ["Ashanti", "Greater Accra", "Western", "Eastern", "Central", "Northern", "Volta", "Other"];

const CATEGORY_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "Fashion", icon: Sparkles },
  { name: "Beauty", icon: HeartHandshake },
  { name: "Electronics", icon: Smartphone },
  { name: "Food", icon: ShoppingBag },
  { name: "Shoes", icon: Star },
  { name: "Cosmetics", icon: BriefcaseBusiness },
  { name: "Home", icon: FolderClosed },
  { name: "Other", icon: MoreHorizontal },
];

const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400";
const label = "mb-2 block text-sm font-medium text-slate-700";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [region, setRegion] = useState(REGIONS[0]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name,
      category,
      region,
      city,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 shadow-sm shadow-teal-900/20">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold text-slate-900">Business OS</div>
            <div className="text-xs text-slate-500">A calmer way to run the shop.</div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Step {step} of 2
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {step === 1 ? "Tell us about your business" : "Choose your category"}
          </h1>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className={label}>Business name</label>
              <input
                className={field}
                placeholder="e.g. Phil's Tech"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className={label}>Region</label>
              <select className={field} value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>City</label>
              <input
                className={field}
                placeholder="e.g. Kumasi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name}
              className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {CATEGORY_OPTIONS.map(({ name: optionName, icon: Icon }) => {
                const active = category === optionName;
                return (
                  <button
                    key={optionName}
                    onClick={() => setCategory(optionName)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="font-semibold">{optionName}</div>
                  </button>
                );
              })}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
