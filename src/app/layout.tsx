import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "موتورپلاس | خدمات و قطعات موتورسیکلت",
  description: "درخواست تعمیر، سرویس و تهیه قطعات موتورسیکلت در ساری؛ با قیمت‌گیری و تأیید قبل از انجام.",
  applicationName: "Motor Platform"
};

export const viewport: Viewport = {
  themeColor: "#171512",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}