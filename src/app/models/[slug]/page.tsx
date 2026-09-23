import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BIKE_MODELS, getModelBySlug, getRelatedModels } from "@/data/models";
import EstimateForm from "@/components/EstimateForm";
import RegionTableGrid from "@/components/RegionTableGrid";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import {
  Bike,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Home,
  ShieldCheck,
} from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return BIKE_MODELS.map((bike) => ({
    slug: bike.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = getModelBySlug(params.slug);
  if (!model) return {};

  const title = `${model.name} 매입 | 중고 시세 최고가 당일 현금 매입`;
  const description = `${model.name} 중고 오토바이 출장 매입 전문. ${model.summary} 배기량 ${model.displacement}, 연식·적산거리 무관 최고가 감정 및 당일 전액 입금.`;
  const canonical = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models/${model.slug}`;

  return {
    title,
    description,
    keywords: [
      `${model.name} 매입`,
      `${model.name} 중고매입`,
      `${model.name} 시세`,
      `${model.name} 가격`,
      `${model.name} 판매`,
      `${model.brand} 매입`,
      "넥스트바이크",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "넥스트바이크",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${model.name} 중고 오토바이 매입`,
        },
      ],
    },
  };
}

export default function ModelDetailPage({ params }: Props) {
  const model = getModelBySlug(params.slug);
  if (!model) {
    notFound();
  }

  const relatedModels = getRelatedModels(model.slug, 6);
  const canonicalUrl = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models/${model.slug}`;

  return (
    <div className="py-6 sm:py-10 space-y-16">
      <JsonLd
        type="model"
        modelName={model.name}
        canonicalUrl={canonicalUrl}
      />

      {/* ================= 1. 상단 브레드크럼 & 모델 히어로 ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link href="/models" className="hover:text-white">
            기종별 매입
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-brand-cyan font-bold">{model.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* 좌측 모델 정보 & 감정 포인트 */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
              <Bike className="w-4 h-4" />
              <span>{model.brand} · {model.category} ({model.displacement})</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight break-keep">
              <span className="block">{model.name} <span className="text-brand-cyan">최고가 매입</span></span>
              <span className="text-xl sm:text-3xl text-gray-200 font-bold block mt-1">
                실시간 전국 중고 시세 100% 반영
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {model.description}
            </p>

            {/* 실거래 시세 범위 안내 */}
            <div className="p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs text-gray-300 block font-bold">실거래 평균 매입 시세 범위</span>
                <span className="text-xl sm:text-2xl font-black text-brand-cyan">{model.priceRange}</span>
              </div>
              <span className="text-xs text-gray-400">※ 무사고·옵션·서류 완비 시 최고 우대</span>
            </div>

            {/* 감가/점검 기준 & 가산점 기준 카드 */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2 text-left">
              {/* 점검 체크리스트 */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <AlertTriangle className="w-4 h-4 text-brand-yellow" />
                  <span>실차 확인 핵심 점검 사항</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-400">
                  {model.checkPoints.map((cp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-600">•</span>
                      <span>{cp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 추가 가산점 요인 */}
              <div className="p-5 rounded-xl bg-surface border border-brand-cyan/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan">
                  <Sparkles className="w-4 h-4 text-brand-cyan" />
                  <span>시세 가산 및 우대 요인</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-300">
                  {model.meritPoints.map((mp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0 mt-0.5" />
                      <span>{mp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 빠른 액션 버튼 */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 w-full">
              <a
                href="tel:01048952487"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-cyan text-black font-extrabold text-sm whitespace-nowrap shrink-0 shadow-lg shadow-brand-cyan/25 active:scale-95"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{model.name} 전화 시세 문의</span>
              </a>
              <a
                href="https://open.kakao.com/o/skSUkiHg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-yellow text-[#191600] font-black text-sm whitespace-nowrap shrink-0 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">카카오톡 1:1 상담</span>
              </a>
            </div>
          </div>

          {/* 우측 30초 견적 폼 (모델명 자동 주입) */}
          <div className="lg:col-span-5">
            <EstimateForm initialModel={model.name} />
          </div>
        </div>
      </section>

      {/* ================= 2. 함께 많이 찾는 인기 기종 매입 시세 ================= */}
      {relatedModels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-12 space-y-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-2">
              <Bike className="w-3.5 h-3.5" />
              <span>동급 및 인기 기종 시세 비교</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              함께 많이 찾는 <span className="text-brand-cyan">인기 바이크 매입 시세</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {model.name} 외에도 다양한 동급 스쿠터 및 제조사별 인기 모델의 실거래 시세를 확인하실 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {relatedModels.map((m) => (
              <Link
                key={m.slug}
                href={`/models/${m.slug}`}
                className="p-3.5 rounded-xl bg-surface border border-border hover:border-brand-cyan hover:bg-card transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-brand-cyan block">
                    {m.brand}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-cyan mt-0.5 block truncate">
                    {m.name}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1 block font-medium">
                    {m.priceRange}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{m.category}</span>
                  <span className="text-brand-cyan font-bold flex items-center gap-0.5">
                    시세확인 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= 3. 전국 60대 거점 직영 출장망 (빈공간 없는 8열 테이블) ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-12">
        <RegionTableGrid
          badgeText={`${model.name} 전국 출장 지원`}
          title={
            <>
              {model.name} 전국 <span className="text-brand-cyan">어디든 당일 출장 매입</span>
            </>
          }
          subtitle="서울, 경기, 인천은 물론 전국 모든 시·도 전역에서 동일한 최고가 조건으로 당일 무료 출장 방문합니다."
        />
      </section>

      {/* ================= 3. FAQ ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-12">
        <FaqSection />
      </section>
    </div>
  );
}
