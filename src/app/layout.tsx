import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCta from "@/components/FloatingCta";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr"),
  alternates: {
    canonical: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
  },
  title: {
    default: "중고오토바이매입 | 전국 출장 최고가 당일 현금 매입",
    template: "%s",
  },
  description:
    "전국 중고 오토바이 당일 출장 매입 전문! 상차 전 당일 100% 선입금 안전거래, 현장 부당 감가 없이 약속된 금액 즉시 전액 입금. 방치차·사고차 전 차종 최고가 시세 30초 간편 견적.",
  keywords: [
    "오토바이매입",
    "중고오토바이",
    "중고바이크",
    "바이크매입",
    "중고오토바이매입",
    "오토바이출장매입",
    "오토바이판매",
    "스쿠터매입",
    "PCX125",
    "NMAX125",
    "포르자350",
    "XMAX300",
    "슈퍼커브110",
    "BMW바이크",
    "할리데이비슨",
    "당일선입금",
    "오토바이선입금",
  ],
  authors: [{ name: "전국중고오토바이매입", url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr" }],
  creator: "전국중고오토바이매입",
  publisher: "전국중고오토바이매입",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
    siteName: "중고오토바이매입",
    title: "중고오토바이매입 | 전국 출장 최고가 당일 현금 매입",
    description:
      "전국 중고 오토바이 당일 출장 매입 전문! 상차 전 당일 100% 선입금 안전거래, 현장 부당 감가 없이 약속된 금액 즉시 전액 입금. 방치차·사고차 전 차종 최고가 시세 30초 간편 견적.",
    images: [
      {
        url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/images/og-safe-pay.jpg",
        width: 1200,
        height: 630,
        alt: "중고오토바이매입 | 전액 100% 선입금 안전거래",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "중고오토바이매입 | 전국 출장 최고가 당일 현금 매입",
    description:
      "전국 중고 오토바이 당일 출장 매입 전문! 상차 전 당일 100% 선입금 안전거래, 현장 부당 감가 없이 약속된 금액 즉시 전액 입금. 방치차·사고차 전 차종 최고가 시세 30초 간편 견적.",
    images: ["https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/images/og-safe-pay.jpg"],
  },
  verification: {
    other: {
      "naver-site-verification": "57143900240aba13f9832a81a32a51cc89ea3805",
      "google-site-verification": "WYFHoAWz_NHCVTv25BBv3AFfguy4vXDv0njw9zby6L8",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-background text-gray-100 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-24 sm:pt-28 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <FloatingCta />
      </body>
    </html>
  );
}
