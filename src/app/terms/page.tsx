import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldCheck, Scale, CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "서비스 이용약관 | 넥스트바이크 (NEXTBIKE)",
  description:
    "넥스트바이크의 중고 오토바이 출장 매입 서비스 이용 조건, 권리·의무, 투명한 거래 절차 및 차대 결함 환불 특약에 관한 공식 이용약관입니다.",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd
        type="main"
        canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 상단 네비게이션 */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            홈으로 돌아가기
          </Link>
          <span>/</span>
          <span className="text-gray-200">서비스 이용약관</span>
        </div>

        {/* 헤더 타이틀 */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            공정 거래 및 신뢰 계약 원칙
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            넥스트바이크 <span className="text-brand-cyan">서비스 이용약관</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            본 약관은 넥스트바이크(이하 &apos;회사&apos;)가 제공하는 중고 오토바이 출장 매입, 시세 감정, 폐지 및 명의이전 대행 서비스(이하 &apos;서비스&apos;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
            <span>공고일자: 2026년 9월 25일</span>
            <span>•</span>
            <span className="text-brand-cyan font-semibold">시행일자: 2026년 9월 25일</span>
          </div>
        </div>

        {/* 본문 섹션 */}
        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          {/* 제1조 & 제2조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제1조 (목적 및 정의)
            </h2>
            <div className="space-y-3">
              <p>
                1. <strong>목적:</strong> 본 약관은 회사가 운영하는 공식 웹사이트 및 출장 매입 인프라를 통해 제공되는 중고 이륜자동차 매입 견적 신청, 실차 검수, 매매계약 체결 및 관련 부가 서비스의 이용 조건을 명확히 정하는 데 있습니다.
              </p>
              <p>
                2. <strong>정의:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-400 pl-2">
                <li><strong className="text-gray-300">&apos;이용자(판매자)&apos;</strong>라 함은 회사의 웹사이트에 접속하여 바이크 정보를 입력하고 견적 상담 또는 출장 매입을 의뢰하는 고객을 말합니다.</li>
                <li><strong className="text-gray-300">&apos;회사(매입자)&apos;</strong>라 함은 정식 사업자 등록(699-16-02037)을 필하고 중고 오토바이를 정직한 시세로 매입하는 넥스트바이크를 말합니다.</li>
                <li><strong className="text-gray-300">&apos;출장 매입&apos;</strong>이라 함은 회사의 전문 리프트 차량 및 직원이 이용자가 지정한 장소로 직접 방문하여 실차 검수 후 전액 입금 및 상차하는 방식을 말합니다.</li>
              </ul>
            </div>
          </section>

          {/* 제3조 서비스 내용 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제2조 (회사가 제공하는 서비스)
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
              <li>전 차종 중고 오토바이·스쿠터의 실시간 시세 감정 및 무료 견적 산출</li>
              <li>전국 전 권역 대상 고객 자택 및 직장 앞 당일 무료 출장 방문</li>
              <li>현장 실차 점검 후 상차 전 100% 전액 계좌 이체 지급</li>
              <li>관할 구청 차량등록사업소 이륜차 사용폐지 및 소유권 명의이전 서류 무료 대행</li>
            </ul>
          </section>

          {/* 제4조 견적 신청 및 이용자의 고지 의무 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제3조 (견적 신청 및 이용자의 정확한 고지 의무)
            </h2>
            <div className="space-y-3">
              <p>
                1. 이용자는 온라인 견적 신청 시 본인 소유 차량의 모델명, 연식, 적산거리, 외관 상태, 제꿍/슬립/사고 이력, 튜닝 내역 및 등록 서류 구비 여부를 사실에 입각하여 정확하게 알려주셔야 합니다.
              </p>
              <p>
                2. 사진과 설명으로 사전 합의된 차량 상태와 현장 실차 상태가 일치하는 경우, 회사는 <strong>현장에서 어떠한 부당 감가도 일절 하지 않고 협의된 최고가 전액을 그대로 지급</strong>합니다. 단, 사전 고지되지 않은 중대한 파손이나 침수, 엔진 결함이 현장에서 육안으로 확인되는 경우 현장에서 감가 협의 또는 매입 보류를 진행할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 제5조 매매 계약 체결 및 대금 지급 원칙 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
              제4조 (매매계약 체결 및 대금 지급 원칙)
            </h2>
            <div className="space-y-3">
              <p>
                1. <strong>선입금 후상차 원칙:</strong> 회사는 현장에서 실차 점검 후 최종 결정된 매입 대금을 <strong>차량을 트럭에 상차하기 전 이용자의 은행 계좌로 100% 즉시 송금</strong>합니다. 이용자가 입금을 확인한 이후에 비로소 상차가 시작됩니다.
              </p>
              <p>
                2. <strong>모바일 매입 계약 확인서 체결:</strong> 회사는 대금 입금과 동시에 판매자 정보, 차량 정보, 거래 금액, 입금 계좌/시간, 소유권 이전 및 면책 특약이 기재된 공식 [중고 오토바이 매입 계약 확인서]를 모바일로 교부합니다.
              </p>
              <p>
                3. 이용자가 모바일 문자로 <strong>&quot;네, 위 내용 확인하고 동의합니다&quot;</strong>를 회신함으로써 양 당사자 간의 법적 효력을 갖는 전자 매매계약이 확실하게 체결 및 완결됩니다.
              </p>
            </div>
          </section>

          {/* 제6조 차대 결함 고의 은폐 시의 환불 및 반환 규정 (핵심) */}
          <section className="p-6 rounded-2xl bg-gradient-to-br from-surface to-card border border-brand-cyan/40 space-y-4 shadow-lg shadow-brand-cyan/5">
            <div className="flex items-center gap-2 text-brand-cyan font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              핵심 특약 조항
            </div>
            <h2 className="text-lg font-bold text-white">
              제5조 (치명적 차대 결함 은폐 시의 환불 및 손해배상 규정)
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>
                1. 회사는 사고차, 슬립차, 고장차, 방치차도 사전 고지된 내역에 따라 정직하게 매입합니다. 단순 생활 기스, 가벼운 제꿍, 일상적 소모품 마모는 당연히 환불 대상이 아니며 정상적으로 거래가 종결됩니다.
              </p>
              <p className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs leading-relaxed">
                <strong>※ 중대 결함 고의 은폐 금지 특약:</strong><br />
                출장 및 비대면 매입의 편의성을 악용하여 <strong>차대(메인 프레임) 찢어짐, 휨, 임의 용접, 차대 번호/프레임 절삭 등 주행 안전에 치명적인 대파 결함</strong>을 고의로 은폐하고 무사고 차량으로 판매한 경우, 정밀 리프트 입고 검수 단계에서 매입이 즉시 취소될 수 있습니다. 이 경우 <strong>왕복 용달 운송비는 판매자가 전액 부담하며 기지급된 매입 대금은 즉시 반환(전액 환불)</strong> 처리됩니다.
              </p>
              <p>
                2. 본 조항은 정직하게 바이크를 운행해 온 99%의 선량한 라이더를 보호하고, 대파 차량을 속여 파는 극소수 악성 판매 행위를 차단하기 위한 필수적인 법적 안전장치입니다.
              </p>
            </div>
          </section>

          {/* 제7조 소유권 이전 및 민형사상 권리 포기 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제6조 (소유권 이전 및 분쟁 예방)
            </h2>
            <p>
              1. 이용자가 대금을 전액 수령하고 모바일 계약 확인서에 동의한 시점부터 해당 이륜차의 소유권은 회사로 정당하게 이전되며, 이용자는 사후 변심에 의한 거래 번복이나 추가 대금 요구 등 민·형사상 이의를 제기할 수 없습니다.
            </p>
            <p>
              2. 회사는 인수 완료 후 영업일 기준 24~48시간 이내에 관할 관공서에서 합법적으로 소유권 이전 또는 폐지 처리를 완료하고, 완료된 공문서 사진을 이용자에게 전송하여 행정적 책임을 확실하게 종결합니다.
            </p>
          </section>

          {/* 제8조 분쟁 해결 및 관할 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제7조 (분쟁의 해결 및 관할 법원)
            </h2>
            <p>
              1. 회사와 이용자는 서비스 이용 및 매매 거래와 관련하여 발생한 분쟁을 원만하게 해결하기 위해 성실히 협의합니다.
            </p>
            <p>
              2. 분쟁이 원만히 해결되지 않아 소송이 제기될 경우, 민사소송법상의 관할 법원 또는 회사 본점 소재지 관할 법원을 관할 법원으로 합니다.
            </p>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-card border border-border text-xs font-bold text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            홈으로 돌아가기
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:underline font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            개인정보처리방침 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
