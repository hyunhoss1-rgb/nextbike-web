"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  X,
  Clock,
  Sparkles,
  Phone,
  ChevronRight,
  Compass,
} from "lucide-react";

export interface SearchableRegionItem {
  slug: string;
  name: string;
  fullName: string;
  province: string;
  dispatchTime: string;
  isDong?: boolean;
  isSubDong?: boolean;
  subDistricts: string[];
}

interface RegionSearchBrowserProps {
  mainRegions: SearchableRegionItem[];
  allRegions: SearchableRegionItem[];
}

const PROVINCE_TABS = [
  { key: "all", label: "전국 전체" },
  { key: "서울", label: "서울특별시" },
  { key: "경기", label: "경기도" },
  { key: "인천", label: "인천광역시" },
  { key: "부울경", label: "부산·울산·경남" },
  { key: "대경", label: "대구·경북" },
  { key: "충청", label: "대전·세종·충청" },
  { key: "호남", label: "광주·전북·전남" },
  { key: "강원제주", label: "강원·제주" },
];

const QUICK_REGION_CHIPS = [
  "함안",
  "시흥",
  "부천",
  "수원",
  "하남",
  "구리",
  "일산",
  "창원",
  "전주",
  "천안",
  "배곧",
  "제기동",
  "해운대",
  "밀양",
];

function matchesProvinceTab(province: string, tabKey: string): boolean {
  if (tabKey === "all") return true;
  if (tabKey === "서울") return province.includes("서울");
  if (tabKey === "경기") return province.includes("경기");
  if (tabKey === "인천") return province.includes("인천");
  if (tabKey === "부울경") {
    return (
      province.includes("부산") ||
      province.includes("울산") ||
      province.includes("경남") ||
      province.includes("경상남도")
    );
  }
  if (tabKey === "대경") {
    return (
      province.includes("대구") ||
      province.includes("경북") ||
      province.includes("경상북도")
    );
  }
  if (tabKey === "충청") {
    return (
      province.includes("대전") ||
      province.includes("세종") ||
      province.includes("충남") ||
      province.includes("충북") ||
      province.includes("충청")
    );
  }
  if (tabKey === "호남") {
    return (
      province.includes("광주") ||
      province.includes("전북") ||
      province.includes("전남") ||
      province.includes("전라")
    );
  }
  if (tabKey === "강원제주") {
    return province.includes("강원") || province.includes("제주");
  }
  return true;
}

