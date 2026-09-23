"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X, CheckCircle2, ChevronRight, Zap } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0a0d10]/95 backdrop-blur-md border-b border-border">
      {/* 상단 공지 띠 배너 */}
      <div className="bg-[#11171f] border-b border-border/60 py-1.5 px-4 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 text-brand-cyan font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              24시간 온라인 문의 접수중
            </span>
            <span className="hidden md:inline text-gray-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
              전국 집 앞 당일 출장 무료견적
            </span>
            <span className="hidden lg:inline text-gray-600">|</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
              현장 실차 확인 후 즉시 100% 전액 송금
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://blog.naver.com/bhh0820"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              네이버블로그
            </a>
            <span className="text-gray-700">·</span>
            <a
              href="https://www.instagram.com/next___bike"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              인스타그램
            </a>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-brand-cyan to-blue-600 flex items-center justify-center font-black text-black shadow-lg shadow-brand-cyan/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
              NEXT<span className="text-brand-cyan">BIKE</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-gray-400 -mt-1">
              넥스트바이크 · 24시 오토바이매입
            </span>
          </div>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-gray-200">
          <Link
            href="/price"
            className="hover:text-brand-cyan transition-colors"
          >
            중고 시세
          </Link>
          <Link
            href="/regions"
            className="hover:text-brand-cyan transition-colors"
          >
            지역별 매입
          </Link>
          <Link
            href="/models"
            className="hover:text-brand-cyan transition-colors"
          >
            차종별 매입
          </Link>
          <Link
            href="/magazine"
            className="hover:text-brand-cyan transition-colors flex items-center gap-1"
          >
            <span>매거진</span>
            <span className="text-[9px] font-black text-[#191600] px-1.5 py-0.5 rounded-full bg-brand-yellow leading-none">
              NEW
            </span>
          </Link>
          <Link
            href="/cases"
            className="hover:text-brand-cyan transition-colors"
          >
            매입 사례
          </Link>
          <Link
            href="/reviews"
            className="hover:text-brand-cyan transition-colors"
          >
            매입 후기
          </Link>
          <Link
            href="/#process"
            className="hover:text-brand-cyan transition-colors"
          >
            매입 절차
          </Link>
          <Link
            href="/#faq"
            className="hover:text-brand-cyan transition-colors"
          >
            자주 묻는 질문
          </Link>
        </nav>

        {/* 데스크탑 우측 콜투액션 */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:01048952487"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-cyan/50 text-brand-cyan hover:bg-brand-cyan hover:text-black font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <Phone className="w-4 h-4" />
            010-4895-2487
          </a>
          <a
            href="#estimate"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-black font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-brand-cyan/25"
          >
            30초 무료 견적
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors"
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#11171f] border-b border-border px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          <Link
            href="/price"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>💰 실시간 중고 시세표</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/regions"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>🗺️ 전국 1,100+ 지역별 출장 매입</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/models"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>🏍️ 인기 70+ 기종별 최고가 매입</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/magazine"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>📚 매거진 &amp; 라이더 매입 팁</span>
              <span className="text-[9px] font-black text-[#191600] px-1.5 py-0.5 rounded-full bg-brand-yellow leading-none">
                NEW
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/cases"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>📸 실제 전국 매입 사례</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>⭐ 라이더 생생 거래 후기</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/#process"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>📋 4단계 간편 매입 절차</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-gray-200 hover:bg-card hover:text-brand-cyan transition-colors"
          >
            <span>❓ 자주 묻는 질문 FAQ</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>

          <div className="pt-3 border-t border-border/80 flex flex-col gap-2">
            <a
              href="tel:01048952487"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-cyan text-brand-cyan font-bold text-sm bg-brand-cyan/5"
            >
              <Phone className="w-4 h-4" />
              전화 상담 010-4895-2487
            </a>
            <a
              href="https://open.kakao.com/o/skSUkiHg"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-yellow text-[#191600] font-black text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              카카오톡 1:1 실시간 상담
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
