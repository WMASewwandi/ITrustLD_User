"use client";

import { useEffect, useState } from "react";
import { fetchMembershipTiers } from "@/lib/membership-tiers-api";
import { MEMBERSHIP_TIERS } from "@/lib/membership-tiers";

export function useMembershipTiers() {
  const [tiers, setTiers] = useState(MEMBERSHIP_TIERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await fetchMembershipTiers();
        if (!cancelled) setTiers(items);
      } catch {
        if (!cancelled) setTiers(MEMBERSHIP_TIERS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tiers, loading };
}
