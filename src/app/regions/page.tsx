import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { REGIONS, getMainRegions } from "@/data/regions";
import JsonLd from "@/components/JsonLd";
import RegionSearchBrowser, {
  type SearchableRegionItem,
} from "@/components/RegionSearchBrowser";
import { Phone, ChevronRight, Home, MapPin } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/regions",
  },
  title: "전국 지역별 오토바이매입·바이크매입 | 서울·경기·인천·충청·부산 중고바이크 당일 출장 매입",
  description:
    "서울·경기·인천·부산·대구·경남·경북·충청도(충북·충남·대전·세종·천안·청주)·호남·강원·제주 등 전국 전 시·군·구·읍·면·동 오토바이매입 및 중고바이크 출장매입 검색 안내. 상차 전 당일 100% 선입금 안전거래.",
  keywords: [
    "지역별오토바이매입",
    "지역별바이크매입",
    "전국오토바이매입",
    "전국바이크매입",
    "서울오토바이매입",
    "서울바이크매입",
    "경기도오토바이매입",
    "인천오토바이매입",
    "시흥오토바이매입",
    "부천오토바이매입",
    "수원오토바이매입",
    "충청도오토바이매입",
    "충북오토바이매입",
    "충남오토바이매입",
    "천안오토바이매입",
    "청주오토바이매입",
    "대전오토바이매입",
    "부산오토바이매입",
    "대구오토바이매입",
    "광주오토바이매입",
    "강원도오토바이매입",
    "중고바이크출장매입",
  ],
};

const MACRO_REGION_HUBS = [
  { slug: "seoul", label: "서울 오토바이·바이크 매입 (25개구)" },
  { slug: "gyeonggi", label: "경기도 오토바이 매입 (수원·성남·용인·시흥·안산)" },
  { slug: "incheon", label: "인천 오토바이 매입 (부평·송도·청라·구월)" },
  { slug: "busan", label: "부산 오토바이 매입 (해운대·서면·사상·동래)" },
  { slug: "daegu", label: "대구 오토바이 매입 (수성구·달서구·동성로)" },
  { slug: "daejeon", label: "대전 오토바이 매입 (유성구·둔산동·서구)" },
  { slug: "sejong", label: "세종 오토바이 매입 (나성동·조치원)" },
  { slug: "chungbuk", label: "충청도·충북 오토바이 매입 (청주·충주·제천)" },
  { slug: "chungnam", label: "충청도·충남 오토바이 매입 (천안·아산·서산·당진)" },
  { slug: "gwangju", label: "광주 오토바이 매입 (상무·수완·광산)" },
  { slug: "ulsan", label: "울산 오토바이 매입 (남구·삼산동·울주)" },
  { slug: "gangwon", label: "강원도 오토바이 매입 (원주·춘천·강릉)" },
  { slug: "jeonbuk", label: "전라도·전북 오토바이 매입 (전주·군산·익산)" },
  { slug: "jeonnam", label: "전라도·전남 오토바이 매입 (순천·여수·목포)" },
  { slug: "gyeongbuk", label: "경상도·경북 오토바이 매입 (구미·포항·경주·경산)" },
  { slug: "gyeongnam", label: "경상도·경남 오토바이 매입 (창원·김해·양산·진주)" },
];

export default function RegionsIndexPage() {
  const mainRegions: SearchableRegionItem[] = getMainRegions().map((r) => ({
    slug: r.slug,
    name: r.name,
    fullName: r.fullName,
    province: r.province,
    dispatchTime: r.dispatchTime,
    isDong: r.isDong,
    isSubDong: r.isSubDong,
    subDistricts: r.subDistricts || [],
  }));

  const allRegions: SearchableRegionItem[] = REGIONS.map((r) => ({
    slug: r.slug,
    name: r.name,
    fullName: r.fullName,
    province: r.province,
    dispatchTime: r.dispatchTime,
    isDong: r.isDong,
    isSubDong: r.isSubDong,
    subDistricts: r.subDistricts || [],
  }));

  return (
    <div className="py-8 sm:py-14 space-y-10">
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/regions" />

      {/* 상단 브레드크럼 & 타이틀 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-brand-cyan font-bold">전국 지역별 오토바이·바이크매입</span>
        </nav>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            전국 <span className="text-brand-cyan">지역별 오토바이매입</span> · <span className="text-brand-yellow">중고바이크 매입</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            서울·경기·인천 수도권부터 충청도(충북·충남·대전·세종)·강원·영남·호남·제주까지 전국 전 지역 어디든 검색창에 우리 동네 이름을 입력해 보세요. 상차 전 100% 당일 선입금 원칙으로 안전하게 방문 매입합니다.
          </p>
        </div>
      </div>

      {/* 실시간 전국 지역 통합 검색 + 권역별 필터 + 5열 지역 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionSearchBrowser mainRegions={mainRegions} allRegions={allRegions} />
      </div>

      {/* SSR 광역 시·도 거점 허브 바로가기 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-cyan" />
          <h2 className="text-lg sm:text-xl font-black text-white">
            전국 시·도 권역별 대표 출장 매입 거점 ({REGIONS.length}개 행정구역 커버)
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MACRO_REGION_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={`/regions/${hub.slug}`}
              prefetch={false}
              className="p-3 rounded-xl bg-surface border border-border hover:border-brand-cyan text-xs font-bold text-gray-200 hover:text-brand-cyan flex items-center justify-between gap-2 transition-colors"
            >
              <span className="truncate">{hub.label}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            </Link>
          ))}
        </div>
      </div>

      {/* 하단 전화 상담 배너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              목록에 없는 외곽 읍·면·리 지역도 전국 당일 출장 매입이 가능합니다
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              차량 사진과 위치만 알려주시면 신속하게 방문 일정을 조율해 드립니다.
            </p>
          </div>
          <a
            href="tel:01048952487"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-cyan text-black font-extrabold text-sm whitespace-nowrap shadow-lg shadow-brand-cyan/20"
          >
            <Phone className="w-4 h-4" />
            전화 상담 (010-4895-2487)
          </a>
        </div>
      </div>
    </div>
  );
}
