"use client";

import { useMemo, useState } from "react";
import ListFilters from "@/components/dashboard/list-filters";
import PageHeader from "@/components/dashboard/page-header";
import UploadSlot from "@/components/verify/upload-slot";
import { inDateRange, rowMatchesSearch } from "@/lib/filter-utils";
import {
  ADDRESS_DOC_TYPES,
  IDENTITY_DOC_TYPES,
  isNationalId,
} from "@/lib/verification";
import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

const DOC_FILTER_DEFAULTS = {
  search: "",
  status: "All Statuses",
  type: "All Types",
  from: "",
  to: "",
};

const INITIAL_DOCS = [
  {
    id: 1,
    name: "National ID — Front",
    type: "Identity",
    status: "Completed",
    updated: "2025-06-01",
    reason: null,
  },
  {
    id: 2,
    name: "National ID — Back",
    type: "Identity",
    status: "In-Progress",
    updated: "2025-06-10",
    reason: null,
  },
  {
    id: 3,
    name: "Proof of Address",
    type: "Residential",
    status: "Pending",
    updated: "—",
    reason: null,
  },
  {
    id: 4,
    name: "Selfie with ID",
    type: "Identity",
    status: "Rejected",
    updated: "2025-06-08",
    reason: "Image is blurry. Please upload a clear photo with all edges visible.",
  },
];

const STATUS_STYLE = {
  Completed: "text-theme-green-action bg-theme-green-action/10 border-theme-green-action/25",
  "In-Progress": "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Pending: "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Rejected: "text-theme-red-action bg-theme-red-action/10 border-theme-red-action/25",
};

const selectClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition focus:border-theme-green-action/50";

export default function DocumentsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
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

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (!rowMatchesSearch(doc, filters.search, ["name", "type", "status", "updated", "reason"])) {
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

  function submitUploads() {
    setError("");
    setSuccess("");

    if (!identityType) {
      setError("Select an identity document type.");
      return;
    }
    if (!addressType) {
      setError("Select an address document type.");
      return;
    }
    if (nationalId) {
      if (!identityFront || !identityBack) {
        setError("Upload both front and back of your National ID.");
        return;
      }
    } else if (!identityFile) {
      setError("Upload your identity document.");
      return;
    }
    if (!addressFile) {
      setError("Upload your address document.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const nextRows = [];

    if (nationalId) {
      nextRows.push(
        {
          id: Date.now() + 1,
          name: `National ID — Front (${identityFront.name})`,
          type: "Identity",
          status: "Pending",
          updated: today,
          reason: null,
        },
        {
          id: Date.now() + 2,
          name: `National ID — Back (${identityBack.name})`,
          type: "Identity",
          status: "Pending",
          updated: today,
          reason: null,
        }
      );
    } else {
      nextRows.push({
        id: Date.now() + 1,
        name: `${identityType} (${identityFile.name})`,
        type: "Identity",
        status: "Pending",
        updated: today,
        reason: null,
      });
    }

    nextRows.push({
      id: Date.now() + 3,
      name: `${addressType} (${addressFile.name})`,
      type: "Residential",
      status: "Pending",
      updated: today,
      reason: null,
    });

    setDocs((prev) => [...nextRows, ...prev]);
    setIdentityFront(null);
    setIdentityBack(null);
    setIdentityFile(null);
    setAddressFile(null);
    setSuccess("Documents submitted for review (demo). Status set to Pending.");
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="KYC"
        title="Document Verification"
        description="Upload required verification documents and track status: Pending, In-Progress, or Completed. Rejected documents show the reason below."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {[
          {
            label: "Pending",
            count: docs.filter((d) => d.status === "Pending").length,
            icon: Clock3,
            tone: "text-theme-orange",
          },
          {
            label: "In-Progress",
            count: docs.filter((d) => d.status === "In-Progress").length,
            icon: Clock3,
            tone: "text-theme-orange",
          },
          {
            label: "Completed",
            count: docs.filter((d) => d.status === "Completed").length,
            icon: CheckCircle2,
            tone: "text-theme-green-action",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className={`flex items-center gap-2 ${item.tone}`}>
              <item.icon className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{item.count}</p>
          </div>
        ))}
      </div>

      <section className="mb-8 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0B1020] px-4 text-sm font-medium text-white/50">Document Verification</span>
          </div>
        </div>

        <div className="grid min-w-0 gap-8 lg:grid-cols-2">
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
                  />
                  <UploadSlot
                    theme="dark"
                    label="Back"
                    value={identityBack}
                    onChange={setIdentityBack}
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <UploadSlot theme="dark" value={identityFile} onChange={setIdentityFile} />
                </div>
              )
            ) : (
              <p className="mt-4 text-sm text-white/40">Select a document type to upload identity files.</p>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">Confirm your address identity</h2>
            <select
              className={`${selectClass} mt-3`}
              value={addressType}
              onChange={(e) => {
                setAddressType(e.target.value);
                setAddressFile(null);
                setError("");
                setSuccess("");
              }}
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
                <UploadSlot theme="dark" value={addressFile} onChange={setAddressFile} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/40">Select a document type to upload proof of address.</p>
            )}
          </div>
        </div>

        <p className="mt-5 text-sm text-white/45">JPG, PNG or PDF — max 5MB (frontend demo)</p>
        {error ? <p className="mt-3 text-sm text-theme-red-action">{error}</p> : null}
        {success ? <p className="mt-3 text-sm text-theme-green-action">{success}</p> : null}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={submitUploads}
            className="rounded-xl bg-theme-green-action px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Submit
          </button>
        </div>
      </section>

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
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/30 text-xs uppercase tracking-wide text-white/40">
              <tr>
                <th className="px-5 py-3 font-medium">Document</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-sm text-white/55">
                    No documents match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="border-t border-white/8 text-white/80">
                    <td className="px-5 py-4 font-medium text-white">{doc.name}</td>
                    <td className="px-5 py-4">{doc.type}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[doc.status]}`}
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
      </div>
    </div>
  );
}
