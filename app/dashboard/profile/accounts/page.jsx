"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/page-header";
import BottomMessage from "@/components/dashboard/bottom-message";
import AddPaymentAccountForm from "@/components/dashboard/add-payment-account-form";
import {
  ACCOUNT_TYPE_LABELS,
  accountTypeNeedsBankFields,
  buildUpdatePayload,
  deletePaymentAccount,
  fetchPaymentAccounts,
  updatePaymentAccount,
} from "@/lib/payment-accounts";
import { hasUserSession } from "@/lib/auth";
import { Building2, Loader2, Pencil, Plus, Trash2, Wallet } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";

function AccountCard({ account, onDelete, onEdit }) {
  const isBank = accountTypeNeedsBankFields(account.accountType);

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-theme-green-action">
            {isBank ? <Building2 className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
          </span>
          <div>
            <p className="font-medium text-white">
              {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
            </p>
            {isBank ? (
              <>
                <p className="mt-1 text-sm text-white/60">{account.bank}</p>
                <p className="text-sm text-white/75">{account.accountNumber}</p>
                <p className="text-xs text-white/45">
                  {account.beneficiaryName} · {account.branch}
                </p>
              </>
            ) : (
              <p className="mt-1 break-all text-sm text-white/75">{account.display}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(account)}
            className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
            aria-label="Edit account"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(account)}
            className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-theme-red-action"
            aria-label="Delete account"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EditAccountForm({ account, onCancel, onSaved }) {
  const [draft, setDraft] = useState({ ...account });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isBank = accountTypeNeedsBankFields(account.accountType);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await updatePaymentAccount(account.id, buildUpdatePayload(draft));
      if (result?.error) {
        setError(result.message || "Update failed.");
        return;
      }
      onSaved(result.message);
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-xl border border-theme-green-action/25 bg-theme-green-action/5 p-4">
      {isBank ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Bank</label>
            <input
              className={fieldClass}
              value={draft.bank || ""}
              onChange={(e) => setDraft((d) => ({ ...d, bank: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Branch</label>
            <input
              className={fieldClass}
              value={draft.branch || ""}
              onChange={(e) => setDraft((d) => ({ ...d, branch: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Account name</label>
            <input
              className={fieldClass}
              value={draft.beneficiaryName || ""}
              onChange={(e) => setDraft((d) => ({ ...d, beneficiaryName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Account number</label>
            <input
              className={fieldClass}
              inputMode="numeric"
              value={draft.accountNumber || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, accountNumber: e.target.value.replace(/\D/g, "") }))
              }
              required
            />
          </div>
        </div>
      ) : account.accountType === "XM" ? (
        <div>
          <label className={labelClass}>XM Account ID</label>
          <input
            className={fieldClass}
            inputMode="numeric"
            value={draft.xmAccountId || ""}
            onChange={(e) => setDraft((d) => ({ ...d, xmAccountId: e.target.value }))}
            required
          />
        </div>
      ) : account.accountType === "SKRILL" ? (
        <div>
          <label className={labelClass}>Skrill Email</label>
          <input
            type="email"
            className={fieldClass}
            value={draft.skrillEmail || ""}
            onChange={(e) => setDraft((d) => ({ ...d, skrillEmail: e.target.value }))}
            required
          />
        </div>
      ) : account.accountType === "NETELLER" ? (
        <div>
          <label className={labelClass}>Neteller Email</label>
          <input
            type="email"
            className={fieldClass}
            value={draft.netellerEmail || ""}
            onChange={(e) => setDraft((d) => ({ ...d, netellerEmail: e.target.value }))}
            required
          />
        </div>
      ) : account.accountType === "PERFECT MONEY" ? (
        <div>
          <label className={labelClass}>PM Account ID</label>
          <input
            className={fieldClass}
            value={draft.pmAccountId || ""}
            onChange={(e) => setDraft((d) => ({ ...d, pmAccountId: e.target.value }))}
            required
          />
        </div>
      ) : account.accountType === "CRYPTO" ? (
        <div>
          <label className={labelClass}>Crypto Account ID</label>
          <input
            className={fieldClass}
            value={draft.cryptoAccountId || ""}
            onChange={(e) => setDraft((d) => ({ ...d, cryptoAccountId: e.target.value }))}
            required
          />
        </div>
      ) : null}

      {error ? <p className="text-xs text-theme-red-action">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-theme-green-action px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function PaymentAccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [accountGroups, setAccountGroups] = useState([]);
  const [systemOptions, setSystemOptions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const data = await fetchPaymentAccounts();
      setAccountGroups(data.account_groups || []);
      const options = (data.system_payment_options || []).map((opt) => opt.name);
      setSystemOptions(options);
    } catch (err) {
      if (err.status === 403) {
        setPageError("You do not have permission to manage payment accounts.");
      } else if (err.data?.code === "VERIFICATION_REQUIRED") {
        router.replace("/verify");
      } else {
        setPageError(err.message || "Failed to load accounts.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  async function handleDelete(account) {
    if (!window.confirm(`Delete this ${ACCOUNT_TYPE_LABELS[account.accountType] || "account"}?`)) return;
    try {
      const result = await deletePaymentAccount(account.id, account.accountType);
      if (result?.error) {
        setToast(result.message || "Delete failed.");
        return;
      }
      setToast(result.message || "Account deleted.");
      await load();
    } catch (err) {
      setToast(err.message || "Delete failed.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/50">
        <Link href="/dashboard/profile" className="hover:text-white">
          My Profile
        </Link>
        <span>/</span>
        <span className="text-white/80">Payment Accounts</span>
      </div>

      <PageHeader
        eyebrow="Account"
        title="Payment Accounts"
        description="Save receiving accounts for cash-out, loyalty rewards, and other payouts. You can add up to 5 accounts per type."
      />

      {pageError ? (
        <div className="mb-6 rounded-xl border border-theme-red-action/30 bg-theme-red-action/10 px-4 py-3 text-sm text-theme-red-action">
          {pageError}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading accounts…
        </div>
      ) : (
        <>
          <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Add new account</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-white/55">
                  <li>Click <span className="text-white/80">Add Account</span> below</li>
                  <li>Choose the account type (Bank, XM, Crypto, etc.)</li>
                  <li>Enter your account details in the fields that appear</li>
                  <li>Click <span className="text-white/80">Save account</span></li>
                </ol>
              </div>
              {!showAdd ? (
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Plus className="h-4 w-4" />
                  Add Account
                </button>
              ) : null}
            </div>

            {showAdd ? (
              <div className="rounded-xl border border-theme-green-action/25 bg-black/20 p-4 sm:p-5">
                <AddPaymentAccountForm
                  accountTypes={systemOptions}
                  onCancel={() => setShowAdd(false)}
                  onSuccess={async (result) => {
                    setShowAdd(false);
                    setToast(result.message || "Account added.");
                    await load();
                  }}
                />
              </div>
            ) : null}
          </section>

          <section className="space-y-8">
            {accountGroups.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-sm text-white/45">
                No saved accounts yet. Add one above to use during cash-out.
              </p>
            ) : (
              accountGroups.map((group) => (
                <div key={group.payment_option}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/55">
                    {ACCOUNT_TYPE_LABELS[group.payment_option] || group.payment_option}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {group.accounts.map((account) => (
                      <div key={`${account.accountType}-${account.id}`}>
                        <AccountCard
                          account={account}
                          onDelete={handleDelete}
                          onEdit={(acc) => setEditingId(editingId === acc.id ? null : acc.id)}
                        />
                        {editingId === account.id ? (
                          <EditAccountForm
                            account={account}
                            onCancel={() => setEditingId(null)}
                            onSaved={async (message) => {
                              setEditingId(null);
                              setToast(message || "Account updated.");
                              await load();
                            }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}

      {toast ? (
        <BottomMessage
          title="Payment accounts"
          variant="success"
          onClose={() => setToast("")}
          primaryAction={{ label: "OK", onClick: () => setToast("") }}
          secondaryAction={{ label: "Close", onClick: () => setToast("") }}
        >
          {toast}
        </BottomMessage>
      ) : null}
    </div>
  );
}
