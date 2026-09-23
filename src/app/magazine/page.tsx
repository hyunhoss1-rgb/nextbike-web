"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  getPublishedArticles,
  MAGAZINE_CATEGORIES,
  MagazineCategory,
  getKstTodayString,
} from "@/data/magazine";
import JsonLd from "@/components/JsonLd";
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Home,
  Tag,
  Phone,
  Flame,
  Search,
} from "lucide-react";

export default function MagazineIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<MagazineCategory>("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const articles = getPublishedArticles();
  const todayStr = getKstTodayString();

  // 피처드 기사 (오늘 또는 최근 featured 기사)
  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  // 필터링된 기사 목록
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "전체" || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-14 space-y-12">
      <JsonLd
        type="main"
        canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/magazine"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 상단 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-brand-cyan font-bold">매거진</span>
        </nav>

        {/* 헤더 섹션 */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>NEXTBIKE EDITORIAL MAGAZINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            바이크 매입 백과 &amp; <span className="text-brand-cyan">라이더 실전 가이드</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            관공서 폐지 서류 작성법부터 현장 감가 방어, 중고 시세 분석, 안전 거래 수칙까지.
            넥스트바이크 정비·행정 전문팀이 매일 새로운 팁과 알짜 노하우를 엄선하여 발행합니다.
          </p>
        </div>

        {/* ================= 1. 오늘/이달의 추천 피처드 칼럼 배너 ================= */}
        {featuredArticle && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121924] via-surface to-[#0d131a] border border-brand-cyan/40 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan text-black font-extrabold text-xs shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  TODAY&apos;S PICK
                </span>
                <span className="text-xs font-bold text-brand-cyan px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
                  {featuredArticle.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featuredArticle.readingTime}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {featuredArticle.publishDate}
                </span>
              </div>

              <Link
                href={`/magazine/${featuredArticle.slug}`}
                className="block group-hover:text-brand-cyan transition-colors"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-brand-cyan transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </Link>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {featuredArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded bg-black/40 text-gray-400 border border-border/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/magazine/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-cyan hover:underline shrink-0"
                >
                  전문 읽기 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. 카테고리 탭 & 검색바 ================= */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-border/60">
          {/* 카테고리 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {MAGAZINE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-brand-cyan text-black border-brand-cyan shadow-md shadow-brand-cyan/20"
                    : "bg-surface text-gray-300 border-border hover:border-brand-cyan/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="칼럼 제목, 키워드 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
            />
          </div>
        </div>

        {/* ================= 3. 기사 카드 리스트 그리드 ================= */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border">
            <BookOpen className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">해당 조건에 맞는 칼럼이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const isToday = article.publishDate === todayStr;

              return (
                <article
                  key={article.slug}
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-brand-cyan hover:bg-card transition-all group flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-3">
                    {/* 상단 메타 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-brand-cyan px-2.5 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
                          {article.category}
                        </span>
                        {isToday && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#191600] px-2 py-0.5 rounded-full bg-brand-yellow animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            NEW 오늘 발행
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readingTime}
                      </span>
                    </div>

                    {/* 제목 */}
                    <Link href={`/magazine/${article.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    {/* 요약문 */}
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* 하단 정보 */}
                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {article.publishDate}
                    </span>
                    <Link
                      href={`/magazine/${article.slug}`}
                      className="font-bold text-brand-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      칼럼 읽기 <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ================= 4. 하단 상담 & 견적 신청 배너 ================= */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#111720] via-surface to-[#111720] border border-brand-cyan/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-brand-cyan flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              신속하고 정직한 최고가 출장 매입
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              타시던 바이크, 지금 시세가 궁금하신가요?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              전국 어디든 30초 온라인 신청으로 실거래 최고가 예상 견적을 즉시 회신해 드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:01048952487"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-brand-cyan/60 text-brand-cyan hover:bg-brand-cyan hover:text-black font-bold text-xs sm:text-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              010-4895-2487
            </a>
            <Link
              href="/#estimate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-brand-cyan hover:bg-brand-cyanHover text-black font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-brand-cyan/25"
            >
              30초 무료 견적 신청
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
