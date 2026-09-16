import React from "react";
import type { Metadata } from "next";
import { CUSTOMER_REVIEWS } from "@/data/reviews";
import JsonLd from "@/components/JsonLd";
import { Star, MapPin, CheckCircle2, Phone, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "고객 매입 후기 | 100% 실거래 만족 리뷰",
  description:
    "넥스트바이크를 통해 바이크를 판매하신 실제 고객님들의 생생한 거래 후기. 당일 즉시 계좌입금, 친절한 출장 상담, 서류 대행 만족도 1위.",
};

export default function ReviewsPage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/reviews" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            고객 만족도 99.8% 달성
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            넥스트바이크 <span className="text-brand-cyan">실제 매입 후기</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            허위 후기 없는 100% 실거래 고객님들의 소중한 리뷰입니다. 불필요한 현장 감가 없이 약속된 금액을 그대로 전액 입금해 드립니다.
          </p>
        </div>

        {/* 후기 카드 그리드 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{rev.date}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  "{rev.title}"
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{rev.author}</span>
                  <span className="text-[11px] text-brand-cyan">{rev.model}</span>
                </div>
                <span className="text-gray-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {rev.region}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
