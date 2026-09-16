"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Upload, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface EstimateFormProps {
  initialRegion?: string;
  initialModel?: string;
}

export default function EstimateForm({ initialRegion = "", initialModel = "" }: EstimateFormProps) {
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [memo, setMemo] = useState("");
  const [agree, setAgree] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      setPhotos((prev) => [...prev, ...filesArray].slice(0, 5));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert("연락처를 입력해 주세요.");
      return;
    }
    if (!model) {
      alert("바이크 모델명을 입력해 주세요.");
      return;
    }
    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setLoading(true);
    // 폼 제출 시뮬레이션
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div id="estimate" className="relative p-5 sm:p-8 md:p-10 rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden">
      {/* 장식용 상단 악센트 바 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-teal-400 to-blue-500" />

      {submitted ? (
        <div className="py-12 text-center space-y-5 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">견적 신청이 정상 접수되었습니다!</h3>
          <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
            남겨주신 번호(<span className="text-brand-cyan font-bold">{phone}</span>)로 넥스트바이크 전문 상담사가 차량 시세 확인 후 순차적으로 빠르게 회신드리겠습니다.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:01048952487"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-cyan text-black font-extrabold text-sm shadow-lg shadow-brand-cyan/30"
            >
              <Phone className="w-4 h-4" />
              즉시 전화 연결 (010-4895-2487)
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-border text-gray-400 hover:text-white text-sm"
            >
              추가 견적 작성하기
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              30초 간편 무료 견적 신청
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              연락처와 모델명만 남겨주시면 <br />
              <span className="text-brand-cyan">최고가 예상 견적</span>을 즉시 안내합니다
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              사진을 함께 첨부해 주시면 보다 정확한 실차 감정가를 5분 이내에 안내받으실 수 있습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 연락처 */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                연락처 <span className="text-brand-red">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="예) 010-1234-5678"
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-white text-base sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            {/* 모델명 */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                바이크 모델명 <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="예) 혼다 PCX125, NMAX, R1250GS"
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-white text-base sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            {/* 연식 */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                연식 (년식)
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="예) 2023년식"
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-white text-base sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            {/* 킬로수 */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                주행거리 (km)
              </label>
              <input
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="예) 8,500km"
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-white text-base sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          {/* 지역 */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              차량 보관 지역 (시/구/동)
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="예) 경기도 시흥시 배곧동, 서울 강남구 역삼동"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-white text-base sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
            />
          </div>

          {/* 특이사항 */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              특이사항 (튜닝내역, 시동 불량, 슬립/제꿍, 서류 유무 등)
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예) 탑박스 장착됨, 배터리 방전되어 시동 안 걸림, 서류 폐지 완료됨 등"
              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-white text-base sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors resize-none"
            />
          </div>

          {/* 사진 업로드 */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              차량 사진 첨부 (선택 · 최대 5장)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-brand-cyan text-gray-400 hover:text-brand-cyan cursor-pointer transition-colors bg-card/60">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-semibold">사진 추가</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photos.map((file, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 rounded-lg bg-surface border border-border p-1 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                  <span className="text-[10px] text-gray-300 font-medium truncate w-full px-1">
                    {file.name}
                  </span>
                  <span className="text-[9px] text-brand-cyan mt-1">업로드 준비</span>
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              전면, 후면, 계기판(적산거리), 좌우측면 사진을 올려주시면 더욱 신속하게 회신됩니다.
            </p>
          </div>

          {/* 개인정보 수집 동의 */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-brand-cyan"
              />
              <span>
                (필수) 견적 상담 및 방문 일정을 위해 작성한 연락처 및 차량 정보를 수집·이용하는 것에 동의합니다.
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-teal-400 hover:brightness-105 text-black font-black text-base shadow-xl shadow-brand-cyan/20 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span>견적 분석 중...</span>
            ) : (
              <>
                <span>무료 견적 신청 완료하기</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
