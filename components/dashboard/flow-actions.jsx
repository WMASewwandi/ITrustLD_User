import { ArrowRight, Loader2 } from "lucide-react";

const backClass =
  "inline-flex min-h-12 min-w-0 w-full items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50 sm:w-auto sm:px-7";

const nextClass =
  "inline-flex min-h-12 min-w-0 w-full items-center justify-center gap-2 rounded-xl bg-theme-green-action px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 sm:w-auto sm:px-7";

export default function FlowActions({ onBack, onNext, nextLabel = "Next", busy = false }) {
  return (
    <div
      className={
        onBack
          ? "mt-8 grid w-full grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end"
          : "mt-8 flex w-full sm:justify-end"
      }
    >
      {onBack ? (
        <button type="button" onClick={onBack} disabled={busy} className={backClass}>
          Back
        </button>
      ) : null}
      <button
        type="button"
        onClick={onNext}
        disabled={busy}
        className={`${nextClass} ${onBack ? "" : "w-full sm:w-auto"}`}
      >
        {busy ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : null}
        {nextLabel}
        <ArrowRight className="h-4 w-4 shrink-0" />
      </button>
    </div>
  );
}
