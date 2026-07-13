export default function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-[4px] border border-theme-blue-dark px-11 py-3 text-sm font-medium text-theme-black transition hover:bg-theme-gray-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
