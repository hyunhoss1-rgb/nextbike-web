import React from "react";
import { FAQS } from "@/data/faqs";

interface JsonLdProps {
  type?: "main" | "region" | "model";
  regionName?: string;
  modelName?: string;
  canonicalUrl?: string;
}

export default function JsonLd({
  type = "main",
  regionName,
  modelName,
  canonicalUrl = "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
}: JsonLdProps) {
  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/#organization",
    name: "넥스트바이크",
    alternateName: "NEXTBIKE",
    url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
    telephone: "010-4895-2487",
    address: {
      "@type": "PostalAddress",
      streetAddress: "은행동 301-25 1층",
      addressLocality: "시흥시",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    sameAs: [
      "https://blog.naver.com/bhh0820",
      "https://www.instagram.com/next___bike",
    ],
    areaServed: "KR",
    description:
      "중고 오토바이 출장 매입 전문 넥스트바이크. 당일 집 앞 방문, 실차 확인 후 전액 즉시 계좌입금. 스쿠터, 수입 바이크, 사고차, 방치차 전 차종 매입 상담.",
  };

  // 2. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "넥스트바이크",
    url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
    inLanguage: "ko-KR",
  };

  // 3. LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: regionName ? `넥스트바이크 · ${regionName} 오토바이매입` : "넥스트바이크 (NEXTBIKE)",
    telephone: "010-4895-2487",
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: "은행동 301-25 1층",
      addressLocality: regionName || "시흥시",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    priceRange: "₩₩",
    areaServed: regionName ? regionName : "대한민국 전역",
    openingHours: "Mo-Su 00:00-24:00",
  };

  // 4. Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: regionName
      ? `${regionName} 오토바이 매입 및 무료 출장 견적`
      : modelName
      ? `${modelName} 중고 매입 및 최고가 시세 감정`
      : "중고 오토바이 전국 출장 매입",
    provider: {
      "@type": "Organization",
      name: "넥스트바이크",
      telephone: "010-4895-2487",
    },
    areaServed: regionName || "KR",
  };

  // 5. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // 6. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr",
      },
      ...(regionName
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "전국 오토바이 매입",
              item: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/regions",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: regionName,
              item: canonicalUrl,
            },
          ]
        : modelName
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "기종별 매입",
              item: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: modelName,
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {breadcrumbSchema.itemListElement.length > 1 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
