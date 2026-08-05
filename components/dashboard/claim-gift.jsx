"use client";

import { useCallback, useEffect, useState } from "react";
import { Gift, Loader2, MapPin, X } from "lucide-react";
import { claimGift, fetchAvailableGifts } from "@/lib/loyalty-api";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-theme-green-action/50";

function StatusPill({ status }) {
  const normalized = String(status || "Pending");
  const styles =
    normalized === "Approved" || normalized === "Delivered"
      ? "bg-theme-green-action/20 text-theme-green-action"
      : normalized === "Rejected"
        ? "bg-theme-red-action/20 text-theme-red-action"
        : "bg-theme-orange/20 text-theme-orange";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
      {normalized}
    </span>
  );
}

function ClaimGiftModal({ gift, open, onClose, onClaimed }) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setAddress("");
      setPhone("");
      setError("");
    }
  }, [open]);

  if (!open || !gift) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await claimGift({
        giftId: gift.id,
        deliveryAddress: address.trim(),
        contactPhone: phone.trim(),
      });
      onClaimed?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to submit gift claim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#141A2E] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Claim Gift</h3>
            <p className="mt-1 text-sm text-white/50">{gift.title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-white/80">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs text-white/45">
              <MapPin className="h-3.5 w-3.5" />
              Delivery Address
            </span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              required
              minLength={10}
              className={`${fieldClass} resize-none`}
              placeholder="Full name, street, city, postal code, country"
            />
          </label>

          <label className="block text-sm text-white/80">
            <span className="mb-1.5 block text-xs text-white/45">Contact Phone (optional)</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
              placeholder="+94 ..."
            />
          </label>

          {error ? <p className="text-sm text-theme-red-action">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting || address.trim().length < 10}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-theme-green-action px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
            Submit Claim
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ClaimGift({ onClaimed, className = "" }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gifts, setGifts] = useState([]);
  const [userLevel, setUserLevel] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);

  const loadGifts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAvailableGifts();
      setGifts(data.gifts || []);
      setUserLevel(data.user_level || "");
    } catch (err) {
      setError(err.message || "Failed to load available gifts.");
      setGifts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  const eligibleCount = gifts.filter((gift) => gift.is_eligible).length;

  return (
    <div className={className}>
      <div className="mb-5 rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30">
            <Gift className="h-5 w-5 text-theme-green-action" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Claim Gift</h2>
            <p className="mt-1 text-sm text-white/45">
              Your current level: <span className="font-semibold text-white">{userLevel || "—"}</span>
              {eligibleCount > 0
                ? ` · ${eligibleCount} gift${eligibleCount === 1 ? "" : "s"} available to claim`
                : " · No gifts available right now"}
            </p>
          </div>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-theme-red-action">{error}</p> : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-10">
          <p className="text-sm text-white/50">Loading available gifts…</p>
        </div>
      ) : !gifts.length ? (
        <div className="rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-10">
          <p className="text-sm text-white/50">No gifts are available for your account type at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {gifts.map((gift) => {
            const canClaim = gift.is_eligible;
            const claimed = gift.already_claimed;
            return (
              <article
                key={gift.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#0B1020]/70 p-5"
              >
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">{gift.title}</h3>
                  {gift.description ? (
                    <p className="mt-2 text-sm text-white/45">{gift.description}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(gift.allowed_levels || []).map((level) => (
                      <span
                        key={level}
                        className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-white/70"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  {claimed ? (
                    <StatusPill status={gift.claim_status} />
                  ) : canClaim ? (
                    <button
                      type="button"
                      onClick={() => setSelectedGift(gift)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-theme-green-action px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Gift className="h-4 w-4" />
                      Claim Gift
                    </button>
                  ) : (
                    <p className="text-xs text-white/40">Not eligible at your current level</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ClaimGiftModal
        gift={selectedGift}
        open={Boolean(selectedGift)}
        onClose={() => setSelectedGift(null)}
        onClaimed={() => {
          loadGifts();
          onClaimed?.();
        }}
      />
    </div>
  );
}
