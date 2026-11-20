import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BIKE_MODELS } from "@/data/models";
import JsonLd from "@/components/JsonLd";
import ModelSearchGrid from "@/components/ModelSearchGrid";
import { Bike, Phone, ChevronRight, BookOpen, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models",
  },
  title: "기종별 오토바이매입 · 중고바이크 매입 | 할리데이비슨·BMW·혼다·야마하·가와사키·스즈키·로얄엔필드",
  description:
    `할리데이비슨 매입(전 라인업 24종), BMW 오토바이 매입(19종), 혼다(39종), 야마하(26종), 스즈키(16종), 가와사키(15종), 로얄엔필드(10종) 등 국내 정식발매 내연기관 ${BIKE_MODELS.length}개 기종 중고 시세 및 상차 전 당일 100% 선입금 출장 매입.`,
  keywords: [
    "오토바이매입",
    "중고오토바이매입",
    "바이크매입",
    "오토바이출장매입",
    "할리데이비슨매입",
    "할리매입",
    "BMW오토바이매입",
    "가와사키오토바이매입",
    "혼다오토바이매입",
    "야마하오토바이매입",
    "스즈키오토바이매입",
    "로얄엔필드매입",
    "두카티매입",
    "트라이엄프매입",
    "중고스쿠터매입",
    "대배기량바이크매입",
    "아메리칸바이크매입",
    "배달용PCX매입",
    "배달NMAX매입",
    "PCX125매입",
    "NMAX매입",
    "포르자350매입",
    "XMAX매입",
    "슈퍼커브매입",
    "베스파매입",
    "중고바이크시세",
  ],
};

const BRAND_HUB_GROUPS = [
  {
    brand: "할리데이비슨 매입 (24종 전 라인업)",
    summary: "투어링·소프테일·스포스터·팬아메리카·CVO·트라이크까지 정식 출고 전 모델 최고가 매입",
    slugs: [
      { slug: "harley-fatboy", label: "팻보이 114/117" },
      { slug: "harley-breakout", label: "브레이크아웃 117" },
      { slug: "harley-lowrider-st", label: "로우라이더 ST" },
      { slug: "harley-roadglide", label: "로드 글라이드" },
      { slug: "harley-streetglide", label: "스트리트 글라이드" },
      { slug: "harley-pan-america-1250", label: "팬 아메리카 1250" },
      { slug: "harley-fortyeight", label: "포티에잇" },
      { slug: "harley-nightster", label: "나이트스터 975" },
      { slug: "harley-sportster-s", label: "스포스터 S" },
      { slug: "harley-heritage-classic", label: "헤리티지 클래식" },
      { slug: "harley-roadking-special", label: "로드킹 스페셜" },
      { slug: "harley-cvo", label: "CVO 한정판" },
    ],
  },
  {
    brand: "BMW 모토라드 오토바이 매입 (19종)",
    summary: "GS 어드벤처·RT/K1600 럭셔리 투어러·S1000RR/M 퍼포먼스·R12 헤리티지·C400 스쿠터",
    slugs: [
      { slug: "bmw-r1250gs", label: "R1250GS 어드벤처" },
      { slug: "bmw-r1300gs", label: "R1300GS" },
      { slug: "bmw-f900gs", label: "F900GS / F800GS" },
      { slug: "bmw-f850gs", label: "F750GS / F850GS" },
      { slug: "bmw-s1000rr", label: "S1000RR" },
      { slug: "bmw-s1000r", label: "S1000R / M1000R" },
      { slug: "bmw-r1250rt", label: "R1250RT 투어러" },
      { slug: "bmw-k1600", label: "K1600GT / GTL" },
      { slug: "bmw-c400gt", label: "C400GT 스쿠터" },
      { slug: "bmw-r12", label: "R12 / R12 nineT" },
    ],
  },
  {
    brand: "혼다 오토바이 매입 (39종)",
    summary: "배달·출퇴근 PCX125·슈퍼커브부터 CBR600RR/650R·호넷·트랜잘프·아프리카트윈·골드윙",
    slugs: [
      { slug: "pcx125", label: "PCX125 (배달·출퇴근)" },
      { slug: "forza350", label: "포르자 350" },
      { slug: "adv350", label: "ADV 350" },
      { slug: "x-adv750", label: "X-ADV 750" },
      { slug: "supercub110", label: "슈퍼커브 110" },
      { slug: "huntercub", label: "CT125 헌터커브" },
      { slug: "rebel500", label: "레블 500" },
      { slug: "honda-cbr600rr", label: "CBR600RR" },
      { slug: "honda-cbr650r", label: "CBR650R" },
      { slug: "honda-cb750-hornet", label: "CB750 호넷" },
      { slug: "honda-transalp750", label: "XL750 트랜잘프" },
      { slug: "honda-goldwing", label: "골드윙 1800" },
    ],
  },
  {
    brand: "야마하 오토바이 매입 (26종)",
    summary: "NMAX125/155·XMAX300·TMAX560 스쿠터 및 R3·R7·R9·MT-07/09·XSR900 GP",
    slugs: [
      { slug: "nmax125", label: "NMAX 125" },
      { slug: "xmax300", label: "XMAX 300" },
      { slug: "tmax560", label: "TMAX 560 테크맥스" },
      { slug: "yamaha-r3", label: "YZF-R3" },
      { slug: "yamaha-r7", label: "YZF-R7" },
      { slug: "yamaha-r9", label: "YZF-R9" },
      { slug: "yamaha-mt07", label: "MT-07" },
      { slug: "yamaha-mt09", label: "MT-09 / SP" },
      { slug: "yamaha-xsr900gp", label: "XSR900 GP" },
      { slug: "yamaha-tenere700", label: "테네레 700" },
    ],
  },
  {
    brand: "가와사키 오토바이 매입 (15종)",
    summary: "닌자 400·500·650·ZX-4RR·ZX-6R·ZX-10R 슈퍼스포츠 및 Z900RS·버시스·발칸 S",
    slugs: [
      { slug: "kawasaki-ninja", label: "닌자 400" },
      { slug: "kawasaki-zx4rr", label: "닌자 ZX-4RR" },
      { slug: "kawasaki-zx6r", label: "닌자 ZX-6R" },
      { slug: "kawasaki-zx10r", label: "닌자 ZX-10R" },
      { slug: "kawasaki-ninja500", label: "닌자 500 / Z500" },
      { slug: "kawasaki-z900rs", label: "Z900RS" },
      { slug: "kawasaki-versys650", label: "버시스 650 / 1000" },
      { slug: "kawasaki-vulcan-s", label: "발칸 S 650" },
    ],
  },
  {
    brand: "스즈키 · 로얄엔필드 · 수입 클래식 매입",
    summary: "스즈키 16종·로얄엔필드 10종·두카티 7종·트라이엄프 7종·베스파·KTM·인디언 전 기종",
    slugs: [
      { slug: "suzuki-hayabusa", label: "스즈키 하야부사" },
      { slug: "suzuki-gsx8r", label: "스즈키 GSX-8R / 8S" },
      { slug: "suzuki-vstrom800", label: "브이스트롬 800DE" },
      { slug: "suzuki-drz4s", label: "DR-Z400SM / 4SM" },
      { slug: "royal-enfield-supermeteor650", label: "슈퍼 메테오 650" },
      { slug: "royal-enfield-shotgun650", label: "샷건 650" },
      { slug: "royal-enfield-guerrilla450", label: "게릴라 450" },
      { slug: "royal-enfield-himalayan450", label: "히말라얀 450" },
      { slug: "ducati-diavel", label: "두카티 디아벨 V4" },
      { slug: "triumph-tiger900", label: "트라이엄프 타이거 900" },
      { slug: "vespa-gts", label: "베스파 GTS 300" },
    ],
  },
];

