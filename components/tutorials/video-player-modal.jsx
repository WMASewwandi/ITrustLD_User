"use client";

export default function VideoPlayerModal({ tutorial, onClose }) {
  if (!tutorial) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={tutorial.title}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#12172A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
            {tutorial.subtitle ? <p className="mt-1 text-sm text-white/60">{tutorial.subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            title={tutorial.title}
            src={`${tutorial.embedUrl}?autoplay=1`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
