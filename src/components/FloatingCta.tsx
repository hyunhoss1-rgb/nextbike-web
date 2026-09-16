"use client";

import React from "react";
import { Phone, MessageCircle, ClipboardCheck } from "lucide-react";

export default function FloatingCta() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0c1015]/95 backdrop-blur-lg border-t border-border p-2.5 pb-safe shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        {/* 전화 상담 */}
        <a
          href="tel:01048952487"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-surface border border-border text-white hover:border-brand-cyan transition-colors"
        >
          <Phone className="w-5 h-5 text-brand-cyan mb-1" />
          <span className="text-[11px] font-bold">전화 상담</span>
        </a>

        {/* 카카오톡 상담 */}
        <a
          href="https://open.kakao.com/o/skSUkiHg"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-brand-yellow text-[#191600] font-black hover:brightness-105 transition-all"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-[11px]">카톡 상담</span>
        </a>

        {/* 30초 견적 신청 */}
        <a
          href="#estimate"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-brand-cyan text-black font-extrabold hover:bg-brand-cyanHover transition-all shadow-md shadow-brand-cyan/20"
        >
          <ClipboardCheck className="w-5 h-5 mb-1" />
          <span className="text-[11px]">30초 견적</span>
        </a>
      </div>
    </div>
  );
}
