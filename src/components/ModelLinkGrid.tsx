"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BIKE_MODELS } from "@/data/models";
import { Bike, ChevronRight } from "lucide-react";

interface ModelLinkGridProps {
  currentSlug?: string;
}

const BRAND_TABS = [
  { key: "all", label: "전체" },
  { key: "혼다", label: "혼다" },
  { key: "야마하", label: "야마하" },
  { key: "BMW", label: "BMW" },
  { key: "할리데이비슨", label: "할리데이비슨" },
  { key: "베스파", label: "베스파" },
  { key: "가와사키", label: "가와사키" },
  { key: "스즈키", label: "스즈키" },
  { key: "etc", label: "기타인기브랜드" },
];

export default function ModelLinkGrid({ currentSlug }: ModelLinkGridProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");

  const filteredModels = useMemo(() => {
    if (selectedBrand === "all") return BIKE_MODELS;
    if (selectedBrand === "etc") {
      return BIKE_MODELS.filter(
        (m) =>
          !["혼다", "야마하", "가와사키", "스즈키"].includes(m.brand) &&
          !m.brand.includes("BMW") &&
          !m.brand.includes("할리") &&
          !m.brand.includes("베스파")
      );
    }
    return BIKE_MODELS.filter((m) => m.brand.includes(selectedBrand));
  }, [selectedBrand]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Bike className="w-5 h-5 text-brand-cyan shrink-0" />
          <span>자주 거래되는 인기 바이크 기종별 최고가 매입</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
            총 {BIKE_MODELS.length}개 기종
          </span>
        </h3>
        <Link
          href="/models"
          className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1 shrink-0"
        >
          기종별 매입 기준 상세 보기
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 브랜드별 필터 탭 (모바일 중앙 정렬) */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pb-1">
        {BRAND_TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? BIKE_MODELS.length
              : tab.key === "etc"
              ? BIKE_MODELS.filter(
                  (m) =>
                    !["혼다", "야마하", "가와사키", "스즈키"].includes(m.brand) &&
                    !m.brand.includes("BMW") &&
                    !m.brand.includes("할리") &&
                    !m.brand.includes("베스파")
                ).length
              : BIKE_MODELS.filter((m) => m.brand.includes(tab.key)).length;

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredModels.map((model) => {
          const isCurrent = model.slug === currentSlug;
          return (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
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
    </div>
  );
}
