"use client";

import React, { useState } from "react";
import Link from "next/link";
import { REGIONS, getMainRegionsByProvince, getDongsForCity, Region } from "@/data/regions";
import { MapPin, ChevronRight, ChevronDown, Sparkles } from "lucide-react";

interface RegionLinkGridProps {
  currentSlug?: string;
  limit?: number;
  highlightNeighbors?: string[];
}

export default function RegionLinkGrid({ currentSlug, limit, highlightNeighbors }: RegionLinkGridProps) {
  const provinces = getMainRegionsByProvince();
  const [selectedCity, setSelectedCity] = useState<Region | null>(null);

  // 인접 지역 안내
  const neighborRegions = highlightNeighbors
    ? REGIONS.filter((r) => highlightNeighbors.includes(r.slug))
    : [];

  const handleCityClick = (e: React.MouseEvent, city: Region, dongs: Region[]) => {
    if (dongs.length > 0) {
      e.preventDefault();
      // 토글 동작: 이미 선택된 경우 닫기, 아니면 열기
      if (selectedCity?.slug === city.slug) {
        setSelectedCity(null);
      } else {
        setSelectedCity(city);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* 인접 지역 안내 */}
      {neighborRegions.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan mb-4 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            인접 생활권 및 출장 방문 지역
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {neighborRegions.map((nr) => (
              <Link
                key={nr.slug}
                href={`/regions/${nr.slug}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border hover:border-brand-cyan hover:text-brand-cyan transition-all text-xs font-semibold text-gray-300 group"
              >
                <span className="truncate">{nr.name} 매입</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-cyan shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 전국 권역별 출장 지역 안내 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-cyan" />
              전국 지역별 출장 매입 안내
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              원하시는 시·군·구를 선택하시면 해당 지역 전용 매입 시세와 출장 정보를 확인하실 수 있습니다. (주요 시·구 클릭 시 세부 동 목록 확인 가능)
            </p>
          </div>
          <Link
            href="/regions"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-cyan hover:underline"
          >
            전체 지역 보기
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(provinces).map(([province, items]) => {
            // 현재 선택된 도시가 이 권역에 속해있는지 확인
            const provinceHasSelectedCity = selectedCity && items.some((c) => c.slug === selectedCity.slug);
            const activeDongs = selectedCity ? getDongsForCity(selectedCity.slug) : [];

            return (
              <div key={province} className="p-5 rounded-2xl bg-surface border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                      {province}권역 출장 가능 지역
                    </span>
                    <span className="text-[11px] text-gray-400">당일 방문 지원</span>
                  </div>

                  {/* 일관된 단일 스타일 버튼 그리드 (색상 불일치 100% 해소) */}
                  <div className="flex flex-wrap gap-1.5">
                    {items.slice(0, limit || 40).map((reg) => {
                      const isCurrent = reg.slug === currentSlug;
                      const dongs = getDongsForCity(reg.slug);
                      const hasDongs = dongs.length > 0;
                      const isSelected = selectedCity?.slug === reg.slug;

                      return (
                        <Link
                          key={reg.slug}
                          href={`/regions/${reg.slug}`}
                          onClick={(e) => handleCityClick(e, reg, dongs)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 font-semibold border ${
                            isSelected
                              ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold shadow-md shadow-brand-cyan/10"
                              : isCurrent
                              ? "bg-brand-cyan text-black font-extrabold shadow-sm border-brand-cyan"
                              : "bg-card text-gray-300 hover:border-brand-cyan hover:text-brand-cyan border-border/70"
                          }`}
                        >
                          <span>{reg.name}</span>
                          {hasDongs && (
                            <ChevronDown
                              className={`w-3 h-3 opacity-60 transition-transform ${
                                isSelected ? "rotate-180 text-brand-cyan" : ""
                              }`}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 사용자가 도시를 눌렀을 때만 부드럽게 나타나는 세부 동(洞) 목록 드로어 */}
                {provinceHasSelectedCity && selectedCity && activeDongs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/80 bg-card/60 p-3.5 rounded-xl border border-brand-cyan/30 animate-fadeIn space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-cyan flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {selectedCity.name} 세부 출장 동(洞) 안내
                      </span>
                      <Link
                        href={`/regions/${selectedCity.slug}`}
                        className="text-[11px] font-bold text-gray-400 hover:text-white flex items-center gap-0.5"
                      >
                        {selectedCity.name} 전체 보기 <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {activeDongs.map((dong) => (
                        <Link
                          key={dong.slug}
                          href={`/regions/${dong.slug}`}
                          className="px-2.5 py-1 rounded-md bg-surface border border-border/80 hover:border-brand-cyan hover:text-brand-cyan text-xs text-gray-200 transition-colors font-medium"
                        >
                          {dong.name} 매입
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
