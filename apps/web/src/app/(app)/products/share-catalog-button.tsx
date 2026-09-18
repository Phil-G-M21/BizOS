"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { waShareLink } from "@/lib/whatsapp";

export function ShareCatalogButton({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/shop/${businessId}` : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <Share2 className="h-4 w-4" />
        Share catalog
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="text-sm font-medium text-slate-700">Public catalog link</div>
          <div className="mt-2 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {url}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={copy}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={waShareLink(`Check out our catalog: ${url}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
