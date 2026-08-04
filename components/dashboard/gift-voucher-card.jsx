"use client";

// Prefer local copies under /public/assets/img (mirrors Laravel assets).
// Override with NEXT_PUBLIC_VOUCHER_ASSET_BASE if serving from another host.
const VOUCHER_ASSET_BASE = (process.env.NEXT_PUBLIC_VOUCHER_ASSET_BASE || "/assets/img").replace(
  /\/$/,
  "",
);

const LEFT_BG = `${VOUCHER_ASSET_BASE}/banner-voucher-client-bonus-left.png`;
const LOGO_WIDE = `${VOUCHER_ASSET_BASE}/logo-itrustld-wide.png`;
const GIFT_TITLE = `${VOUCHER_ASSET_BASE}/banner-gift-voucher.png`;
const TOP_RIGHT = `${VOUCHER_ASSET_BASE}/banner-voucher-bg-green-top-right.png`;
const FOOTER_BR = `${VOUCHER_ASSET_BASE}/banner-voucher-br.png`;
const FOOTER_BL = `${VOUCHER_ASSET_BASE}/banner-voucher-bl.png`;

function parseAmount(value) {
  if (typeof value === "number") return value;
  const n = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Matches Laravel `loyalty-client-bonus-voucher.blade.php` layout.
 */
export default function GiftVoucherCard({ voucher, accountHolder, className = "" }) {
  const amount = parseAmount(voucher?.amount ?? voucher?.amount_display);
  const amountLabel = Number.isInteger(amount) ? String(amount) : amount.toFixed(0);
  const platformId = voucher?.platform_id || voucher?.platformId || "—";
  const method = voucher?.topup_method || voucher?.method || voucher?.topupMethod || "—";
  const firstName = accountHolder?.first_name || accountHolder?.firstName || "";
  const lastName = accountHolder?.last_name || accountHolder?.lastName || "";
  const accountNumber = accountHolder?.account_number || accountHolder?.accountNumber || "—";

  return (
    <article
      className={`w-full overflow-hidden border border-black bg-white text-[#0B1020] shadow-md ${className}`}
    >
      <div className="flex min-w-[720px] flex-nowrap md:min-w-0">
        {/* Left — same structure as Laravel */}
        <div className="relative w-2/5 min-h-[420px] bg-[#0B1B4D] md:min-h-[520px] lg:h-[650px] lg:max-h-[650px]">
          <img
            src={LEFT_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col">
            <div className="flex h-full w-full flex-col">
              <img
                src={LOGO_WIDE}
                alt="iTrustLD"
                className="mx-auto mt-[80px] h-auto w-1/2 md:mt-[120px] lg:mt-[200px]"
              />
              <div className="mx-auto mb-auto flex flex-wrap items-center text-[#FBC351]">
                <div
                  className="flex h-full w-auto items-center text-5xl font-bold lg:text-7xl"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  ${amountLabel}
                </div>
                <div className="ml-3 border-l-2 border-[#FBC351] pl-3 text-xl lg:text-2xl">
                  <div>{firstName || "—"}</div>
                  <div className="font-bold">{lastName}</div>
                </div>
              </div>
              <div className="mb-0 flex flex-wrap items-center justify-between px-4 text-sm text-white lg:px-6 lg:text-lg">
                <p>ID: {accountNumber}</p>
                <p>www.ItrustLD.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — same structure as Laravel */}
        <div className="flex w-3/5 min-h-[420px] flex-col md:min-h-[520px] lg:h-[650px] lg:max-h-[650px]">
          <img src={TOP_RIGHT} alt="" className="ml-auto h-auto w-auto max-w-[45%]" />
          <img src={GIFT_TITLE} alt="Gift voucher" className="ml-5 mt-1 h-auto w-1/2" />
          <p className="px-4 py-4 text-sm font-medium text-[#0B1020] lg:px-6 lg:py-6 lg:text-base">
            Login to the iTrustLD. Go to the deposit section. Please choose the {method} option. Choose
            the USD currency. Then enter the amount {amountLabel} USD currency. The amount payable and
            the amount you will receive will then be displayed. Then click Next and proceed to the next
            step. Then upload the voucher in the upload area. Then click the submit button. Then check
            your wallet.
          </p>
          <div className="mb-auto flex flex-wrap items-center justify-start px-4 py-4 lg:px-6 lg:py-6">
            <p className="text-base font-medium text-[#0B1020] lg:text-lg">Platform Id:</p>
            <div className="ml-3 rounded-full bg-black/10 px-4 py-2 text-base font-medium text-[#0B1020] lg:text-lg">
              {platformId}
            </div>
            <div className="ml-3 rounded-full bg-black/10 px-4 py-2 text-base font-medium text-[#0B1020] lg:text-lg">
              {method}
            </div>
          </div>
          <div className="flex items-center justify-start px-4 text-sm text-[#64748B] lg:px-6 lg:text-base">
            <p>This is computer generated, No signature is required</p>
          </div>
          <div className="flex w-full flex-nowrap">
            <img src={FOOTER_BR} alt="" className="h-6 w-1/2 object-contain" />
            <img src={FOOTER_BL} alt="" className="h-6 w-1/2 object-contain" />
          </div>
        </div>
      </div>
    </article>
  );
}
