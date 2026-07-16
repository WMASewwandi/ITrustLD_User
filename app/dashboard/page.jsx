"use client";

import { useEffect, useState } from "react";
import WelcomeHero from "@/components/dashboard/welcome-hero";
import AccountOverview from "@/components/dashboard/account-overview";
import PromoBanner from "@/components/dashboard/promo-banner";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import LatestNews from "@/components/dashboard/latest-news";

export default function DashboardPage() {
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setUserName(parsed.name);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <WelcomeHero userName={userName} />
      <AccountOverview />
      <PromoBanner />
      <RecentTransactions />
      <LatestNews />
    </>
  );
}
