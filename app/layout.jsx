import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeHead from "@/components/layouts/theme-head";
import KycBootScript from "@/components/layouts/kyc-boot-script";
import AlpineInit from "@/components/alpine-init";
import SmoothScroll from "@/components/smooth-scroll";
import AppProviders from "@/components/app-providers";
import MobileViewportFix from "@/components/layouts/mobile-viewport-fix";
import WebViewAuthBridge from "@/components/layouts/webview-auth-bridge";
import LoggedInAccessGate from "@/components/layouts/logged-in-access-gate";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata = {
  title: "iTrustLD User Web",
  description: "Customer-facing web foundation (Day 1 UI)",
  icons: {
    icon: [{ url: "/assets/img/logos/favicon.svg", type: "image/svg+xml" }],
    apple: "/assets/img/logos/favicon.svg"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <ThemeHead />
        <KycBootScript />
      </head>
      <body className="font-poppins bg-[#070B16] text-white antialiased">
        <AppProviders>
          <AlpineInit />
          <WebViewAuthBridge />
          <MobileViewportFix />
          <SmoothScroll>
            <LoggedInAccessGate>{children}</LoggedInAccessGate>
          </SmoothScroll>
        </AppProviders>
      </body>
    </html>
  );
}
