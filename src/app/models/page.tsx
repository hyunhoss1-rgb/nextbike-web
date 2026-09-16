import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BIKE_MODELS } from "@/data/models";
import JsonLd from "@/components/JsonLd";
import { Bike, ChevronRight, Phone, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "인기 기종별 오토바이 매입 | 혼다·야마하·BMW·할리 중고 시세",
  description:
    "혼다 PCX125, 야마하 NMAX, 포르자350, XMAX300, 슈퍼커브, BMW R1250GS, 할리데이비슨, 베스파 등 인기 바이크 최고가 당일 매입 넥스트바이크.",
  keywords: [
    "PCX125매입",
    "NMAX매입",
    "포르자350매입",
    "XMAX매입",
    "슈퍼커브매입",
    "TMAX매입",
    "BMW바이크매입",
    "할리오토바이매입",
    "베스파매입",
    "중고바이크시세",
  ],
};

export default function ModelsIndexPage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd type="main" canonicalUrl="https://www.xn--b60bj1s89e3pf91mzkd.com/models" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 헤더 안내 */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <Bike className="w-3.5 h-3.5" />
            전 차종 최고가 실시간 시세 반영 (총 {BIKE_MODELS.length}개 인기 기종)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            인기 기종별 <span className="text-brand-cyan">중고오토바이 매입</span> 안내
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            국내에서 가장 활발히 거래되는 대표 스쿠터부터 클래식, 쿼터급 투어러, 대형 하이엔드 바이크까지 각 기종별 감가/가산 기준을 투명하게 공개하고 최고가로 매입합니다.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="tel:01048952487"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-sm"
            >
              <Phone className="w-4 h-4" />
              내 바이크 시세 유선 문의 (010-4895-2487)
            </a>
          </div>
        </div>

        {/* 기종 리스트 카드 그리드 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BIKE_MODELS.map((bike) => (
            <div
              key={bike.slug}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-brand-cyan/70 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-brand-cyan">{bike.brand}</span>
                  <span className="px-2 py-0.5 rounded bg-card text-gray-400 border border-border/50">
                    {bike.displacement}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-brand-cyan transition-colors mb-2">
                  {bike.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {bike.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-gray-500">{bike.category}</span>
                <Link
                  href={`/models/${bike.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-cyan hover:underline"
                >
                  매입 기준 보기
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
