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

  const title = `${article.title} | 넥스트바이크 매거진`;
  const description = article.excerpt;
  const canonical = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/magazine/${article.slug}`;

  return {
    title,
    description,
    keywords: [
      ...article.tags,
      "오토바이매입",
      "중고바이크시세",
      "넥스트바이크",
      "바이크매거진",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "넥스트바이크 매거진",
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

            {/* 칼럼 본문 섹션들 */}
            <div className="space-y-8 text-gray-200 leading-relaxed text-sm sm:text-base">
              {article.sections.map((section, idx) => (
                <section key={idx} className="space-y-3.5">
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight pt-2 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-brand-cyan rounded-full inline-block" />
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

              {/* FAQ 섹션 (있을 경우) */}
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
                        className="p-4 rounded-xl bg-surface border border-border space-y-1.5"
                      >
                        <div className="font-bold text-sm text-brand-cyan flex items-start gap-2">
                          <span className="font-black">Q.</span>
                          <span>{item.question}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 pl-5 leading-relaxed">
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
                <span>넥스트바이크 24시 직영 출장 매입</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                타시던 바이크, 복잡한 서류 없이 당일 현금화하세요!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                전국 집 앞 당일 방문 · 현장 100% 즉시 계좌입금 · 구청 무료 폐지 대행까지 한 번에 완료됩니다.
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
                넥스트바이크 4대 안심 거래 보증
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
