import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BIKE_MODELS } from "@/data/models";
import JsonLd from "@/components/JsonLd";
import { Calculator, Phone, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/price",
  },
  title: "중고 오토바이 시세표 · 오토바이 중고 시세 | 전국 183개 기종 매입 기준표",
  description:
    `혼다 PCX125·슈퍼커브, 야마하 NMAX·XMAX, 할리데이비슨 전 라인업, BMW 모토라드, 가와사키, 스즈키, 로얄엔필드 등 ${BIKE_MODELS.length}개 내연기관 기종 실시간 중고 오토바이 시세표 및 매입 기준.`,
  keywords: [
    "중고오토바이시세표",
    "오토바이중고시세",
    "중고바이크시세",
    "오토바이팔기",
    "중고스쿠터매입",
    "배달용PCX매입",
    "할리데이비슨매입",
    "BMW오토바이매입",
    "가와사키오토바이매입",
    "대배기량바이크매입",
  ],
};

const PRICE_HUB_CARDS = [
  {
    title: "배달 · 출퇴근 중고 스쿠터 시세",
    desc: "혼다 PCX125 · 비전110 · 리드125, 야마하 NMAX125/155 · XMAX300, 포르자350, 베스파 GTS/프리마베라",
    sampleLinks: [
      { slug: "pcx125", label: "PCX125" },
      { slug: "nmax125", label: "NMAX125" },
      { slug: "forza350", label: "포르자350" },
      { slug: "xmax300", label: "XMAX300" },
    ],
  },
  {
    title: "할리데이비슨 · 아메리칸 크루저 시세",
    desc: "팻보이 114/117 · 브레이크아웃 · 로우라이더 S/ST · 로드글라이드 · 스트리트글라이드 · 팬아메리카 1250",
    sampleLinks: [
      { slug: "harley-fatboy", label: "팻보이" },
      { slug: "harley-lowrider-st", label: "로우라이더ST" },
      { slug: "harley-roadglide", label: "로드글라이드" },
      { slug: "harley-pan-america-1250", label: "팬아메리카1250" },
    ],
  },
  {
    title: "BMW 모토라드 · 대배기량 투어러 시세",
    desc: "R1300GS · R1250GS · R1250RT · F900GS · F850GS · K1600GTL · S1000RR · 혼다 골드윙/아프리카트윈",
    sampleLinks: [
      { slug: "bmw-r1250gs", label: "R1250GS" },
      { slug: "bmw-f900gs", label: "F900GS" },
      { slug: "bmw-s1000rr", label: "S1000RR" },
      { slug: "honda-goldwing", label: "골드윙1800" },
    ],
  },
  {
    title: "가와사키 · 스즈키 · 로얄엔필드 시세",
    desc: "닌자 ZX-4RR · Z900RS · 버시스650 · 하야부사 · GSX-8R · 브이스트롬800DE · 슈퍼메테오650 · 게릴라450",
    sampleLinks: [
      { slug: "kawasaki-zx4rr", label: "ZX-4RR" },
      { slug: "suzuki-gsx8r", label: "GSX-8R" },
      { slug: "royal-enfield-supermeteor650", label: "슈퍼메테오650" },
      { slug: "yamaha-r9", label: "YZF-R9" },
    ],
  },
];

