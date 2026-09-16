"use client";

import React, { useState } from "react";
import { Phone, Upload, CheckCircle2, ArrowRight } from "lucide-react";

interface EstimateFormProps {
  initialRegion?: string;
  initialModel?: string;
}

interface PhotoItem {
  file: File;
  previewUrl: string;
}

// 브라우저 클라이언트 이미지 압축 유틸리티 (대용량 사진도 0.1초 만에 최적화하여 초고속 전송)
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.82
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function EstimateForm({ initialRegion = "", initialModel = "" }: EstimateFormProps) {
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [memo, setMemo] = useState("");
  const [agree, setAgree] = useState(true);
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const remainingSlots = 5 - photoItems.length;
      if (remainingSlots <= 0) {
        alert("사진은 최대 5장까지 첨부 가능합니다.");
        return;
      }
      const toAdd = selected.slice(0, remainingSlots).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setPhotoItems((prev) => [...prev, ...toAdd]);
      e.target.value = "";
    }
  };

  const removePhoto = (idx: number) => {
    setPhotoItems((prev) => {
      const target = prev[idx];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("model", model);
      formData.append("year", year);
      formData.append("mileage", mileage);
      formData.append("region", region);
      formData.append("memo", memo);

      if (photoItems.length > 0) {
        // 스마트폰 고화질 사진을 전송에 최적화하여 압축 후 첨부
        const compressedList = await Promise.all(
          photoItems.map((item) => compressImage(item.file))
        );
        compressedList.forEach((file) => {
          formData.append("photos", file);
        });
      }

      await fetch("/api/estimate", {
        method: "POST",
        body: formData,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("견적 전송 에러:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
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
              onClick={() => {
                setSubmitted(false);
                setPhotoItems([]);
              }}
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-300">
                차량 실물 사진 첨부 (선택 · 최대 5장)
              </label>
              <span className="text-[11px] text-brand-cyan font-semibold">
                {photoItems.length} / 5장 선택됨
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {photoItems.length < 5 && (
                <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-brand-cyan text-gray-400 hover:text-brand-cyan cursor-pointer transition-all bg-card/60 hover:bg-card">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[11px] font-bold">사진 추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}

              {photoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 rounded-xl bg-surface border border-brand-cyan/40 p-1 relative overflow-hidden group shadow-md"
                >
                  <img
                    src={item.previewUrl}
                    alt={`첨부사진 ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center text-xs shadow-lg transition-transform active:scale-95"
                    >
                      ×
                    </button>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-brand-cyan">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              💡 번호판, 계기판(적산거리), 차량 좌/우측 사진을 첨부하시면 가장 신속하고 정확한 견적이 회신됩니다.
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
              <span className="animate-pulse">사진 최적화 및 견적 접수 중...</span>
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
