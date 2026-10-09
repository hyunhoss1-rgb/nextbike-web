import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/data/magazine";
import EstimateForm from "@/components/EstimateForm";
import JsonLd from "@/components/JsonLd";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  ChevronRight,
  Home,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Phone,
  MessageCircle,
  Share2,
  Sparkles,
  ArrowLeft,
  Wrench,
  Battery,
  MapPin,
  Timer,
  Zap,
  ShieldCheck,
} from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const title = `${article.title} | 오토바이 매거진`;
  const description = article.excerpt;
  const canonical = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/magazine/${article.slug}`;

  return {
    title,
    description,
    keywords: [
      ...article.tags,
      "오토바이매입",
      "중고바이크시세",
      "당일선입금",
      "바이크매거진",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "오토바이 매거진",
      locale: "ko_KR",
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default function MagazineDetailPage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, 3);
  const canonicalUrl = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/magazine/${article.slug}`;

  return (
    <div className="py-6 sm:py-10 space-y-12">
      <JsonLd
        type="magazine"
        canonicalUrl={canonicalUrl}
        articleTitle={article.title}
        articleDescription={article.excerpt}
        articleDate={article.publishDate}
        articleAuthor={article.author}
        articleTags={article.tags}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link href="/magazine" className="hover:text-white">
            매거진
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-300">{article.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 hidden sm:inline" />
          <span className="text-brand-cyan font-bold truncate max-w-xs hidden sm:inline">
            {article.title}
          </span>
        </nav>

        {/* 2열 메인 레이아웃: 좌측 본문 vs 우측 견적/상담 사이드바 */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* ================= 좌측: 칼럼 본문 (8열) ================= */}
          <main className="lg:col-span-8 space-y-8">
            {/* 칼럼 헤더 */}
            <header className="space-y-4 pb-6 border-b border-border/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-brand-cyan px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
                  {article.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTime}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.publishDate}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {article.author}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug break-keep">
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-sm sm:text-base text-brand-cyan/90 font-medium">
                  {article.subtitle}
                </p>
              )}

              {/* 핵심 요약 리드문 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface/90 border border-border text-sm text-gray-300 leading-relaxed italic border-l-4 border-l-brand-cyan">
                {article.excerpt}
              </div>

              {/* 태그 목록 */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-card text-gray-400 border border-border flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-brand-cyan/70" />
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* 1. 작업 전 핵심 퀵 인포 대시보드 (난이도·시간·규격·위치) */}
            {article.quickInfo && (
              <div className="rounded-2xl bg-gradient-to-br from-card via-surface to-surface border border-brand-cyan/30 p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-brand-cyan font-extrabold uppercase tracking-wider block">
                        정비 매뉴얼 팩트체크
                      </span>
                      <span className="text-sm sm:text-base font-black text-white">
                        작업 전 핵심 요약 대시보드
                      </span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan font-bold border border-brand-cyan/30">
                    1분 요약
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3.5 rounded-xl bg-card/80 border border-border/60 space-y-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <Wrench className="w-3.5 h-3.5 text-brand-cyan" />
                      작업 난이도
                    </span>
                    <p className="text-xs sm:text-sm font-black text-white break-keep">
                      {article.quickInfo.difficulty}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card/80 border border-border/60 space-y-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      예상 시간
                    </span>
                    <p className="text-xs sm:text-sm font-black text-white">
                      {article.quickInfo.timeRequired}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card/80 border border-border/60 space-y-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      순정 규격
                    </span>
                    <p className="text-xs sm:text-sm font-black text-brand-cyan break-all">
                      {article.quickInfo.batteryModel}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card/80 border border-border/60 space-y-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      장착 위치
                    </span>
                    <p className="text-xs sm:text-sm font-black text-white line-clamp-2">
                      {article.quickInfo.locationSummary}
                    </p>
                  </div>
                </div>

                {article.quickInfo.keyTools && article.quickInfo.keyTools.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-400 font-bold shrink-0">필요 공구:</span>
                    {article.quickInfo.keyTools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md bg-surface text-gray-200 border border-border/80 text-[11px] font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. 작업 전 준비물 & 추천 공구 체크리스트 */}
            {article.toolsChecklist && article.toolsChecklist.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-brand-cyan" />
                  <h3 className="text-base sm:text-lg font-black text-white">
                    작업 전 필수 준비물 &amp; 추천 공구 가이드
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {article.toolsChecklist.map((tool, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-xl bg-card/80 border border-border/60 flex items-start gap-2.5"
                    >
                      <div className="pt-0.5 shrink-0">
                        {tool.essential ? (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            필수
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                            권장
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs sm:text-sm font-bold text-white block">
                          {tool.name}
                        </span>
                        <span className="text-xs text-gray-400 block">
                          {tool.purpose}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. 칼럼 본문 섹션들 */}
            <div className="space-y-8 text-gray-200 leading-relaxed text-sm sm:text-base">
              {article.sections.map((section, idx) => (
                <section key={idx} className="space-y-3.5">
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight pt-2 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-brand-cyan rounded-full inline-block shrink-0" />
                    <span>{section.heading}</span>
                  </h2>

                  <div className="space-y-3 text-gray-300 leading-relaxed">
                    {section.content.map((p, pIdx) => (
                      <p key={pIdx} className="break-keep">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* 콜아웃 박스 (Tip, Warning, Check) */}
                  {section.callout && (
                    <div
                      className={`p-4 sm:p-5 rounded-xl border my-4 space-y-1.5 ${
                        section.callout.type === "warning"
                          ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                          : section.callout.type === "tip"
                          ? "bg-brand-cyan/10 border-brand-cyan/40 text-cyan-200"
                          : "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        {section.callout.type === "warning" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : section.callout.type === "tip" ? (
                          <Lightbulb className="w-4 h-4 text-brand-cyan shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>{section.callout.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm opacity-90 leading-relaxed pl-6 whitespace-pre-line">
                        {section.callout.description}
                      </p>
                    </div>
                  )}
                </section>
              ))}

              {/* 4. 배터리 규격 및 호환 제품 상세 비교표 (있을 경우) */}
              {article.specTable && (
                <section className="space-y-3 pt-4">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-brand-cyan" />
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {article.specTable.title}
                    </h3>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-border shadow-lg">
                    <table className="w-full text-left text-xs sm:text-sm text-gray-300">
                      <thead className="bg-card text-brand-cyan border-b border-border">
                        <tr>
                          {article.specTable.headers.map((th, hIdx) => (
                            <th key={hIdx} className="px-4 py-3 font-bold whitespace-nowrap">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-surface">
                        {article.specTable.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={
                              rIdx % 2 === 0
                                ? "bg-surface/50 hover:bg-card/50"
                                : "bg-card/20 hover:bg-card/50"
                            }
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-3 whitespace-nowrap ${
                                  cIdx === 0 ? "font-bold text-white" : ""
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {article.specTable.note && (
                    <p className="text-xs text-gray-400 pl-1 leading-relaxed">
                      * {article.specTable.note}
                    </p>
                  )}
                </section>
              )}

              {/* 5. 정비·관리 칼럼 전용: 배터리 수명 2배 연장 골든룰 */}
              {article.category === "정비·관리" && (
                <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-brand-cyan/30 space-y-3">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base text-white">
                    <ShieldCheck className="w-5 h-5 text-brand-cyan" />
                    <span>엔지니어가 전하는 배터리 수명 2배 연장 4대 골든룰</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-1">
                    <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
                      <span className="font-bold text-brand-cyan block">1. 주 1회 이상 실주행 충전</span>
                      <p className="text-gray-400">
                        제자리 공회전은 발전 전압이 낮아 충전되지 않습니다. 3,000rpm 이상 실주행 20분 이상이 권장됩니다.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
                      <span className="font-bold text-brand-cyan block">2. 블랙박스 상시 차단 전압</span>
                      <p className="text-gray-400">
                        주차 녹화 저전압 차단을 최소 12.3V~12.4V 이상으로 설정하여 암전류 완전 방전을 사전 차단하세요.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
                      <span className="font-bold text-brand-cyan block">3. 2주 이상 주차 시 마이너스 분리</span>
                      <p className="text-gray-400">
                        장기 출장이나 동절기 봉인 시 마이너스(-) 단자만 풀어 절연 테이프로 감아두면 자연 방전을 90% 방지합니다.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
                      <span className="font-bold text-brand-cyan block">4. 방전 2회 누적 시 셀 영구 손상</span>
                      <p className="text-gray-400">
                        완전 방전(10.5V 이하)이 2회 이상 발생한 납산 배터리는 극판 황산화로 충전해도 며칠 내 재방전됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. 방치 바이크 처분 실익 비교 가이드 */}
              {article.category === "정비·관리" && (
                <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border space-y-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-yellow" />
                    오래 방치된 바이크, 배터리 교체 vs 당일 100% 선입금 처분 실익 비교
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-surface border border-red-500/30 space-y-1.5">
                      <span className="font-bold text-red-400 block">직접 수리 후 유지/개인거래 시</span>
                      <ul className="text-gray-400 space-y-1 list-disc pl-4">
                        <li>순정 AGM 배터리 신품 구입 및 공임: 약 8~15만 원</li>
                        <li>방치로 인한 엔진오일·타이어 경화 교체비: 10~25만 원</li>
                        <li>구청 방문 사용폐지 및 번호판 반납 시간 소요</li>
                        <li>개인거래 후 시동 불량 재발 시 구매자 환불 갈등 위험</li>
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface border border-brand-cyan/40 space-y-1.5">
                      <span className="font-bold text-brand-cyan block">24시 직영 당일 100% 선입금 처분 시</span>
                      <ul className="text-gray-300 space-y-1 list-disc pl-4 font-medium">
                        <li>배터리 방전·시동 불능 상태 그대로 추가 감가 없이 매입</li>
                        <li>집 앞 전문 유압 리프트 트럭 당일 무료 출장 (출장비 0원)</li>
                        <li>상차 전 현장 100% 전액 즉시 계좌 입금 원칙 준수</li>
                        <li>관공서 이륜차 사용폐지 신고 증명서 발급 100% 무료 대행</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. FAQ 섹션 (있을 경우) */}
              {article.faq && article.faq.length > 0 && (
                <section className="pt-6 border-t border-border/80 space-y-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-brand-cyan rounded-full inline-block" />
                    자주 묻는 질문 (FAQ)
                  </h2>

                  <div className="space-y-3">
                    {article.faq.map((item, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-4 sm:p-5 rounded-xl bg-surface border border-border space-y-2"
                      >
                        <div className="font-bold text-sm sm:text-base text-brand-cyan flex items-start gap-2">
                          <span className="font-black text-base">Q.</span>
                          <span>{item.question}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 pl-6 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* 본문 중간 자연스러운 견적 유도 인라인 배너 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-brand-cyan/20 via-surface to-brand-cyan/10 border border-brand-cyan/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan">
                <Sparkles className="w-4 h-4" />
                <span>24시 직영 무료 출장 매입</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                타시던 바이크, 배터리 방전·시동 불능차도 당일 100% 선입금 처분!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                전국 집 앞 당일 방문 · 상차 전 100% 즉시 계좌입금 · 구청 무료 폐지 대행까지 한 번에 완료됩니다.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="tel:01048952487"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  전화 상담 010-4895-2487
                </a>
                <a
                  href="https://open.kakao.com/o/skSUkiHg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-yellow text-[#191600] font-black text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  카카오톡 1:1 상담
                </a>
              </div>
            </div>

            {/* 작성자 프로필 카드 */}
            <div className="p-5 rounded-2xl bg-surface border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center font-bold text-brand-cyan shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-cyan block">글쓴이</span>
                <span className="text-sm font-bold text-white block">{article.author}</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  현장 10년 이상 경력의 바이크 정비 및 행정 엔지니어들이 검증된 사실만을 바탕으로 작성합니다.
                </p>
              </div>
            </div>

            {/* 하단 목록으로 돌아가기 버튼 */}
            <div className="pt-4 flex items-center justify-between">
              <Link
                href="/magazine"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-400 hover:text-brand-cyan transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                매거진 전체 목록으로
              </Link>
            </div>
          </main>

          {/* ================= 우측: 30초 견적 사이드바 (4열, sticky) ================= */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-xl">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>30초 빠른 시세 조회</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  내 오토바이 최고가 견적
                </h3>
                <p className="text-xs text-gray-400">
                  정보를 남겨주시면 5분 내 정확한 시세를 안내해 드립니다.
                </p>
              </div>

              <EstimateForm />
            </div>

            {/* 안심 보증 4대 약속 */}
            <div className="rounded-2xl bg-card border border-border/80 p-5 space-y-3 text-xs">
              <span className="font-bold text-white block pb-2 border-b border-border/60">
                24시 직영 4대 안심 거래 보증
              </span>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  <span>상차 전 100% 현장 계좌 전액 입금</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  <span>사전 합의 견적 부당 감가 0% 원칙</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  <span>관공서 이륜차 폐지 신고 100% 무료 대행</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  <span>전국 집 앞 당일 즉시 무료 출장</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* ================= 하단: 함께 읽으면 좋은 추천 칼럼 (3열 카드) ================= */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-border/80 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>함께 읽는 추천 칼럼</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                관련 라이더 매입 팁 &amp; 가이드
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/magazine/${rel.slug}`}
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-brand-cyan hover:bg-card transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-cyan px-2 py-0.5 rounded bg-brand-cyan/10">
                        {rel.category}
                      </span>
                      <span className="text-gray-400">{rel.readingTime}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/60 text-xs font-bold text-brand-cyan flex items-center justify-between">
                    <span className="text-gray-500 font-normal text-[11px]">{rel.publishDate}</span>
                    <span className="flex items-center gap-0.5">
                      읽기 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
