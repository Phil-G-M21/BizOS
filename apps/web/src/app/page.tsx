import Link from "next/link";
import {
  BriefcaseBusiness,
  Check,
  MessageSquareText,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const featureList = [
  "Know what is on the shelf",
  "Keep WhatsApp orders together",
  "Record MoMo and cash payments",
  "See which customers come back",
  "Close the day with confidence",
];

const previewOrders = [
  { id: "#1047", customer: "Michael", total: 380 },
  { id: "#1046", customer: "Sandra", total: 520 },
  { id: "#1045", customer: "Kwame", total: 250 },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[#f7f5f0]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 shadow-sm shadow-teal-900/20">
              <BriefcaseBusiness className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">Business OS</div>
              <div className="text-xs text-slate-500">A calmer way to run the shop.</div>
            </div>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Log In
          </Link>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 border-l-2 border-[#d97757] pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
              <Sparkles className="h-3.5 w-3.5" />
              Made for busy shops
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Orders from WhatsApp. Stock on the shelf. Cash you can see.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              BizOs keeps the everyday details in one place, so you can spend less time
              searching through chats and notebooks and more time serving customers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?mode=register"
                className="rounded-lg bg-teal-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800"
              >
                Open your shop
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Log In
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
              {featureList.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative rounded-2xl border border-slate-300 bg-[#17211f] p-4 shadow-[0_24px_60px_rgba(23,33,31,0.16)]">
              <div className="absolute left-1/2 top-3 h-1.5 w-24 -translate-x-1/2 rounded-full bg-slate-600" />
              <div className="rounded-[28px] bg-slate-50 p-4 shadow-inner">
                <div className="rounded-[22px] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Ama Fashion</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          Business
                        </div>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      LIVE
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Orders today
                      </div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">GH₵4,850</div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-3">
                      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                        <span>Orders</span>
                        <span>23</span>
                      </div>
                      <div className="space-y-2">
                        {previewOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-2 text-sm"
                          >
                            <div>
                              <div className="font-medium text-slate-800">{order.customer}</div>
                              <div className="text-slate-500">{order.id}</div>
                            </div>
                            <div className="font-semibold text-slate-900">
                              GH₵{order.total}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">WhatsApp order</div>
                  <div className="text-sm font-semibold text-slate-900">
                    New order from Michael
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
