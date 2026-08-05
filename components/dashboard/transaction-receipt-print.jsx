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
      <div className={`w-2/5 text-sm font-normal ${valueClassName}`}>: {value}</div>
    </div>
  );
}

function DepositReceiptFields({ tx }) {
  const message =
    tx.status === "Pending" ? "To be reviewed" : tx.note || "—";

  return (
    <>
      <ReceiptRow label="Status" value={tx.status} valueClassName={statusClass(tx.status)} />
      <ReceiptRow label="Transaction ID" value={tx.id} />
      <ReceiptRow label="Transaction Date" value={tx.date} />
      <ReceiptRow label="Transaction Time" value={tx.time} />
      <ReceiptRow label="Payment Amount" value={tx.paymentAmount || "—"} />
      <ReceiptRow label="Payment Option" value={tx.paymentOption || "—"} />
      <ReceiptRow label="Top up Amount" value={tx.amount || "—"} />
      <ReceiptRow label="Transaction Method" value={tx.method || "—"} />
      <ReceiptRow label="Top up Account" value={tx.account || "—"} />
      <ReceiptRow label="Message" value={message} />
    </>
  );
}

function WithdrawalReceiptFields({ tx }) {
  return (
    <>
      <ReceiptRow label="Status" value={tx.status} valueClassName={statusClass(tx.status)} />
      <ReceiptRow label="Transaction ID" value={tx.id} />
      <ReceiptRow label="Transaction Date" value={tx.date} />
      <ReceiptRow label="Transaction Time" value={tx.time} />
      <ReceiptRow label="Receiving Amount" value={tx.receivingAmount || "—"} />
      <ReceiptRow label="Receiving Method" value={tx.paymentOption || "—"} />
      <ReceiptRow label="Cashout Amount" value={tx.amount || "—"} />
      <ReceiptRow label="Transaction Method" value={tx.method || "—"} />
      <ReceiptRow label="Cashout Account" value={tx.account || "—"} />
      <ReceiptRow label="Message" value={tx.note || "—"} />
    </>
  );
}

function DepositReportFields({ tx }) {
  const message = tx.status === "Pending" ? "To be reviewed" : tx.note || "—";

  return (
    <div className="mt-6 grid grid-cols-2 gap-y-4">
      <div>
        <ReceiptRow label="Status" value={tx.status} valueClassName={statusClass(tx.status)} />
        <ReceiptRow label="Transaction ID" value={tx.id} />
        <ReceiptRow label="Transaction Date" value={tx.date} />
        <ReceiptRow label="Transaction Time" value={tx.time} />
        <ReceiptRow label="Received Amount" value={tx.paymentAmount || "—"} />
        <ReceiptRow label="Payment Method" value={tx.paymentOption || "—"} />
      </div>
      <div>
        <ReceiptRow label="Top up Amount" value={tx.amount || "—"} />
        <ReceiptRow label="Transaction Method" value={tx.method || "—"} />
        <ReceiptRow label="Top up Account ID" value={tx.account || "—"} />
        <ReceiptRow label="Message" value={message} />
      </div>
    </div>
  );
}

function WithdrawalReportFields({ tx }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-y-4">
      <div>
        <ReceiptRow label="Status" value={tx.status} valueClassName={statusClass(tx.status)} />
        <ReceiptRow label="Transaction ID" value={tx.id} />
        <ReceiptRow label="Transaction Date" value={tx.date} />
        <ReceiptRow label="Transaction Time" value={tx.time} />
        <ReceiptRow label="Receiving Amount" value={tx.receivingAmount || "—"} />
        <ReceiptRow label="Receiving Method" value={tx.paymentOption || "—"} />
      </div>
      <div>
        <ReceiptRow label="Cashout Amount" value={tx.amount || "—"} />
        <ReceiptRow label="Transaction Method" value={tx.method || "—"} />
        <ReceiptRow label="Cashout Account" value={tx.account || "—"} />
        <ReceiptRow label="Message" value={tx.note || "—"} />
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
    <div className="transaction-print-root mx-auto flex min-h-screen w-full flex-col bg-white font-poppins text-theme-blue-dark">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: #25223e !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          .transaction-print-root,
          .transaction-print-root * {
            visibility: visible;
          }
          .transaction-print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <img src="/assets/img/banner-print-top.svg" alt="" className="w-full" />

      <div className="flex w-full flex-col px-4">
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
          <div className="mx-auto mt-6 flex w-2/3 flex-col items-center py-6">
            {isWithdrawal ? (
              <WithdrawalReceiptFields tx={transactions[0]} />
            ) : (
              <DepositReceiptFields tx={transactions[0]} />
            )}
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div key={tx.id || index}>
              {isWithdrawal ? (
                <WithdrawalReportFields tx={tx} />
              ) : (
                <DepositReportFields tx={tx} />
              )}
              {index < transactions.length - 1 ? <hr className="mt-6 w-full" /> : null}
            </div>
          ))
        )}
      </div>

      {isSingle ? (
        <div className="mt-auto flex w-full justify-start px-4 text-theme-blue-panel">
          This is computer generated, No signature is required
        </div>
      ) : null}

      <img
        src="/assets/img/banner-print-bottom.svg"
        alt=""
        className={`w-full ${isSingle ? "mt-2" : "mt-auto"}`}
      />
    </div>
  );
}
