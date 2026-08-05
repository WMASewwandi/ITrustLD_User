import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeHead from "@/components/layouts/theme-head";
import AlpineInit from "@/components/alpine-init";
import SmoothScroll from "@/components/smooth-scroll";
import AppProviders from "@/components/app-providers";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <ThemeHead />
      </head>
      <body className="font-poppins bg-white">
        <AppProviders>
          <AlpineInit />
          <SmoothScroll>{children}</SmoothScroll>
        </AppProviders>
      </body>
    </html>
  );
}
