"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition " +
        (active
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
      }
    >
      {icon}
      {label}
    </Link>
  );
}

export function DisabledNavItem({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div
      aria-disabled="true"
      className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300"
    >
      {icon}
      <span className="flex-1">{label}</span>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
        Soon
      </span>
    </div>
  );
}
