import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeHead from "@/components/layouts/theme-head";
import AlpineInit from "@/components/alpine-init";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata = {
  title: "iTrustLD User Web",
  description: "Customer-facing web foundation (Day 1 UI)"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <ThemeHead />
      </head>
      <body className="font-poppins bg-white">
        <AlpineInit />
        {children}
      </body>
    </html>
  );
}
