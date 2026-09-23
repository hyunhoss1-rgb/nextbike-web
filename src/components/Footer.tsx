import React from "react";
import Link from "next/link";
import { Phone, MapPin, ShieldCheck, Clock, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080b0e] border-t border-border text-gray-400 text-sm pb-24 lg:pb-8">
      {/* 3대 핵심 신뢰 지표 */}
      <div className="border-b border-border/70 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-surface/50 border border-border/50">
            <div className="w-12 h-12 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-brand-cyan" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">24시간 출장 상담 접수</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                주야간·공휴일 무관하게 견적 상담 접수 및 전국 출장 일정을 조율해 드립니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-surface/50 border border-border/50">
            <div className="w-12 h-12 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-cyan" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">현장 100% 당일 전액 입금</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                실차 확인 즉시 고객님 계좌로 전액 이체 후 차량을 상차하며 계약서를 교부합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-surface/50 border border-border/50">
            <div className="w-12 h-12 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-brand-cyan" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">시흥/부천 본사 및 전국 출장</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                경기 시흥 본사 기반 수도권 30분대 즉시 방문 및 전국 순회 출장팀을 운영합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 사업자 정보 및 링크 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* 회사 소개 및 상호 */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">
                NEXT<span className="text-brand-cyan">BIKE</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                넥스트바이크
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
              넥스트바이크는 정직한 시세 산정과 당일 전액 선입금, 신속한 출장 매입을 원칙으로 하는 대한민국 대표 중고 오토바이 전문 매입 플랫폼입니다. 스쿠터, 클래식, 대형 투어러부터 방치차·사고차까지 안심하고 거래하세요.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-gray-400">
              <p>
                <strong className="text-gray-300">상호명:</strong> 넥스트바이크 (NEXTBIKE) &nbsp;|&nbsp;{" "}
                <strong className="text-gray-300">대표자:</strong> 배현호 &nbsp;|&nbsp;{" "}
                <strong className="text-gray-300">사업자등록번호:</strong> 699-16-02037
              </p>
              <p>
                <strong className="text-gray-300">소재지:</strong> 경기도 시흥시 은행동 301-25 1층 넥스트바이크
              </p>
              <p>
                <strong className="text-gray-300">대표전화:</strong>{" "}
                <a href="tel:01048952487" className="text-brand-cyan font-bold hover:underline">
                  010-4895-2487
                </a>{" "}
                (연중무휴 24시간 상담)
              </p>
            </div>
          </div>

          {/* 주요 서비스 바로가기 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-gray-200 uppercase">빠른 바로가기</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/regions" className="hover:text-brand-cyan transition-colors">
                  전국 지역별 매입 페이지
                </Link>
              </li>
              <li>
                <Link href="/models" className="hover:text-brand-cyan transition-colors">
                  인기 차종/기종별 매입
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="hover:text-brand-cyan transition-colors">
                  라이더 매거진 &amp; 매입 가이드
                </Link>
              </li>
              <li>
                <a href="#estimate" className="hover:text-brand-cyan transition-colors">
                  30초 온라인 무료 견적
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-brand-cyan transition-colors">
                  방문 매입 및 서류 처리 절차
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-cyan transition-colors">
                  자주 묻는 질문 (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* 공식 채널 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-gray-200 uppercase">공식 채널</h4>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href="https://blog.naver.com/bhh0820"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-gray-300 hover:text-brand-cyan"
              >
                <span>네이버 공식 블로그</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
              <a
                href="https://www.instagram.com/next___bike"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-gray-300 hover:text-brand-cyan"
              >
                <span>인스타그램 (@next___bike)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
              <a
                href="https://open.kakao.com/o/skSUkiHg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-yellow hover:brightness-110 font-medium"
              >
                <span>카카오톡 1:1 오픈채팅</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 저작권 표시 */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} 넥스트바이크 (NEXTBIKE). All rights reserved.</p>
          <p className="text-[11px] text-gray-600">
            본 사이트의 모든 콘텐츠 및 지역별/기종별 매입 시스템은 무단 복제를 금합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
