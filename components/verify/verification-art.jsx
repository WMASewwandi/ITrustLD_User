export default function VerificationArt({ className = "" }) {
  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`} aria-hidden>
      <svg viewBox="0 0 420 280" className="h-auto w-full" fill="none">
        <rect x="210" y="28" width="170" height="230" rx="28" fill="#E8EEF5" stroke="#CFD8E3" strokeWidth="3" />
        <circle cx="295" cy="78" r="28" fill="#D5DEE9" />
        <rect x="248" y="120" width="94" height="10" rx="5" fill="#D5DEE9" />
        <rect x="258" y="140" width="74" height="8" rx="4" fill="#E3E9F1" />
        <circle cx="295" cy="188" r="42" fill="#E53935" />
        <path
          d="M275 188.5l12 12 28-30"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="118" cy="238" rx="70" ry="12" fill="#E6EBF2" />
        <rect x="78" y="118" width="78" height="110" rx="18" fill="#B8C0CC" />
        <circle cx="117" cy="92" r="28" fill="#F0C7B0" />
        <path d="M90 78c10-22 44-22 54 0" stroke="#2F3542" strokeWidth="8" strokeLinecap="round" />
        <rect x="98" y="150" width="48" height="70" rx="10" fill="#5B6575" />
        <rect x="148" y="168" width="18" height="36" rx="8" fill="#F0C7B0" />
        <rect x="156" y="198" width="28" height="40" rx="8" fill="#2F3542" />
      </svg>
    </div>
  );
}
