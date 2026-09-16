import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BIKE_MODELS } from "@/data/models";
import JsonLd from "@/components/JsonLd";
import { Calculator, Phone, CheckCircle2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "중고 오토바이 시세표 | 2024~2026 실시간 매입 시세 기준표",
  description:
    "혼다 PCX125, 야마하 NMAX, XMAX, 포르자350, 슈퍼커브, BMW, 할리데이비슨 등 전국 실거래 기준 중고 오토바이 매입 시세표 및 시세 감정 기준 안내.",
};

export default function PricePage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/price" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            실거래 데이터 기반 시세 가이드
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            중고 오토바이 <span className="text-brand-cyan">시세표 및 매입 기준</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            인기 바이크 기종별 평균 매입 시세 범위와 감가·가산 가이드입니다. 정확한 금액은 사진과 차량 상태 확인 후 5분 내로 안내해 드립니다.
          </p>
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
            중고 오토바이 시세 산정 방식 안내
          </h4>
          <p>
            중고 바이크 시세는 국내 주요 중고 매매 시장의 실거래가와 계절적 수요, 모델별 감가율을 종합하여 정직하게 산정합니다.
          </p>
          <p>
            전화(010-4895-2487) 또는 30초 온라인 견적 신청 시 사진을 함께 보내주시면 현장 감가 없는 확실한 최종 예상가를 안내받으실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
