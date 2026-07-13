export default function FeatureCard({ title, description, variant = "filled" }) {
  const baseClass = "rounded-xl p-6";
  const variantClass =
    variant === "bordered"
      ? "border border-theme-green-dark bg-white text-theme-blue-dark"
      : "bg-theme-green-dark text-white";

  return (
    <article className={`${baseClass} ${variantClass}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm opacity-90">{description}</p>
    </article>
  );
}
