"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { Region } from "@/data/regions";
import { MapPin, ArrowRight, Search, X } from "lucide-react";

export interface RegionTableGridProps {
  title?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
}

export type RegionLink = Pick<Region, "slug" | "name" | "fullName" | "province" | "subDistricts">;

interface RegionTableGridClientProps extends RegionTableGridProps {
  default60Regions: RegionLink[];
  allMainRegions: RegionLink[];
}

export default function RegionTableGridClient({
  default60Regions,
  allMainRegions,
  title,
  subtitle,
  badgeText = "전국 60대 거점 직영 출장망",
}: RegionTableGridClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const displayedRegions = useMemo(() => {
    if (!trimmedQuery) return default60Regions;

    return allMainRegions.filter((r) => {
      const haystack = [
        r.name,
        r.fullName,
        r.province,
        ...(r.subDistricts || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [default60Regions, allMainRegions, trimmedQuery]);

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
          {subtitle || "거주하시는 시·군·구를 검색하거나 클릭하시면 상세 출장 소요 시간과 관내 세부 행정동 매입 안내를 확인하실 수 있습니다."}
        </p>

        {/* 빠른 지역 검색바 */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-cyan absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지역명 검색 (예: 시흥, 일산, 창원, 해운대...)"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-surface border border-border focus:border-brand-cyan text-xs sm:text-sm text-white placeholder:text-gray-500 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="검색어 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8열 격자 테두리 테이블 */}
      {displayedRegions.length === 0 ? (
        <div className="p-6 rounded-xl border border-border/80 bg-surface/80 text-center space-y-2">
          <div className="text-xs sm:text-sm font-bold text-white">
            &ldquo;{searchQuery}&rdquo; 세부 동·읍·면 검색은 지역별 매입 전체 페이지에서 확인하실 수 있습니다.
          </div>
          <Link
            href="/regions"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-cyan hover:underline"
          >
            전국 1,298개 세부 지역 통합 검색 페이지로 이동 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="border border-border/80 rounded-xl overflow-hidden bg-surface/80 shadow-lg">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 divide-x divide-y divide-border/80">
            {displayedRegions.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className="py-3 px-2 text-center text-xs sm:text-sm font-medium text-gray-300 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-colors duration-150 flex items-center justify-center min-h-[46px]"
                title={`${region.fullName} 오토바이·중고바이크 출장 매입`}
              >
                <span>{region.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 하단 전체 지역 페이지 보기 링크 */}
      <div className="text-center pt-1">
        <Link
          href="/regions"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-400 hover:text-brand-cyan transition-colors group"
        >
          <span>전국 출장 지역 검색 및 상세 안내</span>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
