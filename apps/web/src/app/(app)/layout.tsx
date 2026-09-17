import {
  BriefcaseBusiness,
  CreditCard,
  Inbox,
  LayoutGrid,
  Package2,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { requireBusiness } from "@/lib/business";
import { SignOutButton } from "./sign-out-button";
import { DisabledNavItem, NavLink } from "./nav-link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { business, user } = await requireBusiness();

  const initial = (user.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white sm:flex sm:flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 shadow-sm shadow-teal-900/20">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">{business.name}</div>
            <div className="truncate text-xs text-slate-500">{business.category}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 px-4 py-5">
          <div>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
              MAIN
            </div>
            <div className="space-y-1">
              <NavLink href="/dashboard" label="Dashboard" icon={<LayoutGrid className="h-4 w-4" />} />
              <NavLink href="/products" label="Products" icon={<Package2 className="h-4 w-4" />} />
              <NavLink href="/customers" label="Customers" icon={<Users className="h-4 w-4" />} />
              <NavLink href="/orders" label="Orders" icon={<ShoppingBag className="h-4 w-4" />} />
              <NavLink href="/inventory" label="Inventory" icon={<Inbox className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
              BUSINESS
            </div>
            <div className="space-y-1">
              <NavLink href="/payments" label="Payments" icon={<CreditCard className="h-4 w-4" />} />
              <NavLink href="/expenses" label="Expenses" icon={<Wallet className="h-4 w-4" />} />
              <NavLink href="/analytics" label="Analytics" icon={<TrendingUp className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
              SYSTEM
            </div>
            <div className="space-y-1">
              <DisabledNavItem label="Settings" icon={<Settings className="h-4 w-4" />} />
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Today at</div>
              <div className="text-lg font-semibold text-slate-900">{business.name}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d97757] text-sm font-semibold text-white">
                  {initial}
                </div>
                <div className="hidden sm:block">
                  <div className="max-w-[160px] truncate text-sm font-medium text-slate-900">
                    {user.email}
                  </div>
                  <div className="text-xs text-slate-500">Merchant</div>
                </div>
              </div>
              <SignOutButton />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
