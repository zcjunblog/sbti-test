import type { Metadata } from "next";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/noto-serif-sc/500.css";
import "@fontsource/noto-serif-sc/700.css";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: {
    default: "SBTI 赛博人格测定局",
    template: "%s | SBTI",
  },
  description:
    "SBTI 赛博人格测试站，支持移动端、本地榜单与裂变分享。",
  icons: {
    icon: [
      { url: "/brand/sbti-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/brand/sbti-logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full scroll-smooth antialiased">
      <body className="min-h-full">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
