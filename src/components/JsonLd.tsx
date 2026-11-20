import React from "react";
import { FAQS } from "@/data/faqs";

const BASE_URL = "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr";
const OG_IMAGE_URL = `${BASE_URL}/images/og-safe-pay.jpg`;

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface JsonLdProps {
  type?: "main" | "region" | "model" | "magazine" | "legal";
  regionName?: string;
  modelName?: string;
  modelBrand?: string;
  modelDescription?: string;
  modelPriceRange?: string;
  canonicalUrl?: string;
  articleTitle?: string;
  articleDescription?: string;
  articleDate?: string;
  articleAuthor?: string;
  articleTags?: string[];
  articleFaq?: FaqItem[];
  breadcrumbItems?: BreadcrumbItem[];
  includeFaq?: boolean;
}

function toKstIsoDate(dateStr?: string): string {
  if (!dateStr) return "2026-09-01T00:00:00+09:00";
  if (dateStr.includes("T")) return dateStr;
  return `${dateStr}T00:00:00+09:00`;
}

export default function JsonLd({
  type = "main",
  regionName,
  modelName,
  modelBrand,
  modelDescription,
  modelPriceRange,
  canonicalUrl = BASE_URL,
  articleTitle,
  articleDescription,
  articleDate,
  articleAuthor,
  articleTags,
  articleFaq,
  breadcrumbItems,
  includeFaq,
}: JsonLdProps) {
  const isHome = canonicalUrl === BASE_URL || canonicalUrl === `${BASE_URL}/`;
  const isLegal = type === "legal";

  // 1. Organization Schema (구글 브랜드 엔티티 & Knowledge Graph 연동)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "넥스트바이크 (전국중고오토바이매입)",
    alternateName: [
      "넥스트바이크",
      "NEXTBIKE",
      "전국중고오토바이매입",
      "중고오토바이매입",
      "중고오토바이출장매입",
    ],
    url: BASE_URL,
    telephone: "+82-10-4895-2487",
    address: {
      "@type": "PostalAddress",
      streetAddress: "은행동 301-25 1층",
      addressLocality: "시흥시",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-10-4895-2487",
      contactType: "customer service",
      areaServed: "KR",
      availableLanguage: ["Korean"],
    },
    sameAs: [
      "https://www.xn--b60bj1s89e3pf91mzkd.com/",
      "https://blog.naver.com/bhh0820",
      "https://www.instagram.com/next___bike",
    ],
    areaServed: "KR",
    image: OG_IMAGE_URL,
    logo: {
      "@type": "ImageObject",
      url: OG_IMAGE_URL,
      width: 1376,
      height: 768,
    },
    description:
      "전국 중고 오토바이 당일 출장 매입 전문 넥스트바이크. 상차 전 당일 100% 선입금 안전거래, 실차 확인 후 전액 즉시 계좌입금. 국내 정식발매 내연기관 전 기종, 방치차·사고차 매입 상담.",
  };

  // 2. WebSite Schema (구글 검색 결과 사이트명·Site Name 공식 지정용 — 홈 페이지 출력)
  const webSiteSchema = isHome
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "전국중고오토바이매입 · 넥스트바이크",
        alternateName: ["넥스트바이크", "중고오토바이매입", "NEXTBIKE"],
        url: BASE_URL,
        inLanguage: "ko-KR",
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
      }
    : null;

  // 3. WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    name: regionName
      ? `${regionName} 오토바이매입 | 중고바이크 당일 출장매입`
      : modelName
      ? `${modelName} 매입 | 중고 시세 최고가 당일 현금 매입`
      : articleTitle || "전국중고오토바이매입 · 넥스트바이크",
    url: canonicalUrl,
    inLanguage: "ko-KR",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    about: {
      "@id": `${BASE_URL}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: OG_IMAGE_URL,
      width: 1376,
      height: 768,
    },
    image: OG_IMAGE_URL,
  };

  // 4. LocalBusiness / MotorcycleDealer Schema
  // 중요: 실제 본사 물리 주소(경기도 시흥시 은행동 301-25 1층)를 모든 페이지에서 일관되게 유지하고,
  // 출장 대상 지역은 areaServed로만 명시하여 구글 로컬 스팸 필터를 100% 준수합니다.
  const localBusinessSchema = !isLegal
    ? {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "MotorcycleDealer"],
        "@id": `${BASE_URL}/#localbusiness`,
        name: "넥스트바이크 (전국중고오토바이매입)",
        telephone: "+82-10-4895-2487",
        url: BASE_URL,
        address: {
          "@type": "PostalAddress",
          streetAddress: "은행동 301-25 1층",
          addressLocality: "시흥시",
          addressRegion: "경기도",
          addressCountry: "KR",
        },
        priceRange: "₩₩",
        areaServed: regionName
          ? [
              { "@type": "AdministrativeArea", name: regionName },
              { "@type": "Country", name: "대한민국" },
            ]
          : { "@type": "Country", name: "대한민국" },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
        ],
        image: OG_IMAGE_URL,
        parentOrganization: {
          "@id": `${BASE_URL}/#organization`,
        },
      }
    : null;

  // 5. Service Schema (비법적 상업 페이지 전용)
  const serviceSchema = !isLegal
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: regionName
          ? `${regionName} 오토바이·중고바이크 당일 출장 매입`
          : modelName
          ? `${modelName} 중고 오토바이 최고가 매입`
          : "전국 중고 오토바이·중고바이크 당일 출장 매입",
        serviceType: regionName
          ? `${regionName} 오토바이·중고바이크 매입 및 무료 출장 견적`
          : modelName
          ? `${modelBrand ? `${modelBrand} ` : ""}${modelName} 중고 매입 및 최고가 시세 감정`
          : "중고 오토바이·중고바이크 전국 출장 매입",
        description:
          modelDescription ||
          (regionName
            ? `${regionName} 전역 당일 무료 출장 오토바이 매입, 상차 전 100% 선입금 안전거래 및 구청 서류 무료 대행.`
            : "전국 중고 오토바이 당일 무료 출장 매입, 상차 전 100% 선입금 안전거래."),
        provider: {
          "@id": `${BASE_URL}/#organization`,
        },
        image: OG_IMAGE_URL,
        areaServed: regionName
          ? { "@type": "AdministrativeArea", name: regionName }
          : { "@type": "Country", name: "대한민국" },
        ...(modelPriceRange
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: "KRW",
                description: `평균 매입 시세 범위: ${modelPriceRange}`,
                url: canonicalUrl,
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      }
    : null;

  // 6. FAQPage Schema — 실제 페이지 본문에 FAQ가 노출되는 페이지에만 정확히 일치시켜 출력
  // (구글 구조화 데이터 정책: 화면에 없는 숨겨진 FAQ 스키마 남발 방지)
  const shouldEmitGlobalFaq =
    includeFaq ?? (isHome || type === "region" || type === "model");
  const faqEntries: FaqItem[] =
    type === "magazine"
      ? articleFaq && articleFaq.length > 0
        ? articleFaq
        : []
      : shouldEmitGlobalFaq
      ? FAQS
      : [];

  const faqSchema =
    faqEntries.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntries.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // 7. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement:
      breadcrumbItems && breadcrumbItems.length > 0
        ? breadcrumbItems.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            item: b.item,
          }))
        : [
            {
              "@type": "ListItem",
              position: 1,
              name: "홈",
              item: BASE_URL,
            },
            ...(regionName
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "전국 오토바이매입",
                    item: `${BASE_URL}/regions`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: regionName.includes("오토바이")
                      ? regionName
                      : `${regionName} 오토바이매입`,
                    item: canonicalUrl,
                  },
                ]
              : modelName
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "기종별 오토바이매입",
                    item: `${BASE_URL}/models`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: modelName.includes("오토바이")
                      ? modelName
                      : `${modelName} 오토바이매입`,
                    item: canonicalUrl,
                  },
                ]
              : articleTitle
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "매거진",
                    item: `${BASE_URL}/magazine`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: articleTitle,
                    item: canonicalUrl,
                  },
                ]
              : []),
          ],
  };

  // 8. BlogPosting Schema (구글·네이버 기사 리치 결과 규격, ISO-8601 KST 타임존 포함)
  const isoDate = toKstIsoDate(articleDate);
  const blogPostingSchema = articleTitle
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: articleTitle,
        description: articleDescription || "",
        inLanguage: "ko-KR",
        datePublished: isoDate,
        dateModified: isoDate,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        author: {
          "@type": "Organization",
          name: articleAuthor || "넥스트바이크 (전국중고오토바이매입)",
          url: BASE_URL,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        image: {
          "@type": "ImageObject",
          url: OG_IMAGE_URL,
          width: 1376,
          height: 768,
        },
        keywords: articleTags ? articleTags.join(", ") : "오토바이매입, 중고바이크",
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {webSiteSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema.itemListElement.length > 1 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {blogPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
      )}
    </>
  );
}
