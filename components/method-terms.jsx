"use client";

import { useMemo } from "react";
import { containsHtml, sanitizeHtml } from "@/lib/sanitize-html";

export default function MethodTerms({ html }) {
  const raw = String(html || "").trim();
  const isHtml = containsHtml(raw);
  const sanitized = useMemo(() => (isHtml ? sanitizeHtml(raw) : ""), [isHtml, raw]);
  const plainLines = useMemo(
    () =>
      isHtml
        ? []
        : raw
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean),
    [isHtml, raw],
  );

  if (!raw) {
    return <p className="text-white/50">No terms available for this method.</p>;
  }

  if (isHtml) {
    return (
      <div
        className="[&_p]:mb-1 [&_p]:pl-4 [&_p]:pt-1"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return plainLines.map((line, index) => <p key={index}>* {line}</p>);
}
