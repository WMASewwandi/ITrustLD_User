"use client";

import { useEffect, useState } from "react";
import { fetchMembershipTiers } from "@/lib/membership-tiers-api";
import { MEMBERSHIP_TIER_LADDER } from "@/lib/membership-tiers";

const EMPTY_LADDER = MEMBERSHIP_TIER_LADDER.map((tier) => ({ ...tier, benefits: [] }));

export function useMembershipTiers() {
  const [tiers, setTiers] = useState(EMPTY_LADDER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await fetchMembershipTiers();
        if (!cancelled) setTiers(items);
      } catch {
        if (!cancelled) setTiers(EMPTY_LADDER);
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
