"use client";

import Script from "next/script";

const TIDIO_KEY =
  process.env.NEXT_PUBLIC_TIDIO_KEY || "e3tkzblgnc6o2jkryjhomfcotdsnyybp";

/**
 * Same Tidio widget as Laravel `layouts/footer-customer.blade.php`.
 * Load only on authenticated customer surfaces (dashboard layout).
 */
export default function TidioChat() {
  if (!TIDIO_KEY) return null;

  return (
    <Script
      src={`https://code.tidio.co/${TIDIO_KEY}.js`}
      strategy="afterInteractive"
    />
  );
}
