"use client";

import { useState } from "react";
import Link from "next/link";
import BottomMessage from "@/components/dashboard/bottom-message";
import { Crown, Medal, Sparkles, Star, Trophy } from "lucide-react";

const AVAILABLE = 811;
const TOTAL_EARNED = 812;
const USD_VALUE = (TOTAL_EARNED / 1000).toFixed(2);
const LEVEL_PROGRESS = 8;
const CURRENT_LEVEL = "Normal Level";

const TIERS = [
  { name: "Silver", points: 0 },
  { name: "Gold", points: 250000 },
  { name: "Diamond", points: 400000 },
  { name: "VIP", points: 500000 },
  { name: "VVIP", points: 1000000 },
];

const ACCOUNTS = [
  { id: "1", label: "Commercial Bank — 8001234567" },
  { id: "2", label: "Hatton National Bank — 0690123456" },
  { id: "3", label: "USDT Wallet (TRC20)" },
  { id: "4", label: "Skrill — avishka@email.com" },
];

const POINT_HISTORY = [
  { id: "LP-9021", points: "5,000", amount: "USD 5.00", date: "2025-06-12", status: "Completed" },
  { id: "LP-9018", points: "10,000", amount: "USD 10.00", date: "2025-06-01", status: "Pending" },
  { id: "LP-9010", points: "2,500", amount: "USD 2.50", date: "2025-05-20", status: "Completed" },
];

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-theme-green-action/50";

