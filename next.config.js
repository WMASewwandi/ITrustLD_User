/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hide Next.js "Issues" badge so it does not cover the mobile bottom nav
  devIndicators: false,
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
};

module.exports = nextConfig;
