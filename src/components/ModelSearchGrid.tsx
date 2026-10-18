"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { BikeModel } from "@/data/models";
import {
  Bike,
  Search,
  X,
  ChevronRight,
  Phone,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

interface ModelSearchGridProps {
  models: BikeModel[];
}

const BRAND_TABS = [
  { key: "all", label: "전체" },
  { key: "혼다", label: "혼다 (Honda)" },
  { key: "야마하", label: "야마하 (Yamaha)" },
  { key: "SYM", label: "SYM" },
  { key: "킴코", label: "킴코 (KYMCO)" },
  { key: "국산", label: "DNA·KR (대림·효성)" },
  { key: "스즈키", label: "스즈키 (Suzuki)" },
  { key: "가와사키", label: "가와사키 (Kawasaki)" },
  { key: "BMW", label: "BMW 모토라드" },
  { key: "할리", label: "할리데이비슨" },
  { key: "베스파", label: "베스파 (Vespa)" },
  { key: "etc", label: "유럽·기타 수입" },
];

const CATEGORY_TABS = [
  { key: "all", label: "전 장르" },
  { key: "스쿠터", label: "스쿠터·상용" },
  { key: "네이키드", label: "네이키드·클래식" },
  { key: "스포츠", label: "레플리카·스포츠" },
  { key: "투어러", label: "투어러·어드벤처" },
  { key: "크루저", label: "크루저·아메리칸" },
];

const QUICK_KEYWORDS = [
  "PCX125",
  "엔맥스",
  "포르자",
  "엑스맥스",
  "슈퍼커브",
  "벤리110",
  "보이저",
  "크루심",
  "시티베스트",
  "다운타운",
  "R3",
  "S1000RR",
  "할리",
  "베스파",
];

// 한글 발음/별칭 -> 영문/정식 명칭 매핑 사전
const KOREAN_ALIAS_MAP: Record<string, string[]> = {
  피씨엑스: ["pcx", "pcx125"],
  피시엑스: ["pcx", "pcx125"],
  엔맥스: ["nmax", "nmax125", "nmax155"],
  앤맥스: ["nmax", "nmax125", "nmax155"],
  엑스맥스: ["xmax", "xmax300"],
  티맥스: ["tmax", "tmax560"],
  알삼: ["r3", "yzf-r3"],
  알쓰리: ["r3", "yzf-r3"],
  알세븐: ["r7", "yzf-r7"],
  알원: ["r1", "yzf-r1"],
  알식스: ["zx-6r", "r6"],
  엠티: ["mt-03", "mt-07", "mt-09", "mt-10", "mt-125"],
  엠티공삼: ["mt-03"],
  엠티공칠: ["mt-07"],
  엠티공구: ["mt-09"],
  엠티텐: ["mt-10"],
  스천알: ["s1000rr", "s1000r"],
  스천: ["s1000rr", "s1000r", "s1000xr"],
  알나인티: ["r ninet", "ninet"],
  지에스: ["gs", "r1250gs", "r1300gs", "f850gs", "f900gs", "g310gs"],
  레봉: ["r1250gs", "r1300gs"],
  슈퍼커브: ["cub", "슈퍼커브"],
  커브: ["cub", "슈퍼커브", "ct125", "c125"],
  헌터커브: ["ct125"],
  벤리: ["벤리", "benly"],
  포르자: ["포르자", "forza"],
  어드레스: ["어드레스", "address"],
  버그만: ["버그만", "burgman"],
  하야부사: ["하야부사", "hayabusa"],
  부사: ["하야부사", "hayabusa"],
  보이저: ["보이저", "joymax", "sym"],
  크루심: ["크루심", "cruisym"],
  다운타운: ["다운타운", "downtown"],
  익사이팅: ["익사이팅", "xciting"],
  시티: ["시티", "citi"],
  대림: ["dna", "대림", "시티", "보이저", "vf", "엠보이"],
  디엔에이: ["dna", "대림"],
  효성: ["kr", "효성", "코멧", "미라쥬", "아퀼라", "델리로드"],
  케이알: ["kr", "효성"],
  할리: ["할리", "아이언", "포티에잇", "팻보이", "브레이크아웃", "스트리트글라이드", "로드글라이드", "스포스터", "로드킹"],
  두카티: ["두카티", "파니갈레", "몬스터", "스크램블러", "멀티스트라다"],
  트라이엄프: ["트라이엄프", "본네빌", "트라이던트", "스피드400", "스크램블러"],
  로얄엔필드: ["로얄엔필드", "클래식350", "메테오", "히말라얀", "인터셉터"],
  존테스: ["존테스", "350e", "350d"],
  장고: ["푸조", "장고"],
  드래그스터: ["이탈젯", "드래그스터"],
};

export function matchBikeModel(model: BikeModel, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const targetText = [
    model.name,
    model.brand,
    model.category,
    model.displacement,
    model.summary,
    model.priceRange,
    model.slug.replace(/-/g, " "),
  ]
    .join(" ")
    .toLowerCase();

  // 공백 단위로 쪼개서 모든 토큰이 매칭되는지 확인 (또는 별칭 매칭)
  const tokens = q.split(/\s+/).filter(Boolean);

  return tokens.every((token) => {
    if (targetText.includes(token)) return true;

    // 한글 별칭 사전 매칭
    for (const [aliasKey, mappedTerms] of Object.entries(KOREAN_ALIAS_MAP)) {
      if (aliasKey.includes(token) || token.includes(aliasKey)) {
        if (mappedTerms.some((term) => targetText.includes(term.toLowerCase()))) {
          return true;
        }
      }
    }
    return false;
  });
}

function matchesBrandTab(model: BikeModel, brandKey: string): boolean {
  if (brandKey === "all") return true;
  if (brandKey === "국산") {
    return (
      model.brand.includes("DNA") ||
      model.brand.includes("대림") ||
      model.brand.includes("KR") ||
      model.brand.includes("효성")
    );
  }
  if (brandKey === "etc") {
    return (
      !["혼다", "야마하", "SYM", "킴코", "스즈키", "가와사키", "베스파"].includes(model.brand) &&
      !model.brand.includes("DNA") &&
      !model.brand.includes("KR") &&
      !model.brand.includes("BMW") &&
      !model.brand.includes("할리")
    );
  }
  return model.brand.includes(brandKey);
}

function matchesCategoryTab(model: BikeModel, catKey: string): boolean {
  if (catKey === "all") return true;
  const cat = model.category;
  if (catKey === "스쿠터") {
    return (
      cat.includes("스쿠터") ||
      cat.includes("언더본") ||
      cat.includes("상용") ||
      cat.includes("비즈니스") ||
      cat.includes("트라이크")
    );
  }
  if (catKey === "네이키드") {
    return (
      cat.includes("네이키드") ||
      cat.includes("클래식") ||
      cat.includes("로드스터") ||
      cat.includes("스크램블러") ||
      cat.includes("미니벨로") ||
      cat.includes("레트로")
    );
  }
  if (catKey === "스포츠") {
    return cat.includes("스포츠") || cat.includes("레플리카") || cat.includes("슈퍼스포츠");
  }
  if (catKey === "투어러") {
    return cat.includes("투어러") || cat.includes("어드벤처") || cat.includes("멀티퍼포즈");
  }
  if (catKey === "크루저") {
    return cat.includes("크루저") || cat.includes("배거") || cat.includes("아메리칸");
  }
  return true;
}

export default function ModelSearchGrid({ models }: ModelSearchGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      if (!matchesBrandTab(model, selectedBrand)) return false;
      if (!matchesCategoryTab(model, selectedCategory)) return false;
      if (!matchBikeModel(model, searchQuery)) return false;
      return true;
    });
  }, [models, selectedBrand, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-8">
      {/* 검색 & 필터 컨트롤 박스 */}
      <div className="p-5 sm:p-7 rounded-2xl bg-surface border border-border/90 shadow-xl space-y-5">
        {/* 검색창 */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="bike-model-search"
              className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-brand-cyan" />
              <span>내 바이크 차종·기종 빠른 검색</span>
            </label>
            <span className="text-xs text-gray-400">
              검색 결과:{" "}
              <strong className="text-brand-cyan font-black">
                {filteredModels.length}
              </strong>
              개 기종 / 전체 {models.length}개 인기 기종
            </span>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-brand-cyan absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="bike-model-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="차종명, 브랜드, 배기량 입력 (예: PCX, 엔맥스, 벤리, 보이저, 크루심, 시티베스트, R3, 할리, 125cc...)"
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

          {/* 인기 검색어 칩 */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-brand-cyan flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3" />
              자주 찾는 기종:
            </span>
            {QUICK_KEYWORDS.map((kw) => {
              const active = searchQuery.toLowerCase() === kw.toLowerCase();
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSearchQuery("");
                    } else {
                      setSelectedBrand("all");
                      setSelectedCategory("all");
                      setSearchQuery(kw);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-brand-cyan text-black font-bold"
                      : "bg-[#111720] hover:bg-card text-gray-300 border border-border/70 hover:border-brand-cyan/50"
                  }`}
                >
                  #{kw}
                </button>
              );
            })}
          </div>
        </div>

        {/* 제조사(브랜드)별 필터 탭 */}
        <div className="pt-4 border-t border-border/60 space-y-2.5">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-brand-cyan" />
            <span>브랜드별 선택</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BRAND_TABS.map((tab) => {
              const count = models.filter((m) => matchesBrandTab(m, tab.key)).length;
              const isActive = selectedBrand === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedBrand(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-brand-cyan text-black shadow-md shadow-brand-cyan/20"
                      : "bg-[#0d1218] border border-border text-gray-300 hover:text-white hover:border-brand-cyan/50"
                  }`}
                >
                  {tab.label}{" "}
                  <span className="opacity-75 text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 장르(카테고리)별 필터 탭 */}
        <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-cyan" />
              장르:
            </span>
            {CATEGORY_TABS.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-yellow text-[#191600] font-extrabold"
                      : "bg-[#0d1218] border border-border/70 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {(searchQuery || selectedBrand !== "all" || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-brand-cyan hover:underline self-end sm:self-auto"
            >
              필터 전체 초기화
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과가 없을 때 안내 */}
      {filteredModels.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-border text-center space-y-4">
          <div className="text-lg sm:text-xl font-black text-white">
            &ldquo;{searchQuery}&rdquo; 검색어와 일치하는 등록 기종을 찾지 못했습니다
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            넥스트바이크는 홈페이지 목록에 없는 구형 2T 스쿠터, 단종 바이크, 직수입 레어 기종, 전기 오토바이, 사륜 오토바이(ATV)까지{" "}
            <strong className="text-brand-cyan">전 차종 100% 당일 최고가 출장 매입</strong>합니다.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm font-bold text-white hover:border-brand-cyan"
            >
              전체 {models.length}개 기종 다시 보기
            </button>
            <a
              href="tel:01048952487"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4" />
              전 차종 즉시 시세 상담 (010-4895-2487)
            </a>
          </div>
        </div>
      ) : (
        /* 기종 리스트 카드 그리드 */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredModels.map((bike) => (
            <Link
              key={bike.slug}
              href={`/models/${bike.slug}`}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-brand-cyan/80 hover:-translate-y-1 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-brand-cyan">{bike.brand}</span>
                  <span className="px-2 py-0.5 rounded bg-card text-gray-300 border border-border/60 font-medium">
                    {bike.displacement}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-brand-cyan transition-colors mb-1.5">
                  {bike.name}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-yellow mb-2.5">
                  <span>평균 매입 시세: {bike.priceRange}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {bike.summary}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                  {bike.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-cyan group-hover:translate-x-0.5 transition-transform">
                  매입 시세·기준 보기
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
