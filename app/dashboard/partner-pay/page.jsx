import { Suspense } from "react";
import PartnerPayPage from "./partner-pay-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-16 text-center text-white/50">
          Loading partner payment…
        </div>
      }
    >
      <PartnerPayPage />
    </Suspense>
  );
}
