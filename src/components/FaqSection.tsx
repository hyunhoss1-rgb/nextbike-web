"use client";

import React, { useState } from "react";
import { FAQS } from "@/data/faqs";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div id="faq" className="space-y-4">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          자주 묻는 질문 FAQ
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          오토바이 매입 전 가장 많이 물어보시는 질문
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          복잡한 절차 없이 궁금한 점을 미리 확인하고 안심하고 상담받으세요.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl bg-surface border border-border overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-gray-200 hover:text-brand-cyan transition-colors gap-3"
              >
                <span className="flex items-start sm:items-center gap-3">
                  <span className="text-brand-cyan font-black text-sm shrink-0 mt-0.5 sm:mt-0">Q.</span>
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 mt-1 sm:mt-0 ${
                    isOpen ? "rotate-180 text-brand-cyan" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-border/40 bg-card/40">
                  <p className="pl-6 relative">
                    <span className="absolute left-0 text-brand-cyan font-bold">A.</span>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
