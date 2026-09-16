import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPurchaseCases } from "@/data/cases";
import JsonLd from "@/components/JsonLd";
import { MapPin, Calendar, ArrowRight, CheckCircle2, Phone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "오토바이 매입 실거래 내역 | 전국 출장 매입 리포트",
  description:
    "혼다 PCX125, 야마하 NMAX, 포르자350, XMAX300, BMW R1250GS, 할리데이비슨 등 넥스트바이크의 실제 전국 출장 매입 및 정산 완료 내역 확인.",
};

export default function CasesPage() {
  const cases = getAllPurchaseCases();

  return (
    <div className="py-10 sm:py-16">
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/cases" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            실시간 출장 매입 & 정산 완료 리포트 (총 {cases.length}건)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            전국 <span className="text-brand-cyan">출장 매입 실거래 내역</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            실제 라이더 댁 앞에서 정비 엔지니어링 실차 검수를 거쳐 100% 당일 전액 정산 및 서류 이전까지 종결된 최근 매입 거래 내역입니다. 부당 감가 없이 사전 협의된 견적을 끝까지 지킵니다.
          </p>
        </div>

        {/* 사례 리스트 그리드 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.slug}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-brand-cyan/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-cyan/10 text-brand-cyan font-bold border border-brand-cyan/30">
                    <MapPin className="w-3.5 h-3.5" />
                    {c.region}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-cyan/10 text-[10px] text-brand-cyan font-bold border border-brand-cyan/30">
                      {c.displayDate || "정산 완료"}
                    </span>
                    <span className="text-gray-500 text-[11px]">{c.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-brand-cyan transition-colors mb-1.5">
                  {c.year} {c.model}
                </h3>
                <div className="text-xs text-brand-cyan font-semibold mb-3">
                  {c.statusText}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed bg-card/70 p-3.5 rounded-xl border border-border/60">
                  {c.description}
                </p>
                <div className="mt-3 text-[11px] text-gray-500">
                  적산 주행거리: {c.mileage}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">실거래 정산 금액</span>
                  <span className="text-base font-black text-brand-cyan">{c.priceRange}</span>
                </div>
                <Link
                  href="/#estimate"
                  className="px-4 py-2 rounded-lg bg-card hover:bg-brand-cyan hover:text-black border border-border text-xs font-bold text-gray-300 transition-all"
                >
                  내 바이크 견적받기
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-surface/50 border border-border text-center text-xs text-gray-500">
          ※ 고객님의 소중한 개인정보 보호를 위해 상세 주소 및 개인 인적사항은 마스킹 처리된 실제 매입 거래 내역입니다.
        </div>
      </div>
    </div>
  );
}
