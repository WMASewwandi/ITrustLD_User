"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { getAffiliateLink } from "@/lib/affiliate";
import { getUserAffiliateCode, getUserSession } from "@/lib/auth";
import { copyTextToClipboard } from "@/lib/clipboard";

export default function AffiliateLinkCard({
  affiliateCode: affiliateCodeProp = null,
  title = "Copy and promote your affiliate link",
  className = "",
}) {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = affiliateCodeProp || getUserAffiliateCode(getUserSession());
    if (!code) {
      setLink("");
      return;
    }
    setLink(getAffiliateLink(code));
  }, [affiliateCodeProp]);

  if (!link) return null;

  async function copyLink() {
    try {
      await copyTextToClipboard(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`min-w-0 ${className}`}>
      <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
      <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 overflow-hidden truncate rounded-xl bg-white/[0.07] px-4 py-3 text-sm text-white/80">
          {link}
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {copied ? (
            <>
              Copied
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Copy Link
              <Copy className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
