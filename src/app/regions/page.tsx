import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getMainRegions } from "@/data/regions";
import JsonLd from "@/components/JsonLd";
import { MapPin, Phone, ChevronRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "지역별 오토바이매입 출장 상담 | 전국 24시 출장 전문",
  description:
    "서울·경기·부산·대구·인천 등 전국 시·도 및 주요 시군구 오토바이매입 상담 안내. 지역명을 눌러 해당 지역의 상세 매입 안내를 확인하세요.",
  keywords: [
    "지역별오토바이매입",
    "전국오토바이매입",
    "서울오토바이매입",
    "경기오토바이매입",
    "인천오토바이매입",
    "시흥오토바이매입",
    "부천오토바이매입",
    "수원오토바이매입",
    "천안오토바이매입",
    "대전오토바이매입",
    "부산오토바이매입",
  ],
};

export default function RegionsIndexPage() {
  const mainRegions = getMainRegions();

  return (
    <div className="py-8 sm:py-14 space-y-12">
      <JsonLd type="main" canonicalUrl="https://www.xn--b60bj1s89e3pf91mzkd.com/regions" />

      {/* 상단 브레드크럼 & 타이틀 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-brand-cyan font-bold">지역별 매입</span>
        </nav>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            전국 <span className="text-brand-cyan">지역별 오토바이매입</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            서울·경기·부산·대구·인천 광역시부터 주요 시·군까지 지역별 오토바이매입 상담 페이지입니다. 지역명을 눌러 해당 지역의 상세 매입 안내와 세부 동(洞) 정보를 확인하세요.
          </p>
        </div>
      </div>

      {/* moto02 스타일의 극도로 깔끔한 5열 카드 그리드 (동 단위 난잡한 나열 100% 제거) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {mainRegions.map((reg) => (
            <Link
              key={reg.slug}
              href={`/regions/${reg.slug}`}
              className="group block p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-brand-cyan hover:-translate-y-1 transition-all shadow-md"
            >
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-brand-cyan uppercase">
                <MapPin className="w-3 h-3" />
                REGION
              </div>
              <div className="mt-2 text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-brand-cyan transition-colors truncate">
                {reg.name} 오토바이매입
              </div>
              <div className="text-[11px] text-gray-400 mt-1 truncate">
                {reg.fullName}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 하단 전화 상담 배너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              목록에 없는 외곽 지역도 전국 당일 출장 매입이 가능합니다
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              차량 사진과 위치만 알려주시면 신속하게 방문 일정을 조율해 드립니다.
            </p>
          </div>
          <a
            href="tel:01048952487"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-cyan text-black font-extrabold text-sm whitespace-nowrap shadow-lg shadow-brand-cyan/20"
          >
            <Phone className="w-4 h-4" />
            전화 상담 (010-4895-2487)
          </a>
        </div>
      </div>
    </div>
  );
}
