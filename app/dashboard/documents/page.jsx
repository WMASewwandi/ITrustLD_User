"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ListFilters from "@/components/dashboard/list-filters";
import PageHeader from "@/components/dashboard/page-header";
import UploadSlot from "@/components/verify/upload-slot";
import { uploadVerificationDocuments, hasUserSession } from "@/lib/auth";
import { fetchDashboard, notifyUserNotificationsRefresh } from "@/lib/dashboard";
import { fetchVerificationDocuments, mapDocumentRows } from "@/lib/documents-api";
import { inDateRange, rowMatchesSearch } from "@/lib/filter-utils";
import {
  ADDRESS_DOC_TYPES,
  ADDRESS_TYPE_FROM_API,
  ADDRESS_TYPE_TO_API,
  IDENTITY_DOC_TYPES,
  IDENTITY_TYPE_FROM_API,
  IDENTITY_TYPE_TO_API,
  isNationalId,
} from "@/lib/verification";
import { AlertTriangle, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";

const DOC_FILTER_DEFAULTS = {
  search: "",
  status: "All Statuses",
  type: "All Types",
  from: "",
  to: "",
};

const STATUS_STYLE = {
  Completed: "text-theme-green-action bg-theme-green-action/10 border-theme-green-action/25",
  "In-Progress": "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Pending: "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Rejected: "text-theme-red-action bg-theme-red-action/10 border-theme-red-action/25",
};

const selectClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition focus:border-theme-green-action/50";

export default function DocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [docs, setDocs] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  });
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [canUploadDocuments, setCanUploadDocuments] = useState(false);
  const [canUploadIdentity, setCanUploadIdentity] = useState(false);
  const [canUploadAddress, setCanUploadAddress] = useState(false);
  const [identityType, setIdentityType] = useState("");
  const [addressType, setAddressType] = useState("");
  const [identityFront, setIdentityFront] = useState(null);
  const [identityBack, setIdentityBack] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState(DOC_FILTER_DEFAULTS);

  const nationalId = isNationalId(identityType);
  const showUploadForm = canUploadDocuments && (canUploadIdentity || canUploadAddress);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchVerificationDocuments();
      setDocs(mapDocumentRows(data.documents || []));
      setSummary(data.summary || { pending: 0, in_progress: 0, completed: 0, rejected: 0 });
      setVerificationComplete(Boolean(data.verification_complete));
      setCanUploadDocuments(Boolean(data.can_upload_documents));
      setCanUploadIdentity(Boolean(data.can_upload_identity));
      setCanUploadAddress(Boolean(data.can_upload_address));

      if (data.identity_document_type) {
        setIdentityType(IDENTITY_TYPE_FROM_API[data.identity_document_type] || "");
      }
      if (data.address_document_type) {
        setAddressType(ADDRESS_TYPE_FROM_API[data.address_document_type] || "");
      }
    } catch (err) {
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login");
      return;
    }
    loadDocuments();
  }, [loadDocuments, router]);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (
        !rowMatchesSearch(doc, filters.search, [
          "name",
          "type",
          "documentType",
          "status",
          "updated",
          "reason",
        ])
      ) {
        return false;
      }
      if (filters.status !== "All Statuses" && doc.status !== filters.status) return false;
      if (filters.type !== "All Types" && doc.type !== filters.type) return false;
      if (doc.updated && doc.updated !== "—" && !inDateRange(doc.updated, filters.from, filters.to)) {
        return false;
      }
      if ((filters.from || filters.to) && (!doc.updated || doc.updated === "—")) {
        return false;
      }
      return true;
    });
  }, [docs, filters]);

  async function submitUploads() {
    setError("");
    setSuccess("");

    const uploadingIdentity = canUploadIdentity;
    const uploadingAddress = canUploadAddress;

    if (!uploadingIdentity && !uploadingAddress) {
      setError("No documents are required for upload at this time.");
      return;
    }

    if (uploadingIdentity) {
      if (!identityType) {
        setError("Select an identity document type.");
        return;
      }
      if (nationalId) {
        if (!identityFront?.file || !identityBack?.file) {
          setError("Upload both front and back of your National ID.");
          return;
        }
      } else if (!identityFile?.file) {
        setError("Upload your identity document.");
        return;
      }
    }

    if (uploadingAddress) {
      if (!addressType) {
        setError("Select an address document type.");
        return;
      }
      if (!addressFile?.file) {
        setError("Upload your address document.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await uploadVerificationDocuments({
        identity_document_type: uploadingIdentity ? IDENTITY_TYPE_TO_API[identityType] : undefined,
        address_document_type: uploadingAddress ? ADDRESS_TYPE_TO_API[addressType] : undefined,
        identity_document: uploadingIdentity
          ? nationalId
            ? identityFront.file
            : identityFile.file
          : undefined,
        identity_document_back: uploadingIdentity && nationalId ? identityBack.file : undefined,
        address_document: uploadingAddress ? addressFile.file : undefined,
      });

      setIdentityFront(null);
      setIdentityBack(null);
      setIdentityFile(null);
      setAddressFile(null);

      await Promise.all([loadDocuments(), fetchDashboard({ force: true }).catch(() => null)]);
      notifyUserNotificationsRefresh();

      if (result.step === "pending" || result.step === "complete") {
        setSuccess("Documents submitted successfully. Our team will review them shortly.");
      } else {
        setSuccess(result.message || "Documents uploaded successfully.");
      }
    } catch (err) {
      setError(err.message || "Failed to upload documents.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="KYC"
        title="Document Verification"
        description="Upload required verification documents and track status: Pending, In-Progress, Completed, or Rejected."
      />

      {verificationComplete ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-theme-green-action/25 bg-theme-green-action/10 px-4 py-3 text-sm text-theme-green-action">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Your account verification is complete. All documents are approved.</span>
        </div>
      ) : null}

      {!canUploadDocuments && !verificationComplete ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-theme-orange/25 bg-theme-orange/10 px-4 py-3 text-sm text-theme-orange">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Verify your email and mobile number before uploading documents.{" "}
            <Link href="/verify" className="font-semibold underline">
              Go to verification
            </Link>
          </span>
        </div>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending", count: summary.pending, icon: Clock3, tone: "text-theme-orange" },
          { label: "In-Progress", count: summary.in_progress, icon: Clock3, tone: "text-theme-orange" },
          { label: "Completed", count: summary.completed, icon: CheckCircle2, tone: "text-theme-green-action" },
          { label: "Rejected", count: summary.rejected, icon: AlertTriangle, tone: "text-theme-red-action" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className={`flex items-center gap-2 ${item.tone}`}>
              <item.icon className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{loading ? "—" : item.count}</p>
          </div>
        ))}
      </div>

      {showUploadForm ? (
        <section className="mb-8 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0B1020] px-4 text-sm font-medium text-white/50">
                {canUploadIdentity && canUploadAddress
                  ? "Upload documents"
                  : canUploadIdentity
                    ? "Re-upload identity document"
                    : "Re-upload address document"}
              </span>
            </div>
          </div>

          <div className="grid min-w-0 gap-8 lg:grid-cols-2">
            {canUploadIdentity ? (
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">Confirm your identity</h2>
                <select
                  className={`${selectClass} mt-3`}
                  value={identityType}
                  onChange={(e) => {
                    setIdentityType(e.target.value);
                    setIdentityFront(null);
                    setIdentityBack(null);
                    setIdentityFile(null);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={submitting}
                >
                  <option value="">Select Document Type</option>
                  {IDENTITY_DOC_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {identityType ? (
                  nationalId ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <UploadSlot
                        theme="dark"
                        label="Front"
                        value={identityFront}
                        onChange={setIdentityFront}
                        onError={setError}
                      />
                      <UploadSlot
                        theme="dark"
                        label="Back"
                        value={identityBack}
                        onChange={setIdentityBack}
                        onError={setError}
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <UploadSlot
                        theme="dark"
                        value={identityFile}
                        onChange={setIdentityFile}
                        onError={setError}
                      />
                    </div>
                  )
                ) : (
                  <p className="mt-4 text-sm text-white/40">Select a document type to upload identity files.</p>
                )}
              </div>
            ) : (
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/50">
                Identity document received. No upload needed unless rejected by admin.
              </div>
            )}

            {canUploadAddress ? (
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">Confirm your address</h2>
                <select
                  className={`${selectClass} mt-3`}
                  value={addressType}
                  onChange={(e) => {
                    setAddressType(e.target.value);
                    setAddressFile(null);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={submitting}
                >
                  <option value="">Select Document Type</option>
                  {ADDRESS_DOC_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {addressType ? (
                  <div className="mt-4">
                    <UploadSlot theme="dark" value={addressFile} onChange={setAddressFile} onError={setError} />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-white/40">Select a document type to upload proof of address.</p>
                )}
              </div>
            ) : (
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/50">
                Address document received. No upload needed unless rejected by admin.
              </div>
            )}
          </div>

          <p className="mt-5 text-sm text-white/45">JPG, PNG, GIF, BMP or WebP — max 5MB per file</p>
          {error ? <p className="mt-3 text-sm text-theme-red-action">{error}</p> : null}
          {success ? <p className="mt-3 text-sm text-theme-green-action">{success}</p> : null}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={submitUploads}
              disabled={submitting}
              className="rounded-xl bg-theme-green-action px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </section>
      ) : !verificationComplete ? (
        <section className="mb-8 rounded-2xl border border-white/12 bg-[#141A2E] px-5 py-6 text-sm text-white/55">
          Your documents are under review or awaiting admin action. You will be notified once verification is complete.
        </section>
      ) : null}

      <ListFilters
        search={filters.search}
        onSearchChange={(v) => setFilters((p) => ({ ...p, search: v }))}
        searchPlaceholder="Search document name, type, notes…"
        filters={[
          {
            key: "status",
            label: "Status",
            options: ["All Statuses", "Pending", "In-Progress", "Completed", "Rejected"],
          },
          {
            key: "type",
            label: "Type",
            options: ["All Types", "Identity", "Residential"],
          },
        ]}
        values={filters}
        onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
        showDates
        from={filters.from}
        to={filters.to}
        onFromChange={(v) => setFilters((p) => ({ ...p, from: v }))}
        onToChange={(v) => setFilters((p) => ({ ...p, to: v }))}
        onReset={() => setFilters(DOC_FILTER_DEFAULTS)}
        resultCount={filteredDocs.length}
      />

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="border-b border-white/10 bg-white/[0.04] px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Verification status table</h2>
        </div>
        {loading ? (
          <div className="px-5 py-10 text-sm text-white/50">Loading documents…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-black/30 text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Document</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Doc. type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                  <th className="px-5 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-sm text-white/55">
                      No documents match your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-t border-white/8 text-white/80">
                      <td className="px-5 py-4 font-medium text-white">{doc.name}</td>
                      <td className="px-5 py-4">{doc.type}</td>
                      <td className="px-5 py-4 text-white/60">{doc.documentType}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[doc.status] || STATUS_STYLE.Pending}`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/50">{doc.updated}</td>
                      <td className="px-5 py-4">
                        {doc.reason ? (
                          <span className="inline-flex items-start gap-1.5 text-theme-red-action">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {doc.reason}
                          </span>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
