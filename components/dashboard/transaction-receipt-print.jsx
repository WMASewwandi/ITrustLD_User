"use client";

function statusClass(status) {
  const value = String(status || "Pending");
  if (value === "Completed") return "text-theme-green-action";
  if (value === "Rejected") return "text-theme-red-action";
  if (value === "Pending") return "text-theme-orange";
  return "text-theme-blue-dark";
}

function ReceiptRow({ label, value, valueClassName = "text-theme-blue-dark" }) {
  return (
    <div className="mt-2 flex w-full">
      <div className="w-3/5 text-sm font-semibold text-theme-blue-dark">{label}</div>
      <div className={`w-2/5 text-sm font-normal ${valueClassName}`}>: {value || "—"}</div>
    </div>
  );
}

function transactionDetailRows(tx, isWithdrawal = false) {
  const rows = [
    ["Type", tx.type || (isWithdrawal ? "Cash-out" : "Top-up")],
    ["Method", tx.method],
    ["Payment Option", tx.paymentOption],
    ["Status", tx.status, statusClass(tx.status)],
    ["Currency", tx.currency],
    ["Amount", tx.amount],
    [
      isWithdrawal ? "Receiving Amount" : "Payment Amount",
      tx.receivingAmount || tx.paymentAmount || tx.amount,
    ],
    ["Fee", tx.fee],
    ["Net amount", tx.netAmount || tx.amount],
    ["Date", tx.date],
    ["Time", tx.time],
    ["Account", tx.account],
    ["Reference", tx.reference || tx.id],
    ["Note", tx.note],
  ];

  if (tx.rejectedReason) {
    rows.push(["Rejected Reason", tx.rejectedReason]);
  }

  return rows;
}

function ReceiptFields({ tx, isWithdrawal = false }) {
  return (
    <>
      {transactionDetailRows(tx, isWithdrawal).map(([label, value, valueClassName]) => (
        <ReceiptRow key={label} label={label} value={value} valueClassName={valueClassName} />
      ))}
    </>
  );
}

function ReportFields({ tx, isWithdrawal = false }) {
  const rows = transactionDetailRows(tx, isWithdrawal);
  const mid = Math.ceil(rows.length / 2);
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-8">
      <div>
        {rows.slice(0, mid).map(([label, value, valueClassName]) => (
          <ReceiptRow key={label} label={label} value={value} valueClassName={valueClassName} />
        ))}
      </div>
      <div>
        {rows.slice(mid).map(([label, value, valueClassName]) => (
          <ReceiptRow key={label} label={label} value={value} valueClassName={valueClassName} />
        ))}
      </div>
    </div>
  );
}

export default function TransactionReceiptPrint({
  title,
  transactions = [],
  isWithdrawal = false,
  isSingle = false,
}) {
  return (
    <div className="transaction-print-root mx-auto flex min-h-screen w-full flex-col bg-white font-poppins text-theme-blue-dark print:min-h-[100vh]">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          html,
          body {
            background: white !important;
            color: #25223e !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html,
          body,
          body * {
            overflow: visible !important;
          }
          .transaction-print-root {
            position: static !important;
            left: auto !important;
            top: auto !important;
            display: flex !important;
            min-height: 100vh !important;
            width: 100% !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .transaction-print-root img {
            display: block !important;
            max-width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .transaction-print-footer {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <img src="/assets/img/banner-print-top.svg" alt="" className="w-full" />

      <div className="flex w-full flex-1 flex-col px-4">
        <img
          src="/assets/img/logos/logo-itrustld-wide-dark.svg"
          alt="iTrustLD"
          className="mx-auto"
        />
        <p className="mt-4 text-center text-lg font-semibold text-theme-blue-dark">{title}</p>

        {isSingle ? <hr className="mt-2 w-full" /> : null}

        {transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-theme-blue-dark">No transactions found.</p>
        ) : isSingle ? (
          <div className="mx-auto mt-6 flex w-full max-w-xl flex-col py-4">
            <ReceiptFields tx={transactions[0]} isWithdrawal={isWithdrawal} />
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div key={tx.id || index}>
              <ReportFields tx={tx} isWithdrawal={isWithdrawal} />
              {index < transactions.length - 1 ? <hr className="mt-6 w-full" /> : null}
            </div>
          ))
        )}
      </div>

      <footer className="transaction-print-footer mt-auto w-full">
        {isSingle ? (
          <div className="flex w-full justify-start px-4 text-theme-blue-panel">
            This is computer generated, No signature is required
          </div>
        ) : null}
        <img
          src="/assets/img/banner-print-bottom.svg"
          alt=""
          className={`w-full ${isSingle ? "mt-2" : ""}`}
        />
      </footer>
    </div>
  );
}
