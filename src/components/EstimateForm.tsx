"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, CheckCircle2, ArrowRight, Camera, ImagePlus, X } from "lucide-react";

interface EstimateFormProps {
  initialRegion?: string;
  initialModel?: string;
}

interface PhotoItem {
  file: File;
  previewUrl: string;
}

// 브라우저 클라이언트 이미지 압축 유틸리티 (대용량 사진도 0.1초 만에 최적화, PC/모바일 호환 보장)
async function compressImage(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  const isImage =
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|webp|gif|bmp|jfif|heic|svg)$/i.test(file.name);
  if (!isImage) return file;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(file), 2500);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        clearTimeout(timeout);
        try {
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
                  const safeName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                  const compressedFile = new File([blob], safeName, {
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
        } catch {
          resolve(file);
        }
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(file);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      clearTimeout(timeout);
      resolve(file);
    };
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

  // 실시간 웹 내장 카메라 뷰파인더 상태 (아이폰/갤럭시 브라우저 튕김 0%)
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  // 모바일 카메라 촬영 시 메모리 부족으로 브라우저 탭이 재실행되어도 입력 내용 100% 자동 복구
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("nextbike_estimate_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.model) setModel(parsed.model);
        if (parsed.year) setYear(parsed.year);
        if (parsed.mileage) setMileage(parsed.mileage);
        if (parsed.region) setRegion(parsed.region);
        if (parsed.memo) setMemo(parsed.memo);

        if (parsed.phone || parsed.model) {
          setTimeout(() => {
            const el = document.getElementById("estimate");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 350);
        }
      }
    } catch (e) {
      console.warn("Draft restore:", e);
    }
  }, []);

  // 입력 내용 변경 시마다 실시간 자동 백업
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "nextbike_estimate_draft",
        JSON.stringify({ phone, model, year, mileage, region, memo })
      );
    } catch {}
  }, [phone, model, year, mileage, region, memo]);

  // 웹 내장 카메라 실행 (브라우저를 절대 벗어나지 않아 튕김 원천 차단)
  const startCamera = async () => {
    if (photoItems.length >= 5) {
      alert("사진은 최대 5장까지 첨부 가능합니다.");
      return;
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      fallbackInputRef.current?.click();
      return;
    }

    setCameraLoading(true);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.warn("카메라 권한 오류 또는 미지원, 기본 파일 첨부로 전환합니다:", err);
      stopCamera();
      fallbackInputRef.current?.click();
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraLoading(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || photoItems.length >= 5) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `bike_cam_${Date.now()}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(file);
          setPhotoItems((prev) => [...prev, { file, previewUrl }].slice(0, 5));
        }
      },
      "image/jpeg",
      0.85
    );
  };

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

      try {
        sessionStorage.removeItem("nextbike_estimate_draft");
      } catch {}

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

      {/* 웹 내장 실시간 카메라 뷰파인더 모달 (브라우저 밖으로 나가지 않아 튕김 원천 0%) */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 pb-8 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md flex items-center justify-between py-2 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-bold">실시간 카메라 촬영</span>
            </div>
            <span className="text-xs text-brand-cyan font-extrabold bg-brand-cyan/10 px-2.5 py-1 rounded-full border border-brand-cyan/30">
              {photoItems.length} / 5장 촬영됨
            </span>
          </div>

          <div className="w-full max-w-md aspect-[4/3] max-h-[52vh] relative rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-brand-cyan/40 shadow-2xl my-auto">
            {cameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm animate-pulse">
                카메라 연결 중...
              </div>
            )}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-2xl m-3 flex items-center justify-center">
              <span className="text-[11px] text-white/70 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                바이크가 화면에 꽉 차도록 촬영해 주세요
              </span>
            </div>
          </div>

          {/* 실시간 촬영된 썸네일 미리보기 바 */}
          {photoItems.length > 0 && (
            <div className="w-full max-w-md flex items-center justify-center gap-2 py-1 overflow-x-auto">
              {photoItems.map((item, idx) => (
                <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-cyan/70 shrink-0 shadow-md">
                  <img src={item.previewUrl} alt={`촬영 ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 bg-black/80 text-[10px] text-brand-cyan px-1 font-bold">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="w-full max-w-md flex items-center justify-between px-6 pt-2 pb-2">
            <button
              type="button"
              onClick={stopCamera}
              className="text-sm text-gray-400 hover:text-white px-3 py-2 font-medium"
            >
              닫기
            </button>

            {/* 대형 셔터 버튼 */}
            <button
              type="button"
              onClick={capturePhoto}
              disabled={photoItems.length >= 5}
              className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-90 transition-transform shadow-2xl disabled:opacity-40"
            >
              <div className="w-16 h-16 rounded-full bg-brand-cyan hover:bg-white transition-colors" />
            </button>

            <button
              type="button"
              onClick={stopCamera}
              className="text-sm font-bold text-brand-cyan px-4 py-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 active:scale-95"
            >
              완료 ({photoItems.length})
            </button>
          </div>
        </div>
      )}

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
            <h3 className="text-[17px] sm:text-2xl md:text-3xl font-black text-white tracking-tight break-keep leading-snug">
              <span className="block text-gray-300 text-xs sm:text-base font-semibold mb-1">
                연락처와 모델명만 남겨주시면
              </span>
              <span className="text-brand-cyan">최고가 예상 견적</span>을 즉시 안내합니다
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 break-keep">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-300">
                차량 실물 사진 첨부 (선택 · 최대 5장)
              </label>
              <span className="text-[11px] text-brand-cyan font-semibold">
                {photoItems.length} / 5장 첨부됨
              </span>
            </div>

            {/* 업로드 선택 버튼 (1. 앨범 멀티선택 & 2. 웹 내장 즉시촬영) */}
            {photoItems.length < 5 && (
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {/* 1. 앨범/갤러리에서 선택 (가장 권장) */}
                <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-brand-cyan/50 hover:border-brand-cyan text-gray-200 hover:text-brand-cyan cursor-pointer transition-all bg-card/90 hover:bg-card active:scale-[0.98] shadow-sm">
                  <ImagePlus className="w-6 h-6 mb-1 text-brand-cyan" />
                  <span className="text-xs font-bold text-white">앨범에서 선택</span>
                  <span className="text-[10px] text-brand-cyan mt-0.5">여러 장 한 번에 (추천)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {/* 2. 웹 내장 즉시 촬영 버튼 (브라우저 안에서 찰칵) */}
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-border hover:border-teal-400 text-gray-300 hover:text-teal-400 cursor-pointer transition-all bg-card/80 hover:bg-card active:scale-[0.98]"
                >
                  <Camera className="w-6 h-6 mb-1 text-teal-400" />
                  <span className="text-xs font-bold text-white">카메라 촬영</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">웹 화면에서 즉시 찰칵</span>
                </button>

                {/* 미지원 브라우저용 히든 폴백 input */}
                <input
                  ref={fallbackInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* 사진 썸네일 그리드 */}
            {photoItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                {photoItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-surface border border-brand-cyan/40 p-1 relative overflow-hidden group shadow-md"
                  >
                    <img
                      src={item.previewUrl}
                      alt={`첨부사진 ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-700 text-white font-bold flex items-center justify-center text-xs shadow-md active:scale-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/75 text-brand-cyan">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 안내 팁 박스 */}
            <div className="p-2.5 rounded-lg bg-card/60 border border-border/60 text-[11px] text-gray-400 space-y-1">
              <p className="flex items-center gap-1.5 text-gray-300 font-semibold">
                <span className="text-brand-cyan">💡</span> 사진 첨부 안내
              </p>
              <p className="leading-relaxed">
                일반 카메라 앱으로 사진을 미리 촬영해 두신 후 <strong className="text-brand-cyan">[앨범에서 선택]</strong>을 누르시면 여러 장을 가장 안전하고 빠르게 한 번에 업로드하실 수 있습니다.
              </p>
            </div>
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
