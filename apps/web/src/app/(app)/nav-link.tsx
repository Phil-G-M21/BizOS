"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  CreditCard,
  Inbox,
  Layers,
  LayoutGrid,
  Package2,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition [-webkit-tap-highlight-color:transparent] " +
        (active
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200 active:bg-blue-100"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 active:text-slate-900")
      }
    >
      {icon}
      {label}
    </Link>
  );
}

// Shared nav sections rendered by both the desktop sidebar and the mobile drawer,
// so the two never drift out of sync.
export function NavContent() {
  return (
    <>
      <div>
        <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
          MAIN
        </div>
        <div className="space-y-1">
          <NavLink href="/dashboard" label="Dashboard" icon={<LayoutGrid className="h-4 w-4" />} />
          <NavLink href="/products" label="Products" icon={<Package2 className="h-4 w-4" />} />
          <NavLink href="/catalogs" label="Catalogs" icon={<Layers className="h-4 w-4" />} />
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
          <NavLink href="/account" label="Settings" icon={<Settings className="h-4 w-4" />} />
        </div>
      </div>
    </>
  );
}
