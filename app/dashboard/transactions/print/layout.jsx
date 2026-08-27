export default function TransactionsPrintLayout({ children }) {
  return (
    <div className="bg-white">
      <link rel="preload" as="image" href="/assets/img/banner-print-top.svg" />
      <link rel="preload" as="image" href="/assets/img/banner-print-bottom.svg" />
      <link rel="preload" as="image" href="/assets/img/logos/logo-itrustld-wide-dark.svg" />
      {children}
    </div>
  );
}
