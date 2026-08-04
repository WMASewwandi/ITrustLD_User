"use client";

import { useEffect, useState } from "react";
import WelcomeHero from "@/components/dashboard/welcome-hero";
import AccountOverview from "@/components/dashboard/account-overview";
import PromoBanner from "@/components/dashboard/promo-banner";
import PromotionalSlidersList from "@/components/dashboard/promotional-sliders-list";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import LatestNews from "@/components/dashboard/latest-news";
import { fetchDashboard } from "@/lib/dashboard";
import { getUserSession } from "@/lib/auth";

export default function DashboardPage() {
  const [userName, setUserName] = useState("there");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getUserSession();
    if (cached?.name) setUserName(cached.name);

    let cancelled = false;

    async function load() {
      try {
        const data = await fetchDashboard();
        if (cancelled) return;
        setDashboard(data);
        if (data?.user?.name) setUserName(data.user.name);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Could not load dashboard.");
        const cachedUser = getUserSession();
        if (cachedUser) {
          setDashboard({
            user: cachedUser,
            documents: [],
            recent_transactions: [],
            blog_posts: [],
            promotional_banners: [],
            verification_complete: false,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-white/50">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <>
      <WelcomeHero userName={userName} />
      {error ? (
        <p className="mx-auto mb-4 max-w-[1400px] px-4 text-center text-sm text-theme-orange sm:px-6 lg:px-8">
          {error}
        </p>
      ) : null}
      <AccountOverview
        user={dashboard?.user}
        documents={dashboard?.documents}
        verificationComplete={dashboard?.verification_complete}
      />
      <PromoBanner banner={dashboard?.promo_banner} />
      <PromotionalSlidersList
        banners={dashboard?.promotional_slider_banners ?? dashboard?.promotional_sliders}
        audience={
          dashboard?.user?.user_type === "partner" || dashboard?.user?.is_affiliate
            ? "affiliate"
            : "normal"
        }
      />
      <RecentTransactions transactions={dashboard?.recent_transactions} />
      <LatestNews user={dashboard?.user} />
    </>
  );
}
