"use client";

import { useEffect, useState } from "react";
import { fetchMembershipTiers } from "@/lib/membership-tiers-api";
import { MEMBERSHIP_TIER_LADDER } from "@/lib/membership-tiers";

const EMPTY_LADDER = MEMBERSHIP_TIER_LADDER.map((tier) => ({ ...tier, benefits: [] }));

export function useMembershipTiers(audience = null) {
  const [tiers, setTiers] = useState(EMPTY_LADDER);
  const [loading, setLoading] = useState(true);
  const [loadedFor, setLoadedFor] = useState(null);

  useEffect(() => {
    if (!audience) {
      setLoading(true);
      setLoadedFor(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const items = await fetchMembershipTiers({ audience });
        if (!cancelled) {
          setTiers(items);
          setLoadedFor(audience);
        }
      } catch {
        if (!cancelled) {
          setTiers(EMPTY_LADDER);
          setLoadedFor(audience);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [audience]);

  const ready = Boolean(audience) && loadedFor === audience && !loading;
  return {
    tiers: ready ? tiers : EMPTY_LADDER,
    loading: !ready,
  };
}