export default function RegionSearchBrowser({
  mainRegions,
  allRegions,
}: RegionSearchBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const displayedRegions = useMemo(() => {
    // 검색어가 없을 때는 깔끔한 시·군·구 메인 지역 리스트 표시 (SEO 및 가독성 유지)
    if (!trimmedQuery) {
      return mainRegions.filter((r) => matchesProvinceTab(r.province, selectedProvince));
    }

    // 검색어가 있을 때는 전국 1,298개 모든 시·군·구·읍·면·동·신도시에서 실시간 통합 검색
    const tokens = trimmedQuery.split(/\s+/).filter(Boolean);

    const matched = allRegions.filter((r) => {
      if (!matchesProvinceTab(r.province, selectedProvince)) return false;

      const haystack = [
        r.name,
        r.fullName,
        r.province,
        r.slug,
        ...(r.subDistricts || []),
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((tok) => haystack.includes(tok));
    });

    // 정확도 순 정렬: 지역명(name) 직접 일치 우선 -> 시·군·구 본청 우선 -> 세부 동/읍/면
    return matched.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(trimmedQuery) ? 1 : 0;
      const bNameMatch = b.name.toLowerCase().includes(trimmedQuery) ? 1 : 0;
      if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;

      const aIsMain = !a.isDong && !a.isSubDong ? 1 : 0;
      const bIsMain = !b.isDong && !b.isSubDong ? 1 : 0;
      if (aIsMain !== bIsMain) return bIsMain - aIsMain;

      return a.name.localeCompare(b.name, "ko");
    });
  }, [mainRegions, allRegions, trimmedQuery, selectedProvince]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedProvince("all");
  };

  return (
    <div className="space-y-8">
      {/* 검색 & 권역 필터 컨트롤 박스 */}
      <div className="p-5 sm:p-7 rounded-2xl bg-surface border border-border/90 shadow-xl space-y-5">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="region-search-input"
              className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-brand-cyan" />
              <span>전국 출장 지역 검색</span>
            </label>
            <span className="text-xs text-gray-400">
              {trimmedQuery ? (
                <>
                  통합 검색 결과:{" "}
                  <strong className="text-brand-cyan font-black">
                    {displayedRegions.length}
                  </strong>
                  곳 (전국 {allRegions.length.toLocaleString()}개 세부 행정구역 연동)
                </>
              ) : (
                <>
                  표시 거점:{" "}
                  <strong className="text-brand-cyan font-black">
                    {displayedRegions.length}
                  </strong>
                  개 주요 시·군·구 (세부 동·읍·면 포함 총{" "}
                  {allRegions.length.toLocaleString()}개 지역 페이지)
                </>
              )}
            </span>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-brand-cyan absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="region-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지역명 입력 (예: 배곧, 정왕동, 일산, 해운대...)"
              className="w-full pl-12 pr-24 py-3.5 sm:py-4 rounded-xl bg-[#0b0f14] border border-border focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 text-sm sm:text-base text-white placeholder:text-gray-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-card text-xs font-bold text-gray-300 border border-border"
                aria-label="검색어 지우기"
              >
                <X className="w-3.5 h-3.5" />
                지우기
              </button>
            )}
          </div>

          {/* 빠른 검색 추천 지역 칩 */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-brand-cyan flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3" />
              빠른 지역 검색:
            </span>
            {QUICK_REGION_CHIPS.map((chip) => {
              const active = trimmedQuery === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSearchQuery("");
                    } else {
                      setSelectedProvince("all");
                      setSearchQuery(chip);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-brand-cyan text-black font-bold"
                      : "bg-[#111720] hover:bg-card text-gray-300 border border-border/70 hover:border-brand-cyan/50"
                  }`}
                >
                  #{chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* 권역별 탭 필터 */}
        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-cyan" />
              <span>권역별 선택</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROVINCE_TABS.map((tab) => {
                const isActive = selectedProvince === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedProvince(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-brand-cyan text-black shadow-md shadow-brand-cyan/20"
                        : "bg-[#0d1218] border border-border text-gray-300 hover:text-white hover:border-brand-cyan/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(searchQuery || selectedProvince !== "all") && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-brand-cyan hover:underline self-end sm:self-auto shrink-0"
            >
              검색·필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 없음 안내 */}
      {displayedRegions.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-border text-center space-y-4">
          <div className="text-lg sm:text-xl font-black text-white">
            &ldquo;{searchQuery}&rdquo; 지역명과 일치하는 페이지를 찾지 못했습니다
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            읍·면·리 외곽 지역이나 산업단지, 도서·산간 지역도 넥스트바이크 직영 유압 리프트 화물차가{" "}
            <strong className="text-brand-cyan">전국 어디든 100% 당일 무상 출장</strong>하여 상차 전 선입금으로 매입합니다.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm font-bold text-white hover:border-brand-cyan"
            >
              전국 전체 지역 목록 보기
            </button>
            <a
              href="tel:01048952487"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4" />
              우리 동네 출장 가능 여부 바로 문의 (010-4895-2487)
            </a>
          </div>
        </div>
      ) : (
        /* 지역 카드 그리드 */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayedRegions.map((reg) => {
            // 검색어가 있을 때 관할 subDistricts 중 매칭된 동/읍/면 표시
            const matchedSubDongs = trimmedQuery
              ? (reg.subDistricts || []).filter((d) =>
                  d.toLowerCase().includes(trimmedQuery)
                )
              : [];

            return (
              <Link
                key={reg.slug}
                href={`/regions/${reg.slug}`}
                className="group block p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-brand-cyan hover:-translate-y-1 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-brand-cyan uppercase">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {reg.province}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="w-2.5 h-2.5 text-brand-cyan" />
                      {reg.dispatchTime}
                    </span>
                  </div>

                  <div className="mt-2 text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-brand-cyan transition-colors truncate">
                    {reg.name} 오토바이·바이크매입
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 truncate">
                    {reg.fullName}
                  </div>

                  {matchedSubDongs.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {matchedSubDongs.slice(0, 3).map((dong) => (
                        <span
                          key={dong}
                          className="px-2 py-0.5 rounded bg-brand-cyan/15 border border-brand-cyan/40 text-[10px] font-bold text-brand-cyan"
                        >
                          ✓ {dong} 출장
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {trimmedQuery && (
                  <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-brand-cyan">
                    <span>지역 상세 안내</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
