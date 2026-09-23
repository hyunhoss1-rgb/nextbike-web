"use client";

import React from "react";
import Link from "next/link";
import { getTable60Regions } from "@/data/regions";
import { MapPin, ArrowRight } from "lucide-react";

interface RegionTableGridProps {
  title?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
}

export default function RegionTableGrid({
  title,
  subtitle,
  badgeText = "전국 60대 거점 직영 출장망",
}: RegionTableGridProps = {}) {
  const regions = getTable60Regions();

  return (
    <div className="w-full space-y-6">
      {/* 상단 헤더: 넥스트바이크 독자적인 전국 60대 거점 직영 출장 네트워크 */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {title || (
            <>
              지역별 실시간 <span className="text-brand-cyan">출장 매입 네트워크</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-gray-400">
          {subtitle || "거주하시는 시·군·구를 클릭하시면 상세 출장 소요 시간과 관내 세부 행정동 매입 안내를 확인하실 수 있습니다."}
        </p>
      </div>

      {/* 사진 2의 8열 격자 테두리 테이블 */}
      <div className="border border-border/80 rounded-xl overflow-hidden bg-surface/80 shadow-lg">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 divide-x divide-y divide-border/80">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/regions/${region.slug}`}
              className="py-3 px-2 text-center text-xs sm:text-sm font-medium text-gray-300 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-colors duration-150 flex items-center justify-center min-h-[46px]"
              title={`${region.fullName} 오토바이 매입`}
            >
              <span>{region.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 하단 전체 지역 페이지 보기 링크 */}
      <div className="text-center pt-1">
        <Link
          href="/regions"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-400 hover:text-brand-cyan transition-colors group"
        >
          <span>대한민국 70+ 전 지역 출장 상세 안내 보기</span>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
