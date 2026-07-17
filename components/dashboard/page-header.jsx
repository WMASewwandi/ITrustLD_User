export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-white/50">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
