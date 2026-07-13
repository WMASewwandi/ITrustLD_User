export default function InputLabel({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`mb-1 block text-sm text-theme-black ${className}`}>
      {children}
    </label>
  );
}
