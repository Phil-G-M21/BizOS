"use client";

import { useState } from "react";
import { MessageCircle, Link as LinkIcon } from "lucide-react";
import { waShareLink } from "@/lib/whatsapp";

export function ShareOrderActions({
  publicToken,
  orderRef,
  businessName,
}: {
  publicToken: string;
  orderRef: string;
  businessName: string;
}) {
  const [copied, setCopied] = useState(false);

  // Built client-side from window.location so we never trust a server-side
  // host header for a link that goes out to a customer.
  const publicLink =
    typeof window === "undefined" ? "" : `${window.location.origin}/order/${publicToken}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context); nothing to fall back to.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={waShareLink(`Order #${orderRef} from ${businessName}: ${publicLink}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
      >
        <MessageCircle className="h-4 w-4" />
        Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <LinkIcon className="h-4 w-4" />
        {copied ? "Copied!" : "Copy order link"}
      </button>
    </div>
  );
}