export default function LoyaltyPage() {
  const [section, setSection] = useState("overview"); // overview | withdraw
  const [withdrawTab, setWithdrawTab] = useState("withdraw"); // withdraw | history
  const [points, setPoints] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (LEVEL_PROGRESS / 100) * circumference;

  function openWithdraw() {
    setSection("withdraw");
    setWithdrawTab("withdraw");
    setError("");
    setSuccess("");
  }

  function handleWithdraw(e) {
    e.preventDefault();
    setSuccess("");
    if (!/^\d+$/.test(points) || Number(points) <= 0) {
      setError("Enter a valid number of points (digits only).");
      return;
    }
    if (Number(points) > AVAILABLE) {
      setError(`You only have ${AVAILABLE} points available.`);
      return;
    }
    if (!account) {
      setError("Please select an account to withdraw to.");
      return;
    }
    setError("");
    setSuccess(
      `Loyalty withdrawal of ${Number(points).toLocaleString()} points submitted (demo). Status: Pending.`
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Loyalty Points</h1>
          <p className="mt-2 text-sm text-white/50">
            Track Trust Points, tiers, and redeem loyalty cash to a saved account.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSection("overview")}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              section === "overview"
                ? "bg-white/20 text-white"
                : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={openWithdraw}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              section === "withdraw"
                ? "bg-white/20 text-white"
                : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Loyalty Withdraw
          </button>
        </div>
      </div>

      {section === "overview" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div className="space-y-5">
            <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30" />
                    <Trophy className="relative h-8 w-8 text-theme-green-action drop-shadow-[0_0_16px_rgba(13,159,27,0.5)]" />
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-theme-green-action text-theme-green-action" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Available Balance</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight text-white">{AVAILABLE}</p>
                  </div>
                </div>

                <div className="hidden h-16 w-px bg-white/10 sm:block" />

                <div>
                  <p className="text-sm text-white/50">Total Earned Points</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-white">{TOTAL_EARNED}</p>
                  <p className="mt-1 text-sm text-white/45">{USD_VALUE} USD</p>
                </div>
              </div>
            </section>

            <div className="rounded-xl bg-theme-green-dark px-5 py-4 text-center text-sm font-semibold text-white shadow-[0_12px_28px_rgba(20,83,91,0.35)] sm:text-base">
              ($) 10,000 Trust Points = 10 USD
            </div>

            <section className="rounded-2xl border border-white/12 bg-[#141A2E] p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">Standard user with affiliate</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/55">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-theme-green-action" />
                  Recognized with affiliate users
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-theme-green-action" />
                  Earn Trust Points from eligible deposits and referrals
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-white">Membership tiers</h2>
              <div className="grid gap-2 sm:grid-cols-5">
                {TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center"
                  >
                    <div className="mb-1 flex items-center justify-center gap-1 text-theme-green-action">
                      {tier.name === "VIP" || tier.name === "VVIP" ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <Crown className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">{tier.name}</p>
                    <p className="mt-1 text-[11px] text-white/40">{tier.points.toLocaleString()}+</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="relative mx-auto h-48 w-48">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180" aria-hidden>
                <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(13,159,27,0.25)" strokeWidth="14" />
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#0D9F1B"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Star className="mb-1 h-5 w-5 fill-theme-green-action text-theme-green-action" />
                <p className="text-3xl font-bold text-white">{LEVEL_PROGRESS}%</p>
              </div>
            </div>
            <p className="mt-4 text-base font-semibold text-theme-green-shaded">{CURRENT_LEVEL}</p>
            <p className="mt-2 text-sm text-white/45">Progress based on activity & engagement</p>
            <button
              type="button"
              onClick={openWithdraw}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,255,255,0.08)] transition hover:bg-white/30"
            >
              Loyalty Withdraw
            </button>
          </aside>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex gap-6 border-b border-white/10">
            {[
              { id: "withdraw", label: "Withdraw" },
              { id: "history", label: "Transaction History" },
            ].map((item) => {
              const active = withdrawTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setWithdrawTab(item.id);
                    setError("");
                    setSuccess("");
                  }}
                  className={`relative pb-3 text-sm font-semibold transition ${
                    active ? "text-white" : "text-white/45 hover:text-white/75"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-theme-green-action" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {withdrawTab === "withdraw" ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <form onSubmit={handleWithdraw} className="space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Enter number of points to withdraw
                  </h2>
                  <div className="mt-4 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
                    <label className="mb-2 block text-sm font-medium text-white/70">Points</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={points}
                      onChange={(e) => {
                        setPoints(e.target.value.replace(/\D/g, ""));
                        setError("");
                        setSuccess("");
                      }}
                      placeholder="Enter Number of Points"
                      className={fieldClass}
                    />
                    <p className="mt-2 text-xs text-white/40">
                      Available: {AVAILABLE} pts · 10,000 Trust Points = 10 USD
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">Select account details</h2>
                  <p className="mt-1 text-sm text-white/45">
                    (Please click on the account you want points to be withdrawn to)
                  </p>
                  <div className="mt-4 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
                    <label className="mb-2 block text-sm font-medium text-white/70">Select Option</label>
                    <select
                      value={account}
                      onChange={(e) => {
                        setAccount(e.target.value);
                        setError("");
                        setSuccess("");
                      }}
                      className={fieldClass}
                    >
                      <option value="" className="bg-[#141A2E]">
                        Select Payment Option
                      </option>
                      {ACCOUNTS.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#141A2E]">
                          {a.label}
                        </option>
                      ))}
                    </select>
                    <Link
                      href="/dashboard/profile"
                      className="mt-3 inline-block text-xs text-theme-green-action hover:underline"
                    >
                      Manage saved banks
                    </Link>
                  </div>
                </section>

                {error ? (
                  <BottomMessage
                    title="Unable to withdraw"
                    variant="error"
                    onClose={() => setError("")}
                    primaryAction={{ label: "Try Again", onClick: () => setError("") }}
                    secondaryAction={{ label: "Close", onClick: () => setError("") }}
                  >
                    {error}
                  </BottomMessage>
                ) : null}
                {success ? (
                  <BottomMessage
                    title="Loyalty withdraw submitted"
                    variant="success"
                    onClose={() => setSuccess("")}
                    primaryAction={{ label: "View History", onClick: () => { setSuccess(""); setWithdrawTab("history"); } }}
                    secondaryAction={{ label: "Close", onClick: () => setSuccess("") }}
                  >
                    {success}
                  </BottomMessage>
                ) : null}

                <button
                  type="submit"
                  className="rounded-xl bg-white/20 px-10 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,255,255,0.08)] transition hover:bg-white/30"
                >
                  Withdraw
                </button>
              </form>

              <aside
                className="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-[#141A2E] via-[#0B1020] to-theme-blue-dark p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                aria-hidden
              >
                <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-theme-green-action/15" />
                <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-theme-green-dark/25" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6 flex h-36 w-36 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-theme-green-action/10 ring-1 ring-theme-green-action/25" />
                    <Trophy className="h-20 w-20 text-theme-green-action drop-shadow-[0_0_24px_rgba(13,159,27,0.55)]" />
                    <Medal className="absolute -bottom-1 right-2 h-10 w-10 text-theme-green-shaded" />
                  </div>
                  <div className="flex items-center gap-2 text-theme-green-action">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">Redeem loyalty rewards</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
                    Convert Trust Points into cash and send payouts to your preferred saved account.
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {POINT_HISTORY.map((row) => (
                <article
                  key={row.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-white">Loyalty Withdrawal - {row.id}</p>
                    <p className="mt-1 text-sm text-white/50">{row.points} points</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                        row.status === "Completed"
                          ? "bg-theme-green-action text-white"
                          : "bg-theme-green-shaded text-white"
                      }`}
                    >
                      {row.status}
                    </span>
                    <p className="mt-2 text-sm text-white/45">{row.date}</p>
                    <p className="text-lg font-bold text-white">{row.amount}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
