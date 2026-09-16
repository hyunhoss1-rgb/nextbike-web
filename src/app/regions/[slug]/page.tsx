import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { REGIONS, getRegionBySlug, getDongsForCity } from "@/data/regions";
import { BIKE_MODELS } from "@/data/models";
import EstimateForm from "@/components/EstimateForm";
import RegionTableGrid from "@/components/RegionTableGrid";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import {
  MapPin,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle2,
  ChevronRight,
  Home,
  Bike,
  Sparkles,
  ClipboardPen,
  Clock,
  Truck,
  Banknote,
  Send,
} from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return REGIONS.map((region) => ({
    slug: region.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = getRegionBySlug(params.slug);
  if (!region) return {};

  const title = `${region.name} 오토바이매입 | 당일 최고가 출장 매입`;
  const description = `${region.fullName} 전역 중고 오토바이 출장 매입 전문 넥스트바이크. ${region.description} 실차 확인 후 100% 당일 전액 입금.`;
  const canonical = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/regions/${region.slug}`;

  return {
    title,
    description,
    keywords: [
      `${region.name}오토바이매입`,
      `${region.name} 중고오토바이매입`,
      `${region.name}바이크매입`,
      `${region.name}스쿠터매입`,
      `${region.fullName} 오토바이 출장매입`,
      `${region.name} 중고바이크`,
      "넥스트바이크",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "넥스트바이크",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default function RegionPage({ params }: Props) {
  const region = getRegionBySlug(params.slug);
  if (!region) {
    notFound();
  }

  const canonicalUrl = `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/regions/${region.slug}`;

  // 이 지역 인기 모델 매핑
  const popularBikeList = BIKE_MODELS.filter((m) =>
    region.popularModels.includes(m.slug)
  );

  // 이 도시에 소속된 동(洞) 또는 구 단위 페이지 목록
  const childDongs = getDongsForCity(region.slug);

  const parentRegion = region.parentSlug ? getRegionBySlug(region.parentSlug) : undefined;
  const grandParentRegion = parentRegion?.parentSlug ? getRegionBySlug(parentRegion.parentSlug) : undefined;

  // 동 페이지일 경우 형제 동 목록 (같은 상위 시/구 내의 다른 동들)
  const siblingDongs = parentRegion ? getDongsForCity(parentRegion.slug) : [];

  // 세부 행정동/구 목록 (인접·세부 지역 박스에 표시)
  const subDistrictList = region.subDistricts && region.subDistricts.length > 0
    ? region.subDistricts
    : [region.name + " 전역"];

  // 세부 구/동 클릭 시 하위 독립 페이지(또는 인접 동 페이지)로의 정확한 매칭 헬퍼
  const getMatchedChildPage = (sub: string) => {
    const cleanSub = sub.trim();
    // 1차: 직속 하위 구/동 검색, 2차: 직속 하위가 없으면 형제 동 풀에서 검색
    const pool = childDongs.length > 0 ? childDongs : siblingDongs;

    // 1. 정확 일치
    const exact = pool.find((cd) => {
      const cleanCd = cd.name
        .replace(region.name, "")
        .replace(parentRegion?.name || "", "")
        .trim();
      return cleanCd === cleanSub || cd.name === cleanSub || cd.name === `${region.name} ${cleanSub}` || cd.name === `${parentRegion?.name} ${cleanSub}` || cd.name.endsWith(` ${cleanSub}`);
    });
    if (exact) return exact;

    // 2. 접두사 일치
    const bound = pool.find((cd) => {
      const cleanCd = cd.name
        .replace(region.name, "")
        .replace(parentRegion?.name || "", "")
        .trim();
      return cleanCd.startsWith(cleanSub) || cleanSub.startsWith(cleanCd);
    });
    if (bound) return bound;

    // 3. 부분 포함
    const partial = pool.find((cd) => {
      const cleanCd = cd.name
        .replace(region.name, "")
        .replace(parentRegion?.name || "", "")
        .trim();
      return cleanCd.includes(cleanSub) || cleanSub.includes(cleanCd);
    });
    if (partial) return partial;

    // 4. 전국 전체 REGIONS 풀 매칭 (충북 -> 청주, 경기 -> 수원 등 도 단위/상위 시 교차 매칭 100% 지원)
    // 4-1. 완전 일치
    const globalExact = REGIONS.find(
      (r) => r.name === cleanSub || r.name === `${region.name} ${cleanSub}`
    );
    if (globalExact) return globalExact;

    // 4-2. 접미사 일치
    const globalEndsWith = REGIONS.find((r) => r.name.endsWith(` ${cleanSub}`));
    if (globalEndsWith) return globalEndsWith;

    // 4-3. 부분 포함
    return REGIONS.find(
      (r) => (r.slug !== region.slug && (cleanSub.includes(r.name) || r.name.includes(cleanSub)))
    );
  };

  return (
    <div className="py-6 sm:py-10 space-y-16">
      <JsonLd
        type="region"
        regionName={region.name}
        canonicalUrl={canonicalUrl}
      />

      {/* ================= 1. 상단 브레드크럼 & 2열 히어로 레이아웃 (사진 3 완벽 구현) ================= */}
      <section className="relative overflow-hidden rounded-3xl p-4 sm:p-8 border border-border/60 bg-surface/40 max-w-7xl mx-auto">
        {/* 백그라운드 바이크 이미지 */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
          <Image
            src="/images/hero-bike.jpg"
            alt={`${region.name} 오토바이 매입`}
            fill
            priority
            className="object-cover object-[80%_center] opacity-15 md:opacity-20 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d10] via-[#0a0d10]/95 md:via-[#0a0d10]/80 to-[#0a0d10]/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d10]/80 via-transparent to-[#0a0d10]" />
        </div>

        <div className="relative z-10">
          {/* 브레드크럼: 홈 > 전국 오토바이매입 > [조부모(있을 경우)] > [상위도시(있을 경우)] > [지역] */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link href="/regions" className="hover:text-white">
            전국 오토바이매입
          </Link>
          {grandParentRegion && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <Link href={`/regions/${grandParentRegion.slug}`} className="hover:text-white">
                {grandParentRegion.name}
              </Link>
            </>
          )}
          {parentRegion && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <Link href={`/regions/${parentRegion.slug}`} className="hover:text-white">
                {parentRegion.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-brand-cyan font-bold">{region.name}</span>
        </nav>

        {/* 2열 히어로: 좌측(헤드라인/체크리스트/CTA/4단계) vs 우측(인접·세부 지역 박스) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* 좌측 메인 정보 */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* 지역 배지 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{region.fullName} 오토바이 매입 전문</span>
            </div>

            {/* H1 메인 타이틀 */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {region.name} <span className="text-brand-cyan">오토바이 매입</span>
            </h1>

            {/* 상세 소개글 */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {region.fullName} 전지역 중고 오토바이·스쿠터 최고가 당일 출장 매입. 방치차·사고차·고장차·서류 분실 상담 환영.
            </p>

            {/* 4대 체크포인트 (사진 3의 4개 체크 불릿) */}
            <div className="grid sm:grid-cols-2 gap-2.5 py-1 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>상차 전 100% 현장 계좌 입금 확인</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>사전 합의 견적 부당 감가 0% 보증</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>시동 불능·사고차·방치 바이크 전문 인수</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>관공서 명의이전 대행 & 출장비 0원 지원</span>
              </div>
            </div>

            {/* 3대 CTA 버튼: 전화상담 / 온라인 견적 신청 / 카카오톡 상담 (사진 3) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 pt-2 w-full max-w-md mx-auto lg:mx-0">
              <a
                href="tel:01048952487"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-surface border border-border hover:border-brand-cyan text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-brand-cyan" />
                <span>전화 상담 010-4895-2487</span>
              </a>

              <a
                href="#estimate-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan/90 text-black font-black text-xs sm:text-sm transition-all shadow-lg shadow-brand-cyan/25 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>온라인 견적 신청</span>
              </a>

              <a
                href="https://open.kakao.com/o/skSUkiHg"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-yellow hover:bg-[#ffe033] text-[#191600] font-black text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>카카오톡 상담</span>
              </a>
            </div>

            {/* 4대 라이더 안심 보증 바 */}
            <div className="pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-surface/70 border border-border/80 text-center">
                <div className="p-2 rounded-lg bg-card/60">
                  <div className="text-[11px] font-extrabold text-brand-cyan">100% 사전 입금</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">상차 전 계좌 확인</div>
                </div>
                <div className="p-2 rounded-lg bg-card/60">
                  <div className="text-[11px] font-extrabold text-brand-cyan">부당 감가 ZERO</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">사전 협의 견적 보증</div>
                </div>
                <div className="p-2 rounded-lg bg-card/60">
                  <div className="text-[11px] font-extrabold text-brand-cyan">출장비 0원 지원</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{region.name} 전역 무상 방문</div>
                </div>
                <div className="p-2 rounded-lg bg-card/60">
                  <div className="text-[11px] font-extrabold text-brand-cyan">당일 서류 완료</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">24시간 내 구청 이전</div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 전용 카드: 관내 출장 권역 및 행정동 안내 */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-xl">
              <div className="border-b border-border/80 pb-3">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
                  <MapPin className="w-4 h-4 text-brand-cyan" />
                  <span>
                    {region.isDong
                      ? `${region.name} 인접 출장 권역 및 주요 행정동`
                      : `${region.name} 관내 출장 권역 및 행정동`}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {region.isDong
                    ? `30분 내외 신속 출장이 가능한 ${region.name} 인근 주요 행정동 및 인접 거점입니다.`
                    : `30분 내외 신속 출장이 가능한 ${region.name} 관내 주요 행정동 및 인접 거점입니다.`}
                </p>
              </div>

              {/* 세부 동(洞) 격자 버튼 그리드 (사진 3) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                {subDistrictList.map((sub, idx) => {
                  // 해당 세부 구/동에 매칭되는 독립 페이지가 있는지 확인
                  const matchedChild = getMatchedChildPage(sub);
                  const href = matchedChild
                    ? `/regions/${matchedChild.slug}`
                    : `#estimate-form`;

                  return (
                    <Link
                      key={idx}
                      href={href}
                      className="py-2.5 px-2 rounded-lg bg-card border border-border/80 hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan/5 text-center text-xs font-semibold text-gray-300 transition-colors shadow-sm truncate block"
                      title={`${region.name} ${sub} 오토바이 매입`}
                    >
                      {sub}
                    </Link>
                  );
                })}
              </div>

              {/* 출장 소요시간 및 교통 안내 미니 배지 */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                  출장: {region.dispatchTime}
                </span>
                <span className="text-brand-cyan font-semibold">
                  {region.province} 전역 당일 방문
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ================= 2. moto02 스타일: 상세 전문 칼럼 설명글 섹션 ================= */}
      {region.editorialArticles && region.editorialArticles.length > 0 && (
        <section className="py-16 bg-[#0f141a] border-y border-border/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-border pb-5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4" />
                전문 출장 매입 가이드
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {region.editorialTitle || `${region.name} 오토바이 매입 안내`}
              </h2>
            </div>

            {/* 5개 문단의 풍성한 전문 해설 본문 (네이버 검색봇 유사문서 0% 회피) */}
            <div className="space-y-5 text-sm sm:text-base text-gray-300 leading-[1.9]">
              {region.editorialArticles.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* 3대 지역 특화 카드 (moto02 스타일) */}
            {region.advisoryCards && region.advisoryCards.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border/60 text-center sm:text-left">
                {region.advisoryCards.map((card, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-surface border border-border space-y-2">
                    <h3 className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {card.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= 3. [지역명] 지역 차종별 매입 안내 (사진 3 하단) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-1.5">
            <Bike className="w-4 h-4" />
            <span>차종별 매입 안내</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {`${region.name} 지역 차종별 매입 안내`}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {`${region.name} 전역에서 가장 활발하게 거래되는 주요 인기 차종 목록입니다. 아래 기종 외에도 전 차종 매입이 가능합니다.`}
          </p>
        </div>

        {/* 차종 버튼/카드 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularBikeList.map((bike) => (
            <Link
              key={bike.slug}
              href={`/models/${bike.slug}`}
              className="p-3.5 rounded-xl bg-surface border border-border hover:border-brand-cyan hover:bg-card transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-brand-cyan block">
                  {bike.brand}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-cyan mt-0.5 block truncate">
                  {bike.name}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-gray-400">
                <span>{bike.category}</span>
                <span className="text-brand-cyan font-bold">당일견적</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= 4. [지역명] 세부 동별 매입 안내 키워드 그리드 (사진 3 하단 네이버 노출 핵심) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-t border-border/60 pt-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-1.5">
            <MapPin className="w-4 h-4" />
            <span>세부 행정구역 매입 안내</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {`${region.name} 세부 동별 매입 안내`}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {`${region.name} 관내 모든 행정동 및 세부 지역 어디든 전화 한 통으로 당일 신속 방문 매입을 약속드립니다.`}
          </p>
        </div>

        {/* 네이버 상위노출용 세부 동별 매입 키워드 버튼 전체 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {subDistrictList.map((sub, idx) => {
            const matchedChild = getMatchedChildPage(sub);
            const href = matchedChild
              ? `/regions/${matchedChild.slug}`
              : `#estimate-form`;

            return (
              <Link
                key={idx}
                href={href}
                className="p-3 rounded-lg bg-surface border border-border hover:border-brand-cyan hover:text-brand-cyan text-xs font-semibold text-gray-300 transition-colors flex items-center justify-between group shadow-sm"
              >
                <span className="truncate">{`${region.name} ${sub} 오토바이매입`}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-cyan shrink-0" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= 5. 온라인 견적 신청 폼 ================= */}
      <section id="estimate-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-2">
            30초 간편 신청
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {region.name} 실시간 오토바이 매입 견적 신청
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            정보를 남겨주시면 5분 이내에 최고가 예상 견적을 즉시 회신해 드립니다.
          </p>
        </div>

        <EstimateForm initialRegion={region.fullName} />
      </section>

      {/* ================= 6. 전국 지역별 매입 테이블 (사진 2 8열 테이블 연동) ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-14">
        <RegionTableGrid />
      </section>

      {/* ================= 7. FAQ ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-14">
        <FaqSection />
      </section>
    </div>
  );
}