export default function PricePage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/price" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            실거래 데이터 기반 시세 가이드 ({BIKE_MODELS.length}종)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            중고 오토바이 <span className="text-brand-cyan">시세표 및 매입 기준</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            중고 스쿠터·배달용 PCX/NMAX부터 할리데이비슨, BMW 모토라드, 혼다, 야마하, 가와사키, 스즈키, 로얄엔필드까지 기종별 평균 매입 시세 범위와 가산·감가 기준을 투명하게 공개합니다.
          </p>
        </div>

        {/* 장르·브랜드별 주요 시세 허브 바로가기 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICE_HUB_CARDS.map((card) => (
            <div key={card.title} className="p-4 rounded-2xl bg-surface border border-border space-y-3">
              <div>
                <h2 className="text-sm font-extrabold text-white">{card.title}</h2>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{card.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.sampleLinks.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/models/${m.slug}`}
                    className="px-2 py-1 rounded-md bg-card hover:bg-brand-cyan hover:text-black border border-border text-[11px] font-bold text-gray-200 transition-colors"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 모바일 전용 시세 카드 리스트 (모바일 최적화) */}
        <div className="md:hidden space-y-3">
          {BIKE_MODELS.map((b) => (
            <div key={b.slug} className="p-4 rounded-xl bg-surface border border-border space-y-3 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] text-brand-cyan font-bold block">{b.brand} · {b.category} ({b.displacement})</span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{b.name}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 block">평균 매입 시세</span>
                  <span className="text-sm font-black text-brand-cyan">{b.priceRange}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 bg-card/60 p-2.5 rounded-lg border border-border/60">
                💡 {b.meritPoints[0] || "순정 카울 및 스마트키 완비 우대"}
              </p>
              <Link
                href={`/models/${b.slug}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-card hover:bg-brand-cyan hover:text-black border border-border text-xs font-bold text-gray-200 transition-colors"
              >
                <span>{b.name} 상세 시세 및 감정 기준 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* 데스크탑 전용 시세표 테이블 */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-surface shadow-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-card/80 text-gray-300 uppercase tracking-wider">
                <th className="p-4 sm:p-5 font-bold">제조사/모델</th>
                <th className="p-4 sm:p-5 font-bold">배기량/분류</th>
                <th className="p-4 sm:p-5 font-bold">평균 매입 시세 범위</th>
                <th className="p-4 sm:p-5 font-bold">시세 가산 포인트</th>
                <th className="p-4 sm:p-5 font-bold text-center">견적 문의</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-gray-300">
              {BIKE_MODELS.map((b) => (
                <tr key={b.slug} className="hover:bg-card/40 transition-colors">
                  <td className="p-4 sm:p-5">
                    <div className="font-extrabold text-white text-sm sm:text-base">{b.name}</div>
                    <div className="text-[11px] text-brand-cyan font-bold">{b.brand}</div>
                  </td>
                  <td className="p-4 sm:p-5 text-gray-400">
                    <div>{b.displacement}</div>
                    <div className="text-[11px]">{b.category}</div>
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-brand-cyan text-sm sm:text-base">
                    {b.priceRange}
                  </td>
                  <td className="p-4 sm:p-5 text-xs text-gray-400 max-w-xs">
                    {b.meritPoints[0] || "순정 카울 및 스마트키 완비 우대"}
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <Link
                      href={`/models/${b.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card hover:bg-brand-cyan hover:text-black border border-border text-xs font-bold text-gray-300 transition-all"
                    >
                      상세시세
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3 text-xs text-gray-400 leading-relaxed">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
            중고 오토바이 시세 산정 방식 &amp; 구비서류 안내
          </h4>
          <p>
            중고 바이크 시세는 국내 주요 중고 매매 시장의 실거래가와 계절적 수요, 모델별 감가율을 종합하여 정직하게 산정합니다. 리스·할부 완납 후 사용폐지 또는 개인 명의이전 완료된 내연기관 차량을 당일 최고가로 매입합니다. (※ 전기오토바이·리스 승계 제외)
          </p>
          <p>
            전화(010-4895-2487) 또는 30초 온라인 견적 신청 시 사진을 함께 보내주시면 현장 감가 없는 확실한 최종 예상가를 안내받으실 수 있습니다.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
            <Link href="/models" className="inline-flex items-center gap-1 text-brand-cyan hover:underline">
              <span>브랜드별 183종 매입 허브 →</span>
            </Link>
            <Link href="/magazine/bike-deregistration-guide-2026" className="inline-flex items-center gap-1 text-brand-cyan hover:underline">
              <BookOpen className="w-3.5 h-3.5" />
              <span>오토바이 명의이전·폐지 서류 총정리 →</span>
            </Link>
            <Link href="/magazine/lease-financing-bike-settlement-guide" className="inline-flex items-center gap-1 text-brand-cyan hover:underline">
              <span>리스 완납·할부 정리 기준 →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
