"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { NavContent } from "./nav-link";

// Must match the (app) layout header's row height exactly (see layout.tsx) —
// an explicit shared min-height on both is the only robust way to guarantee
// their bottom borders line up, since letting each row's height emerge from
// its own (different) content is what caused the mismatch in the first place.
const HEADER_ROW_HEIGHT = "min-h-[96px]";

export function MobileNav({
  businessName,
  businessCategory,
}: {
  businessName: string;
  businessCategory: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open, restoring whatever was
  // there before (rather than assuming empty string) in case something else
  // ever sets these.
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 sm:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open &&
        createPortal(
          <>
            {/* Rendered via portal into document.body: the header this button lives in
                has backdrop-blur-xl, and any ancestor with filter/backdrop-filter creates
                a new containing block for position:fixed descendants — so without the
                portal, "fixed inset-0" here would resolve against the header's own small
                box instead of the viewport, clipping the drawer to a thin strip. */}
            <div
              className="fixed inset-0 z-40 bg-black/40 sm:hidden"
              role="presentation"
              onClick={() => setOpen(false)}
            />
            <div className="fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col bg-white shadow-2xl sm:hidden">
              <div
                className={`flex ${HEADER_ROW_HEIGHT} shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-700 shadow-sm shadow-teal-900/20">
                    <BriefcaseBusiness className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {businessName}
                    </div>
                    <div className="truncate text-xs text-slate-500">{businessCategory}</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-white px-4 py-5">
                <NavContent />
              </nav>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
