import React from "react";
import Link from "next/link";
import Image from "next/image";
import EstimateForm from "@/components/EstimateForm";
import RegionLinkGrid from "@/components/RegionLinkGrid";
import RegionTableGrid from "@/components/RegionTableGrid";
import ModelLinkGrid from "@/components/ModelLinkGrid";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import ScrollReveal, { StatCounter } from "@/components/ScrollReveal";
import { getDailyPurchaseCases } from "@/data/cases";
import { CUSTOMER_REVIEWS } from "@/data/reviews";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  FileCheck,
  CreditCard,
  Wrench,
  Award,
  MapPin,
  Banknote,
  Wallet,
  ShieldAlert,
  Recycle,
  FilePenLine,
  ChevronRight,
  Camera,
  ClipboardList,
  Search,
  HandCoins,
  Star,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const dailyCases = getDailyPurchaseCases(12);

  return (
    <>
      <JsonLd type="main" />

      {/* ================= 1. 히어로 섹션 ================= */}
      <section className="relative overflow-hidden pt-6 pb-16 sm:pb-24 border-b border-border/60">
        {/* 백그라운드 바이크 이미지 & 시네마틱 오버레이 */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/images/hero-bike.jpg"
            alt="넥스트바이크 전국 중고오토바이 출장 매입"
            fill
            priority
            className="object-cover object-[75%_center] md:object-center opacity-30 md:opacity-35 mix-blend-screen scale-105"
          />
          {/* 가독성 보장을 위한 다중 다크 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d10] via-[#0a0d10]/95 md:via-[#0a0d10]/80 to-[#0a0d10]/70 lg:to-[#0a0d10]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d10]/80 via-transparent to-[#0a0d10]" />
        </div>

        {/* 네온 사이안 앰비언트 글로우 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-cyan/15 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* 좌측 헤드라인 & 소개 */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <ScrollReveal animation="fade-down" delay={100}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs sm:text-sm font-bold shadow-sm backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                  24시간 실시간 접수 · 수도권 30분대 · 전국 당일 무상 출장
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.18] break-keep">
                  <span className="block">상차 전 100% 즉시 전액 입금</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-teal-300 to-blue-400">
                    더 이상 교묘한 감가 상술에 당하지 마세요
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                <p className="text-sm sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  전화로 높게 부르고 현장에서 깎아내리는 불투명한 거래는 그만. 고객님 계좌에 1원 한 장 빠짐없이 입금된 것을 직접 확인하신 뒤에만 바이크를 싣습니다.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={400}>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-gray-200 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>상차 전 100% 계좌 입금 확인</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>사전 합의 견적 부당 감가 0%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>유압 리프트 트럭 무료 배차</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>24시간 내 구청 이전 서류 완료</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={500}>
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 w-full max-w-md mx-auto lg:mx-0">
                  <a
                    href="tel:01048952487"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-surface/90 border border-brand-cyan/60 hover:border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-black font-extrabold text-sm transition-all shadow-lg hover:shadow-brand-cyan/20 active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    전화 상담 010-4895-2487
                  </a>
                  <a
                    href="https://open.kakao.com/o/skSUkiHg"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-yellow text-[#191600] font-black text-sm hover:brightness-105 transition-all shadow-lg shadow-yellow-500/10 active:scale-95 animate-shimmer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    카카오톡 1:1 상담
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* 우측 30초 견적 폼 */}
            <div className="lg:col-span-6">
              <ScrollReveal animation="zoom-in" delay={300}>
                <EstimateForm />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. 최근 전국 출장 매입 실거래 현황 ================= */}
      <section className="py-12 md:py-16 border-b border-border/60 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8 text-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  실시간 실차 매입 리포트
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  최근 전국 <span className="text-brand-cyan">출장 매입 실거래 현황</span>
                </h2>
              </div>
              <Link
                href="/cases"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-cyan hover:underline"
              >
                실거래 매입 내역 전체보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 수평 스크롤 스냅 갤러리 */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {dailyCases.map((item, idx) => (
              <ScrollReveal
                key={item.slug}
                animation="fade-up"
                delay={idx * 100}
                className="snap-start shrink-0 w-[280px] sm:w-[320px]"
              >
                <Link
                  href="/cases"
                  className="h-full p-5 rounded-2xl bg-surface border border-border hover:border-brand-cyan transition-all hover:-translate-y-1.5 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="flex items-center gap-1 text-brand-cyan truncate max-w-[170px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {item.region}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-brand-cyan/10 text-[10px] text-brand-cyan font-bold border border-brand-cyan/30 shrink-0">
                        {item.displayDate || "정산 완료"}
                      </span>
                    </div>
                    <div className="text-base font-bold text-white leading-snug group-hover:text-brand-cyan transition-colors">
                      {item.year} {item.model}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 flex items-center justify-between">
                      <span>적산 {item.mileage}</span>
                      <span className="text-[11px] text-gray-500">{item.date}</span>
                    </div>
                    <p className="mt-2.5 text-xs text-gray-300 line-clamp-2 bg-card/60 p-2 rounded-lg border border-border/40 leading-relaxed">
                      {item.statusText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 text-xs font-bold text-gray-300 flex items-center justify-between">
                    <span className="text-gray-400">실거래 정산가</span>
                    <span className="text-brand-cyan font-black text-sm">{item.priceRange}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-500">
            ※ 실제 매입 완료된 차종별 정산 사례이며, 정비 상태 및 옵션 장착 여부에 따라 최고가 맞춤 견적이 산출됩니다.
          </p>
        </div>
      </section>

      {/* ================= 3-1. 방치차 · 사고차 · 시동불능 특화 매입 솔루션 ================= */}
      <section className="py-16 sm:py-20 border-b border-border/60 bg-[#0f141a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-3">
                <ShieldAlert className="w-3.5 h-3.5" />
                특수 매입 솔루션
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight break-keep leading-snug">
                <span className="block">시동불능 · 사고차 · 방치 바이크도</span>
                <span className="text-brand-cyan">전문 감정으로 정직하게</span> 매입합니다
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-gray-400">
                일반 매매상에서 기피하거나 헐값 취급하는 차량도 전용 리프트 차량으로 안전하게 인수합니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all space-y-4 h-full shadow-lg hover:-translate-y-1 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0">
                  <Recycle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">장기 방치 & 시동 불능 차량</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  6개월~수년간 아파트 지하주차장, 빌라 골목, 상가 야외에 세워두어 배터리가 방전되었거나 시동이 걸리지 않는 바이크도 전문 유압 리프트 트럭으로 안전하게 무상 인수합니다.
                </p>
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-brand-cyan">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>시동 불가 상태도 최고 잔존가 반영</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all space-y-4 h-full shadow-lg hover:-translate-y-1 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">슬립 · 제꿍 & 사고 이력 차량</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  외장 카울 스크래치, 전도 손상, 프레임 유격, 보험 처리 후 자차 수리를 하지 않은 바이크도 부품 재생 가치를 기술적으로 세분화하여 정당한 실거래 견적을 제시합니다.
                </p>
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-brand-cyan">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>헐값 후려치기 없는 부품 단위 정밀 감정</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all space-y-4 h-full shadow-lg hover:-translate-y-1 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0">
                  <FilePenLine className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">서류 분실 & 폐차 말소 원스톱 대행</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  이륜차 사용폐지증명서나 사용신고필증을 분실하셨어도 걱정하지 마세요. 신분증 확인을 통한 재발급 절차 안내 및 관할 구청 폐차·말소 등록 수수료를 100% 무료 대행합니다.
                </p>
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-brand-cyan">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>관공서 행정 대행료 전액 0원 지원</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================= 3-2. 넥스트바이크 5대 안심 매입 원칙 ================= */}
      <section className="py-16 sm:py-24 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-3">
                <Award className="w-3.5 h-3.5" />
                넥스트바이크 5대 안심 원칙
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight break-keep leading-snug">
                <span className="block">더 이상 악성 매입 상술에 당하지 마세요</span>
                <span className="text-brand-cyan">상차 전 100% 입금 & 정직한 5대 약속</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-gray-400">
                전화로 부른 최고가와 현장 가격이 다른 불투명한 거래는 그만. 계좌 입금 확인 후 바이크를 싣는 투명한 절차를 약속합니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                title: "상차 전 100% 전액 송금",
                desc: "차량을 트럭에 싣기 전 계좌 입금 내역을 고객님이 먼저 확인하신 뒤 다음 절차를 진행합니다.",
              },
              {
                num: "02",
                title: "현장 감가 ZERO 약속",
                desc: "사전 상담 시 사진과 설명으로 합의된 상태와 일치하면 현장에서 추가 감가를 절대 요구하지 않습니다.",
              },
              {
                num: "03",
                title: "수도권 30분 전국 무료 배차",
                desc: "시흥 본점을 거점으로 수도권 30분대, 전국 어디든 추가 출장비 없이 약속 시간에 정확히 도착합니다.",
              },
              {
                num: "04",
                title: "정비 엔지니어 실차 감정",
                desc: "단순 딜러가 아닌 자체 정비 기술진이 고가 머플러, 탑박스, 소모품 관리 상태를 정당하게 가산합니다.",
              },
              {
                num: "05",
                title: "24시간 내 행정 이전 완결",
                desc: "정식 매매계약서 작성 후 24시간 내 구청 명의이전을 완료하고 전산 서류 사진을 전송합니다.",
              },
            ].map((item, idx) => (
              <ScrollReveal
                key={item.num}
                animation="fade-up"
                delay={idx * 100}
              >
                <div className="p-5 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all space-y-2.5 h-full hover:-translate-y-1 text-center sm:text-left">
                  <span className="text-2xl font-black text-brand-cyan/40 block text-center sm:text-left">{item.num}</span>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3-3. 실제 매입 고객 리얼 후기 ================= */}
      <section className="py-16 sm:py-20 border-b border-border/60 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-10 text-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  고객 만족도 99.8%
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  넥스트바이크를 선택하신 <span className="text-brand-cyan">라이더의 실제 후기</span>
                </h2>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-brand-yellow">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                  ))}
                </div>
                <span className="ml-1 text-white font-extrabold">5.0</span>
                <span className="text-xs text-gray-400 font-normal">/ 5.0 (누적 매입 2,800+건)</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {CUSTOMER_REVIEWS.slice(0, 3).map((review, idx) => (
              <ScrollReveal
                key={review.id}
                animation="fade-up"
                delay={idx * 150}
              >
                <div className="p-6 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all flex flex-col justify-between space-y-4 shadow-md h-full hover:-translate-y-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow" />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-500">{review.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      "{review.title}"
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">
                      {review.content}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-200">{review.author}</span>
                      <span className="text-[11px] text-gray-500 block">{review.region}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-[10px] font-bold text-brand-cyan">
                      {review.model}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. 매입 가능 차종 뱃지 클라우드 ================= */}
      <section className="py-14 border-b border-border/60 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
              매입 가능 전 차종
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              다양한 <span className="text-brand-cyan">국산·수입 오토바이</span> 상담 가능
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={150}>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
              {[
                "혼다 PCX125",
                "야마하 NMAX125",
                "혼다 포르자350",
                "야마하 XMAX300",
                "할리데이비슨 포티에잇",
                "BMW R1250RT",
                "BMW R1250GS",
                "BMW S1000RR",
                "야마하 TMAX560",
                "혼다 슈퍼커브110",
                "혼다 CT125 헌터커브",
                "혼다 레블500",
                "스즈키 하야부사",
                "가와사키 닌자400",
                "베스파 GTS300",
                "할리데이비슨 팻보이",
                "혼다 CBR650R",
                "야마하 YZF-R3",
                "혼다 골드윙 1800",
                "DNA모터스 UHR125",
                "로얄엔필드 클래식350",
                "스즈키 버그만400",
                "BMW C400GT",
              ].map((tag) => (
                <a
                  key={tag}
                  href="#estimate"
                  className="px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-brand-cyan hover:text-brand-cyan text-xs sm:text-sm font-bold text-gray-200 transition-all shadow-sm hover:scale-105 active:scale-95"
                >
                  {tag}
                </a>
              ))}
              <span className="px-3.5 py-2 rounded-xl border border-dashed border-brand-cyan/40 text-xs sm:text-sm font-bold text-brand-cyan">
                그 외 전 기종 당일 상담 가능
              </span>
            </div>
          </ScrollReveal>
          <p className="text-xs text-gray-400">
            혼다 · 야마하 · BMW 모토라드 · 할리데이비슨 · 가와사키 · 스즈키 · 베스파 · 로얄엔필드 등 전 제조사 바이크 상시 매입
          </p>
        </div>
      </section>

      {/* ================= 5. 인기 기종별 매입 바로가기 ================= */}
      <section className="py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <ModelLinkGrid />
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 6. 원스톱 4-Step 다이렉트 매입 시스템 ================= */}
      <section id="process" className="py-16 sm:py-24 border-b border-border/60 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-3">
                원스톱 다이렉트 프로세스
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight break-keep leading-snug">
                <span className="block">복잡한 절차 없는</span>
                <span className="text-brand-cyan">간편 4단계 매입 시스템</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-gray-400">
                라이더의 소중한 시간을 아끼는 간편 4단계로, 당일 상담부터 구청 서류 이전까지 깔끔하게 완료합니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                icon: Camera,
                title: "모바일 사진 전송",
                desc: "바이크 사진 3장(전·후면, 계기판)과 기본 상태를 전송하시면 정비팀이 5분 내 최고 견적을 산출합니다.",
              },
              {
                num: "02",
                icon: Truck,
                title: "전문 리프트 차량 배차",
                desc: "고객님이 원하시는 자택 앞, 직장 주차장으로 유압 리프트 전용 트럭이 출장비 0원으로 방문합니다.",
              },
              {
                num: "03",
                icon: Search,
                title: "5분 실차 점검 (감가 0%)",
                desc: "자체 정비 엔지니어가 현장 5분 내 상태를 점검하며, 사전 약정된 상태와 일치 시 감가 없이 확정합니다.",
              },
              {
                num: "04",
                icon: FileCheck,
                title: "상차 전 입금 & 서류 완료",
                desc: "계좌 입금을 먼저 확인시켜 드린 후 차량을 상차하며, 24시간 내 구청 명의이전/말소 전산증을 발송합니다.",
              },
            ].map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <ScrollReveal
                  key={step.num}
                  animation="fade-up"
                  delay={idx * 120}
                >
                  <div className="p-6 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all h-full hover:-translate-y-1 shadow-md text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-between mb-4 gap-3">
                      <span className="text-3xl font-black text-brand-cyan/40">{step.num}</span>
                      <IconComponent className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 7. 넥스트바이크 4대 고객 안심 지표 (카운터 애니메이션) ================= */}
      <section className="py-14 border-b border-border/60 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <ScrollReveal animation="zoom-in" delay={100}>
              <div className="p-5 sm:p-6 rounded-xl bg-surface/60 border border-border/60 shadow-lg hover:border-brand-cyan/40 transition-all">
                <div className="text-3xl sm:text-5xl font-black text-brand-cyan">
                  <StatCounter end={0} suffix="원" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-2">출장 및 행정 대행비</div>
                <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">전국 무료 출장 & 구청 대행 0원</div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="zoom-in" delay={200}>
              <div className="p-5 sm:p-6 rounded-xl bg-surface/60 border border-border/60 shadow-lg hover:border-brand-cyan/40 transition-all">
                <div className="text-3xl sm:text-5xl font-black text-brand-cyan">
                  <StatCounter end={0} suffix="%" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-2">현장 억지 감가율</div>
                <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">사전 협의 견적 100% 보증</div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="zoom-in" delay={300}>
              <div className="p-5 sm:p-6 rounded-xl bg-surface/60 border border-border/60 shadow-lg hover:border-brand-cyan/40 transition-all">
                <div className="text-3xl sm:text-5xl font-black text-brand-cyan">
                  <StatCounter end={100} suffix="%" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-2">상차 전 현장 즉시 송금</div>
                <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">입금 확인 후 바이크 상차</div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="zoom-in" delay={400}>
              <div className="p-5 sm:p-6 rounded-xl bg-surface/60 border border-border/60 shadow-lg hover:border-brand-cyan/40 transition-all">
                <div className="text-3xl sm:text-5xl font-black text-brand-cyan">
                  <StatCounter end={24} suffix="H" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-2">구청 서류 이전 종결</div>
                <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">익일 행정 처리 전산 사진 전송</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================= 8. 전국 지역별 출장 매입 안내 (8열 테이블 그리드) ================= */}
      <section className="py-16 sm:py-24 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <RegionTableGrid />
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 9. 프리미엄 바이크 백그라운드 CTA 배너 (신규 추가) ================= */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/60">
        {/* 바이크 배경 이미지 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/bike-banner.jpg"
            alt="넥스트바이크 전국 바이크 안심 매입"
            fill
            className="object-cover object-center opacity-25 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d10] via-[#0a0d10]/90 to-[#0a0d10]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d10] via-transparent to-[#0a0d10]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <ScrollReveal animation="fade-down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              전국 어디서나 30초면 최고가 확인
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug break-keep">
              <span className="block">잠자고 있는 바이크,</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-teal-300 to-blue-400">
                지금 최고가로 현금화
              </span>하세요!
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              전화로 높게 부르고 현장에서 깎는 악성 상술에 지치셨나요? 넥스트바이크는 상차 전 고객님 계좌로 100% 전액 입금을 직접 확인하신 뒤에만 바이크를 안전하게 싣습니다.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={350}>
            <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 w-full max-w-4xl mx-auto">
              <a
                href="tel:01048952487"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-cyan text-black font-black text-sm md:text-base whitespace-nowrap hover:bg-brand-cyanHover transition-all shadow-xl shadow-brand-cyan/25 active:scale-95"
              >
                <Phone className="w-5 h-5 shrink-0" />
                <span>전화 바로 상담 (010-4895-2487)</span>
              </a>
              <a
                href="https://open.kakao.com/o/skSUkiHg"
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-yellow text-[#191600] font-black text-sm md:text-base whitespace-nowrap hover:brightness-105 transition-all shadow-xl shadow-yellow-500/10 active:scale-95 animate-shimmer"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>카톡 1:1 사진 견적 문의</span>
              </a>
              <a
                href="#estimate"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-surface/80 border border-border hover:border-brand-cyan text-white font-bold text-sm md:text-base whitespace-nowrap transition-all active:scale-95"
              >
                <ClipboardList className="w-5 h-5 text-brand-cyan shrink-0" />
                <span>30초 온라인 간편 견적</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 10. FAQ ================= */}
      <section className="py-16 sm:py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <FaqSection />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
