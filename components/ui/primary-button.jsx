export default function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-[4px] border border-theme-green-action bg-theme-green-action px-11 py-3 text-sm font-medium text-white transition hover:brightness-110 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
