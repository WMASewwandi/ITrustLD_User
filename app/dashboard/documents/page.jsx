"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/page-header";
import { AlertTriangle, CheckCircle2, Clock3, Upload } from "lucide-react";

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
  "In-Progress": "text-amber-300 bg-amber-400/10 border-amber-400/25",
  Pending: "text-white/60 bg-white/5 border-white/10",
  Rejected: "text-rose-300 bg-rose-500/10 border-rose-500/25",
};

export default function DocumentsPage() {
  const [docs] = useState(INITIAL_DOCS);
  const [uploadedName, setUploadedName] = useState("");

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="KYC"
        title="Document Verification"
        description="Upload required verification documents and track status: Pending, In-Progress, or Completed. Rejected documents show the reason below."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {[
          { label: "Pending", count: docs.filter((d) => d.status === "Pending").length, icon: Clock3 },
          { label: "In-Progress", count: docs.filter((d) => d.status === "In-Progress").length, icon: Clock3 },
          { label: "Completed", count: docs.filter((d) => d.status === "Completed").length, icon: CheckCircle2 },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-white/50">
              <item.icon className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-theme-green-action" />
        <h2 className="mt-3 text-lg font-semibold text-white">Upload verification document</h2>
        <p className="mt-1 text-sm text-white/45">JPG, PNG or PDF — max 5MB (frontend demo)</p>
        <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
          Choose file
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setUploadedName(e.target.files?.[0]?.name || "")}
          />
        </label>
        {uploadedName ? (
          <p className="mt-3 text-sm text-theme-green-action">Selected: {uploadedName}</p>
        ) : null}
      </div>

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
              {docs.map((doc) => (
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
                      <span className="inline-flex items-start gap-1.5 text-rose-300">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {doc.reason}
                      </span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
