export default function TextInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md border-theme-gray-border bg-theme-gray-white text-theme-black placeholder:text-theme-gray focus:border-theme-green-action focus:ring-theme-green-action ${className}`}
      {...props}
    />
  );
}
