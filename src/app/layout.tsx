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
    "전국 중고 오토바이 당일 출장 매입 전문 넥스트바이크! 전 차종 최고가 시세, 현장 즉시 전액 입금. 30초 간편 견적 신청하세요.",
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
    "넥스트바이크",
  ],
  authors: [{ name: "넥스트바이크", url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr" }],
  creator: "넥스트바이크",
  publisher: "넥스트바이크",
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
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
    siteName: "중고오토바이매입",
    title: "중고오토바이매입 | 전국 출장 최고가 당일 현금 매입",
    description:
      "전국 중고 오토바이 당일 출장 매입 전문 넥스트바이크! 전 차종 최고가 시세, 현장 즉시 전액 입금. 30초 간편 견적 신청하세요.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "전국 중고오토바이 출장 매입",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "중고오토바이매입 | 전국 출장 최고가 당일 현금 매입",
    description:
      "전국 중고 오토바이 당일 출장 매입 전문 넥스트바이크! 전 차종 최고가 시세, 현장 즉시 전액 입금. 30초 간편 견적 신청하세요.",
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
