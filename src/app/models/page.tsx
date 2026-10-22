import React from "react";
import type { Metadata } from "next";
import { BIKE_MODELS } from "@/data/models";
import JsonLd from "@/components/JsonLd";
import ModelSearchGrid from "@/components/ModelSearchGrid";
import { Bike, Phone } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models",
  },
  title: "인기 기종별 오토바이 매입 | 혼다·야마하·SYM·킴코·BMW·할리 중고 시세",
  description:
    "혼다 PCX125, 야마하 NMAX, 포르자350, XMAX300, 슈퍼커브, 벤리110, SYM 크루심, BMW R1250GS, 할리데이비슨, 베스파 등 125개 전 기종 상차 전 당일 100% 선입금 최고가 출장 매입.",
  keywords: [
    "PCX125매입",
    "NMAX매입",
    "포르자350매입",
    "XMAX매입",
    "슈퍼커브매입",
    "벤리110매입",

    "크루심매입",
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
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
            국내에서 가장 활발히 거래되는 상용·출퇴근 스쿠터부터 클래식, 쿼터급 투어러, 대형 하이엔드 바이크까지 차종 검색을 통해 기종별 평균 매입 시세와 우대 기준을 바로 확인해 보세요.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="tel:01048952487"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-sm shadow-lg shadow-brand-cyan/20"
            >
              <Phone className="w-4 h-4" />
              내 바이크 시세 유선 문의 (010-4895-2487)
            </a>
          </div>
        </div>

        {/* 실시간 차종 검색 + 브랜드/장르 필터 + 전체 기종 그리드 */}
        <ModelSearchGrid models={BIKE_MODELS} />
      </div>
    </div>
  );
}

