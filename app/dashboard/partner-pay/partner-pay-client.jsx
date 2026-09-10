"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PartnerPayPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("gateway") || params.get("token");
    if (token) {
      router.replace(`/partner-pay?gateway=${encodeURIComponent(token)}`);
      return;
    }
    router.replace("/dashboard");
  }, [params, router]);

  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 text-center text-white/50">
      Opening checkout…
    </div>
  );
}