export default function ModelsIndexPage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd type="main" canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/models" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 헤더 안내 */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <Bike className="w-3.5 h-3.5" />
            국내 정식발매 내연기관 전 차종 최고가 시세 (총 {BIKE_MODELS.length}개 기종)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            제조사 · 기종별 <span className="text-brand-cyan">중고오토바이 매입</span> 허브
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            중고 스쿠터·배달용 PCX·NMAX부터 할리데이비슨 전 라인업, BMW 모토라드, 혼다, 야마하, 가와사키, 스즈키, 로얄엔필드 등 대배기량·아메리칸 바이크까지 기종별 매입 시세표와 점검 기준을 즉시 확인하세요.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:01048952487"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-sm shadow-lg shadow-brand-cyan/20"
            >
              <Phone className="w-4 h-4" />
              내 바이크 시세 유선 문의 (010-4895-2487)
            </a>
            <Link
              href="/price"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border hover:border-brand-cyan text-xs sm:text-sm font-bold text-gray-200 transition-colors"
            >
              <span>전체 기종 중고 오토바이 시세표</span>
              <ChevronRight className="w-4 h-4 text-brand-cyan" />
            </Link>
          </div>
        </div>

        {/* 실시간 차종 검색 + 브랜드/장르 필터 + 전체 기종 그리드 */}
        <ModelSearchGrid models={BIKE_MODELS} />

        {/* SSR 브랜드별 대표 매입 허브 (검색엔진 크롤링 및 내부링크 강화) */}
        <section className="pt-6 border-t border-border/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-brand-cyan block mb-1">
                제조사별 직영 매입 허브
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                브랜드별 대표 <span className="text-brand-cyan">오토바이 · 바이크 매입</span> 바로가기
              </h2>
            </div>
            <Link
              href="/magazine/bike-deregistration-guide-2026"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cyan hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>명의이전·폐지 서류 안내</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_HUB_GROUPS.map((group) => (
              <div
                key={group.brand}
                className="p-5 rounded-2xl bg-surface border border-border space-y-3"
              >
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {group.brand}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {group.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {group.slugs.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/models/${item.slug}`}
                      prefetch={false}
                      className="px-2.5 py-1 rounded-lg bg-card hover:bg-brand-cyan hover:text-black border border-border/80 text-[11px] font-semibold text-gray-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-surface/60 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>
                국내 정식발매 가솔린 내연기관 차량 중 리스·할부 완납 후 사용폐지 또는 개인 명의이전이 완료된 정상 차량을 매입합니다. (※ 전기오토바이 제외)
              </span>
            </div>
            <Link
              href="/magazine/lease-financing-bike-settlement-guide"
              className="text-brand-cyan font-bold hover:underline shrink-0"
            >
              리스 완납·명의이전 기준 보기 →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
