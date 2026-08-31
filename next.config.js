/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hide Next.js "Issues" badge so it does not cover the mobile bottom nav
  devIndicators: false,
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "clipboard-read=(self), clipboard-write=(self)",
          },
        ],
      },
    ];
  },
  // Incoming Laravel URLs only. Existing Next paths are unchanged.
  async redirects() {
    return [
      { source: "/accountholder/deposit", destination: "/dashboard/deposit", permanent: true },
      { source: "/accountholder/deposit/method/select", destination: "/dashboard/deposit", permanent: true },
      { source: "/accountholder/deposit/details/enter", destination: "/dashboard/deposit", permanent: true },
      { source: "/accountholder/deposit/payment-proof/upload", destination: "/dashboard/deposit", permanent: true },
      { source: "/accountholder/deposit/method/save", destination: "/dashboard/deposit", permanent: true },

      { source: "/accountholder/deposit/transactions/:transaction_id/print", destination: "/dashboard/transactions/print?transactionId=:transaction_id&type=deposit", permanent: true },
      { source: "/accountholder/deposit/transactions/print", destination: "/dashboard/transactions/print?type=deposit", permanent: true },
      { source: "/accountholder/deposit/transactions/view", destination: "/dashboard/transactions?tab=top-up", permanent: true },
      { source: "/accountholder/deposit/transactions/filter", destination: "/dashboard/transactions?tab=top-up", permanent: true },

      { source: "/accountholder/withdraw", destination: "/dashboard/withdrawal", permanent: true },
      { source: "/accountholder/withdraw/method/select", destination: "/dashboard/withdrawal", permanent: true },
      { source: "/accountholder/withdraw/details/enter", destination: "/dashboard/withdrawal", permanent: true },
      { source: "/accountholder/withdraw/payment-proof/upload", destination: "/dashboard/withdrawal", permanent: true },
      { source: "/accountholder/withdraw/method/save", destination: "/dashboard/withdrawal", permanent: true },

      { source: "/accountholder/withdraw/transactions/:transaction_id/print", destination: "/dashboard/transactions/print?transactionId=:transaction_id&type=withdrawal", permanent: true },
      { source: "/accountholder/withdraw/transactions/print", destination: "/dashboard/transactions/print?type=withdrawal", permanent: true },
      { source: "/accountholder/withdraw/transactions/view", destination: "/dashboard/transactions?tab=cash-out", permanent: true },
      { source: "/accountholder/withdraw/transactions/filter", destination: "/dashboard/transactions?tab=cash-out", permanent: true },

      { source: "/accountholder/loyalty/withdrawal", destination: "/dashboard/loyalty", permanent: true },
      { source: "/accountholder/loyalty/transactions", destination: "/dashboard/loyalty", permanent: true },
      { source: "/accountholder/loyalty/redeem-history", destination: "/dashboard/loyalty", permanent: true },
      { source: "/loyalty/check-benefits", destination: "/dashboard/loyalty", permanent: true },
      { source: "/accountholder/loyalty/my-clients", destination: "/dashboard/earnings?tab=clients", permanent: true },
      { source: "/accountholder/loyalty/sub-partners", destination: "/dashboard/earnings?tab=sub-partners", permanent: true },
      { source: "/accountholder/loyalty/vouchers-issued", destination: "/dashboard/earnings?tab=claim-vouchers", permanent: true },
      { source: "/accountholder/loyalty/client-bonus/vouchers/:id", destination: "/dashboard/earnings/vouchers/:id", permanent: true },

      { source: "/profile/view", destination: "/dashboard/profile", permanent: true },
      { source: "/profile/details/edit", destination: "/dashboard/profile", permanent: true },
      { source: "/profile/details/delete", destination: "/dashboard/profile/delete", permanent: true },
      { source: "/profile/accounts", destination: "/dashboard/profile/accounts", permanent: true },
      { source: "/profile", destination: "/dashboard/profile", permanent: true },
      { source: "/user/verification", destination: "/verify", permanent: true },
      { source: "/user/verify/email/code", destination: "/verify", permanent: true },
      { source: "/user/verify/mobile/code", destination: "/verify", permanent: true },
      { source: "/verify-email", destination: "/verify", permanent: true },
      { source: "/accountholder/banned", destination: "/banned", permanent: true },
      { source: "/register.php", destination: "/register", permanent: true },
    ];
  },
};

module.exports = nextConfig;
