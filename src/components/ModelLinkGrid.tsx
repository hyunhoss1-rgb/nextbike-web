"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BIKE_MODELS } from "@/data/models";
import { matchBikeModel } from "@/components/ModelSearchGrid";
import { Bike, ChevronRight, Search, X } from "lucide-react";

interface ModelLinkGridProps {
  currentSlug?: string;
}

const BRAND_TABS = [
  { key: "all", label: "전체" },
  { key: "혼다", label: "혼다" },
  { key: "야마하", label: "야마하" },
  { key: "SYM", label: "SYM" },
  { key: "킴코", label: "킴코" },
  { key: "국산", label: "DNA·KR(국산)" },
  { key: "BMW", label: "BMW" },
  { key: "할리데이비슨", label: "할리데이비슨" },
  { key: "베스파", label: "베스파" },
  { key: "가와사키", label: "가와사키" },
  { key: "스즈키", label: "스즈키" },
  { key: "etc", label: "기타인기브랜드" },
];

function matchesBrand(brand: string, key: string): boolean {
  if (key === "all") return true;
  if (key === "국산") {
    return (
      brand.includes("DNA") ||
      brand.includes("대림") ||
      brand.includes("KR") ||
      brand.includes("효성")
    );
  }
  if (key === "etc") {
    return (
      !["혼다", "야마하", "SYM", "킴코", "가와사키", "스즈키"].includes(brand) &&
      !brand.includes("DNA") &&
      !brand.includes("KR") &&
      !brand.includes("BMW") &&
      !brand.includes("할리") &&
      !brand.includes("베스파")
    );
  }
  return brand.includes(key);
}

export default function ModelLinkGrid({ currentSlug }: ModelLinkGridProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAllMobile, setShowAllMobile] = useState<boolean>(false);

  const filteredModels = useMemo(() => {
    return BIKE_MODELS.filter((m) => {
      if (!matchesBrand(m.brand, selectedBrand)) return false;
      if (!matchBikeModel(m, searchQuery)) return false;
      return true;
    });
  }, [selectedBrand, searchQuery]);

  const isDefaultView = selectedBrand === "all" && !searchQuery.trim();
  const hiddenMobileCount = isDefaultView ? Math.max(0, filteredModels.length - 16) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Bike className="w-5 h-5 text-brand-cyan shrink-0" />
          <span>자주 거래되는 인기 바이크 기종별 최고가 매입</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
            총 {BIKE_MODELS.length}개 기종
          </span>
        </h3>

        <div className="flex items-center justify-center sm:justify-end gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-brand-cyan absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="기종 검색 (예: PCX, 엔맥스, 크루심...)"
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-surface border border-border focus:border-brand-cyan text-xs text-white placeholder:text-gray-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="검색어 지우기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Link
            href="/models"
            className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-0.5 shrink-0"
          >
            전체 검색
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 브랜드별 필터 탭 */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pb-1">
        {BRAND_TABS.map((tab) => {
          const count = BIKE_MODELS.filter((m) => matchesBrand(m.brand, tab.key)).length;
          const isActive = selectedBrand === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedBrand(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand-cyan text-black shadow-md shadow-brand-cyan/20"
                  : "bg-surface border border-border text-gray-400 hover:text-white hover:border-brand-cyan/50"
              }`}
            >
              {tab.label} <span className="opacity-75 text-[11px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 기종 카드 그리드 */}
      {filteredModels.length === 0 ? (
        <div className="p-6 rounded-xl bg-surface border border-border text-center text-xs text-gray-400 space-y-2">
          <div>&ldquo;{searchQuery}&rdquo; 조건과 일치하는 기종이 없습니다. (전 차종 당일 매입 가능)</div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedBrand("all");
            }}
            className="text-brand-cyan font-bold hover:underline"
          >
            전체 {BIKE_MODELS.length}개 기종 보기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredModels.map((model, idx) => {
              const isCurrent = model.slug === currentSlug;
              const hideOnMobile = isDefaultView && !showAllMobile && idx >= 16;
              return (
                <Link
                  key={model.slug}
                  href={`/models/${model.slug}`}
                  className={`${hideOnMobile ? "hidden sm:flex" : "flex"} p-3.5 rounded-xl border transition-all flex-col justify-between group ${
                    isCurrent
                      ? "bg-brand-cyan/10 border-brand-cyan text-white shadow-lg shadow-brand-cyan/10"
                      : "bg-surface border border-border hover:border-brand-cyan hover:bg-card text-gray-300 hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-brand-cyan truncate max-w-[90px]">
                        {model.brand}
                      </span>
                      <span className="text-gray-500 font-medium">
                        {model.displacement}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-cyan transition-colors block leading-tight">
                      {model.name}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="truncate max-w-[85px]">{model.category}</span>
                    <span className="text-brand-cyan font-bold text-[10px] shrink-0">당일매입</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 모바일 전체 기종 펼쳐보기 버튼 (16개 초과 시 노출) */}
          {isDefaultView && hiddenMobileCount > 0 && (
            <div className="sm:hidden pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="w-full py-3 px-4 rounded-xl bg-surface border border-brand-cyan/40 hover:border-brand-cyan text-brand-cyan font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                {showAllMobile ? (
                  <>인기 기종 16개만 간략히 보기 ▲</>
                ) : (
                  <>전체 126개 인기 기종 펼쳐보기 (+{hiddenMobileCount}개 더보기 ▼)</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

