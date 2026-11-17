#!/usr/bin/env node
/**
 * Automated Daily Magazine Generator for NextBike
 * - Generates high-quality, policy-compliant Korean SEO articles into src/data/magazineAuto.ts
 * - Covers 183 official KR ICE models, brand hubs, regional hubs, and maintenance/document guides
 * - Strictly blocks forbidden brands/policies (SYM, KYMCO, Zontes, EV bikes, seized/flooded bikes, lease succession)
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const SRC_DATA = path.join(ROOT, "src", "data");
const AUTO_FILE = path.join(SRC_DATA, "magazineAuto.ts");

const FORBIDDEN_PATTERN =
  /압류|침수|\bsym\b|킴코|kymco|존테스|zontes|조이맥스|크루심|다운타운|전기\s*오토바이|전기\s*스쿠터|전기\s*바이크|리스\s*승계|할부\s*승계|대납\s*매입/i;

function getKstTodayString(base = new Date()) {
  return new Date(base.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function loadExistingInventory() {
  const files = [
    "magazine.ts",
    "magazineOctober.ts",
    "magazineBattery.ts",
    "magazineNovember.ts",
    "magazineAuto.ts",
  ];
  const existingSlugs = new Set();
  const existingDates = new Set();

  for (const f of files) {
    const p = path.join(SRC_DATA, f);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, "utf8");
    for (const m of text.matchAll(/"slug":\s*"([^"]+)"/g)) {
      existingSlugs.add(m[1]);
    }
    for (const m of text.matchAll(/"publishDate":\s*"(\d{4}-\d{2}-\d{2})"/g)) {
      existingDates.add(m[1]);
    }
  }

  let autoArticles = [];
  if (fs.existsSync(AUTO_FILE)) {
    const autoText = fs.readFileSync(AUTO_FILE, "utf8");
    const match = autoText.match(/export const MAGAZINE_ARTICLES_AUTO: MagazineArticle\[\] = (\[[\s\S]*\]);/);
    if (match) {
      autoArticles = JSON.parse(match[1]);
    }
  }

  return { existingSlugs, existingDates, autoArticles };
}

function loadBikeModels() {
  const text = fs.readFileSync(path.join(SRC_DATA, "models.ts"), "utf8");
  const match = text.match(/export const BIKE_MODELS: BikeModel\[\] = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error("Failed to parse BIKE_MODELS from src/data/models.ts");
  return vm.runInNewContext(match[1]);
}

function getSeasonLabel(dateStr) {
  const month = Number(dateStr.slice(5, 7));
  if (month >= 3 && month <= 5) return "봄 시즌 라이딩 성수기";
  if (month >= 6 && month <= 8) return "여름철 장마·투어 시즌";
  if (month >= 9 && month <= 11) return "가을·초겨울 시즌오프";
  return "겨울철 비수기 및 방전 집중기";
}

const REGION_TOPICS = [
  {
    key: "seoul-metro",
    regionLabel: "서울 전 자치구(강남·송파·마포·영등포·서초)",
    slugPart: "seoul-direct-lift-pickup",
    summary: "지하주차장 방전 스쿠터부터 대형 수입 바이크까지 서울 전역 40분 내 무상 리프트 방문",
  },
  {
    key: "gyeonggi-south",
    regionLabel: "경기 남부권(수원·성남·분당·용인·화성·평택)",
    slugPart: "gyeonggi-south-bike-buying",
    summary: "판교·광교·동탄 대단지 아파트 및 상가 주차장 당일 무료 출장 감정",
  },
  {
    key: "incheon-siheung",
    regionLabel: "인천·시흥·안산·부천·김포 서부권",
    slugPart: "incheon-west-coast-buying",
    summary: "시흥 본사 직영 거점 20~30분 즉시 출동 및 해안가 산화 차량 공정 감정",
  },
  {
    key: "chungcheong-daejeon",
    regionLabel: "충청도(충북·충남·대전·세종·천안·청주·아산)",
    slugPart: "chungcheong-daejeon-sejong-buying",
    summary: "충청권 고속도로 직결 배차망을 통한 당일 방문 및 상차 전 100% 선입금",
  },
  {
    key: "yeongnam-busan",
    regionLabel: "영남권(부산·대구·울산·창원·포항·구미·김해)",
    slugPart: "yeongnam-busan-daegu-buying",
    summary: "부산 해안·대구 공단·창원 전역 당일 특장 리프트 트럭 무료 방문 매입",
  },
  {
    key: "honam-gangwon",
    regionLabel: "호남·강원권(광주·전주·순천·여수·원주·춘천·강릉)",
    slugPart: "honam-gangwon-nationwide-buying",
    summary: "지방권 출장비 0원 약속 및 당일 원스톱 명의이전·사용폐지 무료 대행",
  },
];

const BRAND_GUIDE_TOPICS = [
  {
    key: "harley-lineup",
    brandName: "할리데이비슨",
    slugPart: "harley-davidson-full-lineup-guide",
    modelsSummary: "팻보이 114/117, 브레이크아웃, 로우라이더 S/ST, 로드글라이드, 스트리트글라이드, 팬아메리카 1250, 스포스터 S/나이트스터, CVO",
    point: "지킬앤하이드·반스앤하인즈 등 구조변경 완료 배기와 정품 투어팩·크롬/블랙 파츠 가치를 전액 합산",
  },
  {
    key: "bmw-motorrad",
    brandName: "BMW 모토라드",
    slugPart: "bmw-motorrad-tourer-sports-guide",
    modelsSummary: "R1300GS·R1250GS 어드벤처, R1250RT, F900GS/R/XR, S1000RR/R/XR, M1000RR, K1600GTL, R18, R12 nineT, C400GT",
    point: "정품 알루미늄 3박스·바리오 케이스·전자 서스펜션(ESA)·아크라포빅 순정/구변 파츠 및 정기 점검 이력 우대",
  },
  {
    key: "honda-kr",
    brandName: "혼다 코리아",
    slugPart: "honda-scooter-tourer-guide",
    modelsSummary: "PCX125, 포르자350/750, ADV350, X-ADV, 슈퍼커브 110/C125, CT125 헌터커브, 레블 500/1100, CBR650R/600RR, CB750 호넷, 트랜잘프750",
    point: "E-클러치·DCT 자동변속 모델과 배달·통근 저적산 차량, 순정 스마트키 2개 완비 매물 최고가 반영",
  },
  {
    key: "yamaha-ysk",
    brandName: "야마하",
    slugPart: "yamaha-nmax-xmax-r-series-guide",
    modelsSummary: "NMAX125/155, XMAX300, TMAX560, YZF-R3/R7/R9, MT-03/07/09, XSR900 GP, 테네레700, 트레이서9 GT+",
    point: "CP2/CP3 엔진 특유의 관리 상태와 테크맥스·SP 트림 올린즈/브렘보 사양 프리미엄 전액 인정",
  },
  {
    key: "kawasaki-kr",
    brandName: "가와사키",
    slugPart: "kawasaki-ninja-z-versys-guide",
    modelsSummary: "닌자 ZX-4RR, ZX-6R, ZX-10R, 닌자400/500/650/1000SX, Z900RS, Z H2, 버시스 650/1000 SE, 발칸 S 650",
    point: "KRT 에디션·Z900RS 레트로 인기 컬러 및 KQS 퀵시프터·순정 패니어 투어링 세팅 가산",
  },
  {
    key: "suzuki-re",
    brandName: "스즈키 · 로얄엔필드",
    slugPart: "suzuki-royalenfield-buying-guide",
    modelsSummary: "스즈키 하야부사, GSX-8R/8S, GSX-R1000R/125, 브이스트롬 800DE/650/250SX, SV650, 로얄엔필드 슈퍼메테오650, 샷건650, 베어650, 히말라얀450, 게릴라450, 클래식350",
    point: "내구성이 검증된 V트윈·직렬 4기통·클래식 단기통까지 순정 보존 상태와 소모품 잔존가 정직 감정",
  },
];

const POLICY_DOC_TOPICS = [
  {
    key: "personal-transfer-lease-payoff",
    slugPart: "payoff-and-personal-transfer-checklist",
    title: "리스·할부 완납 차량 및 개인 명의이전 완료 오토바이 매입 필수 서류 총정리",
    subtitle: "잔여 금융 완납 후 깔끔한 소유권 정리와 상차 전 100% 선입금 매각 절차",
    excerpt: "금융사 할부나 리스가 걸려 있던 바이크를 처분할 때 완납 및 저당 해지 후 구청 사용폐지 또는 개인 명의이전을 완료한 상태에서 안전하게 당일 매입받는 서류 체크리스트를 안내합니다.",
    category: "서류·행정",
    tags: ["오토바이매입", "리스완납오토바이", "개인명의이전", "이륜차폐지서류", "당일선입금"],
    heading1: "1. 매입 가능 서류 상태: 완납 후 폐지 또는 개인 명의이전 완료",
    body1: [
      "넥스트바이크는 투명하고 합법적인 권리 관계 보장을 위해 리스·할부 등 금융 잔여금이 모두 상환되어 관할 관공서에서 사용폐지가 완료되었거나, 판매자 개인 명의로 정상 이전 등록된 차량만을 매입합니다.",
      "금융사 완납 증명 또는 저당권 말소가 끝난 상태에서 사용폐지증명서 원본(또는 미폐지 시 신분증·사용신고필증·위임 절차 안내)을 갖추시면 현장에서 지체 없이 매입 계약 확인서를 체결합니다.",
    ],
    heading2: "2. 상차 전 100% 실시간 계좌 송금 & 24시간 내 행정 종결",
    body2: [
      "실차 검수 후 합의된 매입 대금은 화물차 상차 전에 판매자 본인 계좌로 100% 전액 먼저 이체합니다.",
      "구청에 직접 갈 시간이 없으신 경우에도 당일 무료 행정 대행으로 번호판 반납 및 폐지·이전 완료 사진을 영업일 기준 24시간 내 전송해 드립니다.",
    ],
  },
  {
    key: "tuning-appraisal-defense",
    slugPart: "legal-exhaust-tuning-appraisal-defense",
    title: "구조변경 완료 사제 머플러·알루미늄 탑박스·블랙박스 장착 바이크 제값 받는 감정 기준",
    subtitle: "순정 부품 보관 여부에 따른 가산 평가와 부당 감가 예방법",
    excerpt: "아크라포빅·요시무라 등 합법 구조변경이 끝난 머플러와 투어링 3박스, 열선그립, 안개등을 장착한 오토바이를 매각할 때 옵션 가치를 최대한 인정받는 노하우를 정리합니다.",
    category: "매입 꿀팁",
    tags: ["오토바이튜닝가산", "구변머플러매입", "중고바이크시세", "탑박스옵션", "부당감가제로"],
    heading1: "1. 구조변경(구변) 서류가 살아있는 인증 머플러 가산점",
    body1: [
      "소음 측정과 도면 심사를 통과해 구조변경 이력이 전산 등록된 아크라포빅·요시무라·SC프로젝트·지킬앤하이드 등 정품 배기는 중고 매물 선호도를 크게 높입니다.",
      "구변 미완료 배기나 순정 머플러를 함께 보관 중이신 경우에도 사전에 알려주시면 원상복구 비용이나 부품 가치를 정직하게 산정해 드립니다.",
    ],
    heading2: "2. 투어링·출퇴근 실용 파츠 탈거 없이 일괄 정산",
    body2: [
      "알루미늄 3박스, 정품 롱윈드스크린, 2채널 블랙박스, 휴대폰 무선충전 거치대 등은 차주님이 따로 떼어 파실 필요 없이 실차 상태에서 잔존가치를 더해 일괄 매입가로 반영합니다.",
    ],
  },
  {
    key: "no-key-or-dead-battery-pickup",
    slugPart: "discharged-battery-underground-lift-pickup",
    title: "지하주차장 장기 방치·배터리 방전·시동 불능 오토바이 수리 없이 그대로 매각하는 법",
    subtitle: "견인비·출장비 0원 유압 리프트 특장차 방문 및 현장 원스톱 인양",
    excerpt: "수개월간 운행하지 않아 배터리가 방전되거나 타이어 공기가 빠진 오토바이를 센터에 돈 들여 고치지 않고 있는 그대로 당일 최고가 현금화하는 방법을 안내합니다.",
    category: "정비·관리",
    tags: ["방치오토바이매입", "배터리방전처분", "시동불능바이크", "무료리프트출장", "당일선입금"],
    heading1: "1. 매각 직전 수리 비용보다 '현 상태 매입'이 유리한 이유",
    body1: [
      "방치된 오토바이를 사설 정비소로 견인해 배터리 교환, 연료라인 세척, 오일 교체를 진행하면 기본 수십만 원의 소매 수리비가 발생합니다.",
      "넥스트바이크는 자체 정비 인프라를 통해 도매 원가로 경정비를 처리하므로, 수리 없이 현재 상태 그대로 내놓으시는 편이 고객님 실수령액 면에서 훨씬 유리합니다.",
    ],
    heading2: "2. 지하 3~4층도 안전하게 진입하는 저상 유압 리프트 트럭",
    body2: [
      "아파트 지하주차장 높이 제한에 맞춰 진입하는 전용 리프트 트럭과 이동식 에어 컴프레서를 상시 구비하여, 시동이 걸리지 않아도 차주님과 함께 힘들이지 않고 10분 내 안전 상차를 완료합니다.",
    ],
  },
];

function buildModelArticle(model, publishDate, index) {
  const season = getSeasonLabel(publishDate);
  const slug = `auto-${model.slug}-buying-guide-${publishDate.slice(2, 7).replace("-", "")}`;
  const cleanName = model.name;
  return {
    slug,
    title: `[시세·매입가이드] ${cleanName} (${model.displacement}) ${season} 오토바이매입 실거래 기준과 가산 포인트`,
    subtitle: `${model.brand} 인기 내연기관 ${model.category} 실차 점검 항목 및 상차 전 100% 당일 선입금 안내`,
    excerpt: `${model.summary}. ${cleanName} 중고 오토바이 매입 평균 시세(${model.priceRange})와 엔진·외관 핵심 체크포인트, 튜닝 파츠 우대 기준을 정리합니다.`,
    category: index % 2 === 0 ? "기종 분석" : "중고 시세",
    publishDate,
    readingTime: "5분 완독",
    author: "넥스트바이크 기종감정팀",
    featured: false,
    tags: [
      "오토바이매입",
      `${model.brand}매입`,
      cleanName.split("/")[0].trim().replace(/\s+/g, ""),
      "중고바이크시세",
      "당일선입금",
    ],
    sections: [
      {
        heading: `1. ${cleanName} (${model.displacement}) 중고 매입 시세 및 수요 흐름`,
        content: [
          `${cleanName} 모델은 ${model.brand}의 ${model.category} 라인업 중에서도 국내 정식발매 내연기관 시장에서 탄탄한 수요를 유지하고 있는 대표 기종입니다.`,
          `현재 실거래 기준 평균 매입 시세 범위는 ${model.priceRange} 수준이며, 연식·적산거리·정비 이력과 장착된 정품 옵션에 따라 현장 추가 감가 없이 최고가로 산정됩니다.`,
        ],
        callout: {
          type: "check",
          title: "대표 우대 가산 요인",
          description: model.meritPoints.join(" · "),
        },
      },
      {
        heading: "2. 직영 정비 엔지니어 실차 3대 핵심 점검 항목",
        content: model.checkPoints.map((cp, idx) => `${idx + 1}. ${cp}`),
      },
      {
        heading: "3. 전국 무료 출장 & 상차 전 100% 선입금 안전거래",
        content: [
          `사진 4장(좌·우 측면, 계기판 적산거리, 옵션/흠집 부위)만 보내주시면 ${cleanName} 전담 팀이 5분 이내에 확정 견적을 안내합니다.`,
          "차량을 리프트 특장차에 싣기 전 차주님 계좌로 100% 전액 입금을 먼저 확인시켜 드리며, 사용폐지 완료 또는 개인 명의이전 완료 상태의 서류 대행을 24시간 내 무료로 마무리합니다.",
        ],
      },
    ],
    faq: [
      {
        question: `${cleanName}에 사제 머플러나 투어링 옵션이 장착돼 있어도 추가 인정되나요?`,
        answer: `네, ${model.meritPoints[0] || "구조변경 완료 정품 배기 및 순정 액세서리"} 등 가치 있는 옵션은 별도로 탈거하지 않으셔도 매입가에 정직하게 합산해 드립니다.`,
      },
      {
        question: "시동이 안 걸리거나 오래 세워둔 상태라도 당일 매입이 가능한가요?",
        answer: "네, 국내 정식발매 가솔린 내연기관 차량이라면 배터리 방전이나 장기 방치 상태라도 전용 리프트 트럭이 무료로 방문해 당일 즉시 현금 매입합니다.",
      },
    ],
  };
}

function buildBrandArticle(brandTopic, publishDate) {
  const season = getSeasonLabel(publishDate);
  const slug = `auto-brand-${brandTopic.slugPart}-${publishDate.replace(/-/g, "")}`;
  return {
    slug,
    title: `[브랜드 총정리] ${brandTopic.brandName} 오토바이 매입 전 라인업 시세표 & ${season} 최고가 매각 전략`,
    subtitle: `${brandTopic.modelsSummary}까지 국내 정식발매 내연기관 전 기종 직영 출장 매입`,
    excerpt: `${brandTopic.brandName} 오토바이 매입 시 모델별 시세 차이와 정품 튜닝 파츠 우대 기준(${brandTopic.point})을 확인하고 상차 전 100% 당일 선입금으로 안전하게 정리하는 가이드를 소개합니다.`,
    category: "기종 분석",
    publishDate,
    readingTime: "6분 완독",
    author: "수입·국내 기종 전담팀",
    featured: false,
    tags: [
      `${brandTopic.brandName}매입`,
      "오토바이매입",
      "중고바이크시세",
      "수입바이크매입",
      "당일선입금",
    ],
    sections: [
      {
        heading: `1. ${brandTopic.brandName} 국내 정식발매 주요 매입 라인업`,
        content: [
          `넥스트바이크는 ${brandTopic.modelsSummary} 등 국내 정식발매 가솔린 내연기관 전 모델을 세분화된 실거래 데이터베이스 기준으로 직접 감정합니다.`,
          "엔트리 커뮤터부터 대배기량 투어러·슈퍼스포츠까지 광폭 유압 리프트 트럭으로 안전하게 방문 인수합니다.",
        ],
      },
      {
        heading: `2. ${brandTopic.brandName} 최고가 감정 핵심 포인트`,
        content: [
          brandTopic.point,
          "정기 점검 이력, 스페어 키/스마트키 2개 보유 여부, 순정 부품 동반 보관 시 현장 추가 가산금이 적용됩니다.",
        ],
        callout: {
          type: "tip",
          title: "매입 가능 서류 조건 안내",
          description: "금융 완납 후 사용폐지가 완료되었거나 개인 명의이전이 완료된 국내 정식발매 가솔린 내연기관 차량에 한해 당일 최고가 매입을 진행합니다.",
        },
      },
    ],
    faq: [
      {
        question: `${brandTopic.brandName} 커스텀이나 정품 옵션이 많은데 일괄 매입이 가능한가요?`,
        answer: "네, 브랜드 전문 엔지니어가 장착 파츠의 중고 잔존가치를 현장에서 확인해 전액 매입 견적에 가산 반영합니다.",
      },
      {
        question: "지방에서도 동일하게 무료 출장 매입을 받을 수 있나요?",
        answer: "네, 수도권 30~40분대 방문은 물론 전국 전 지역 당일 무료 배차 및 상차 전 100% 선입금 원칙이 동일하게 적용됩니다.",
      },
    ],
  };
}

function buildRegionArticle(regionTopic, publishDate) {
  const season = getSeasonLabel(publishDate);
  const slug = `auto-region-${regionTopic.slugPart}-${publishDate.replace(/-/g, "")}`;
  return {
    slug,
    title: `[전국 출장 네트워크] ${regionTopic.regionLabel} ${season} 중고 오토바이매입 당일 무료 리프트 방문 안내`,
    subtitle: `${regionTopic.summary} · 상차 전 100% 전액 송금 원칙`,
    excerpt: `${regionTopic.regionLabel} 지역에서 스쿠터·배달용 PCX/NMAX부터 대형 바이크까지 출장비 0원, 부당 감가 0%로 당일 현금화하는 직영 출장 매입 프로세스를 안내합니다.`,
    category: "매입 꿀팁",
    publishDate,
    readingTime: "5분 완독",
    author: "전국 배차운영팀",
    featured: false,
    tags: [
      "전국오토바이매입",
      "출장오토바이매입",
      "중고바이크매입",
      "방치차수거",
      "당일선입금",
    ],
    sections: [
      {
        heading: `1. ${regionTopic.regionLabel} 직영 출장 배차 및 방문 시간`,
        content: [
          `${regionTopic.summary}. 고객님께서 계신 자택 아파트 지하주차장, 빌라 주차장, 직장 및 정비소까지 추가 출장비 없이 약속된 시간에 정확히 도착합니다.`,
          "시동이 걸리지 않거나 배터리 방전, 카울 슬립이 있는 차량도 유압 리프트 트럭으로 안전하게 상차합니다.",
        ],
      },
      {
        heading: "2. 지역 불문 100% 동일한 4대 투명 정산 약속",
        content: [
          "① 상차 전 고객님 본인 계좌 100% 선입금 완료 후 상차 진행",
          "② 사진·사전 설명과 일치 시 현장 억지 감가 0%",
          "③ 관공서 이륜차 사용폐지 및 명의이전 서류 당일/익일 무료 대행",
        ],
      },
    ],
    faq: [
      {
        question: "외곽 지역이나 도심 외 주거지도 출장비가 정말 0원인가요?",
        answer: "네, 견적 상담부터 방문 출장비, 리프트 인양 비용까지 모두 0원 무료로 진행됩니다.",
      },
      {
        question: "번호판 폐지를 아직 못 했는데 방문 전 꼭 떼어야 하나요?",
        answer: "사전에 안내해 드리면 현장 인수와 함께 적법한 절차에 따라 구청 사용폐지 대행을 무료로 도와드립니다.",
      },
    ],
  };
}

function buildPolicyArticle(docTopic, publishDate) {
  const slug = `auto-guide-${docTopic.slugPart}-${publishDate.replace(/-/g, "")}`;
  return {
    slug,
    title: docTopic.title,
    subtitle: docTopic.subtitle,
    excerpt: docTopic.excerpt,
    category: docTopic.category,
    publishDate,
    readingTime: "6분 완독",
    author: "계약심사·행정지원팀",
    featured: false,
    tags: docTopic.tags,
    sections: [
      {
        heading: docTopic.heading1,
        content: docTopic.body1,
      },
      {
        heading: docTopic.heading2,
        content: docTopic.body2,
      },
    ],
    faq: [
      {
        question: "매입 가능한 차량 기준이 어떻게 되나요?",
        answer: "국내 정식발매 가솔린 내연기관 중 금융 완납 사용폐지 완료 또는 개인 명의이전이 완료된 정상 소유 차량이라면 연식과 주행거리 관계없이 당일 최고가로 매입합니다.",
      },
      {
        question: "견적 신청 후 실제로 방문까지 얼마나 걸리나요?",
        answer: "사진 4장을 보내주시면 5분 내 확정 견적을 안내해 드리며, 수도권 30분~1시간, 전국 주요 권역 당일 협의 시간에 맞춰 즉시 방문합니다.",
      },
    ],
  };
}

function assertCleanArticle(article) {
  const serialized = JSON.stringify(article);
  const hit = serialized.match(FORBIDDEN_PATTERN);
  if (hit) {
    throw new Error(`Forbidden keyword detected ("${hit[0]}") in generated article: ${article.slug}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  let ensureDays = 10; // Keep at least 10 upcoming days scheduled ahead
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--ensure-days" && args[i + 1]) {
      ensureDays = Math.max(0, Number(args[i + 1]));
    }
  }

  const today = getKstTodayString();
  const { existingSlugs, existingDates, autoArticles } = loadExistingInventory();
  const models = loadBikeModels();

  // Prioritize newly added / key models first, then cycle through all 183 models cleanly
  const prioritySlugs = [
    "harley-pan-america-1250",
    "harley-lowrider-st",
    "harley-fatboy",
    "harley-roadglide",
    "harley-streetglide",
    "harley-fatbob",
    "harley-heritage-classic",
    "harley-nightster",
    "honda-cbr600rr",
    "honda-cb750-hornet",
    "honda-transalp750",
    "yamaha-r9",
    "yamaha-xsr900gp",
    "yamaha-tenere700",
    "bmw-f900gs",
    "bmw-f850gs",
    "bmw-k1600",
    "bmw-r1300gs",
    "suzuki-gsx8r",
    "suzuki-vstrom800",
    "kawasaki-zx4rr",
    "kawasaki-versys650",
    "kawasaki-z900rs",
    "royal-enfield-supermeteor650",
    "royal-enfield-shotgun650",
    "royal-enfield-guerrilla450",
    "triumph-tiger900",
    "ducati-diavel",
  ];
  const modelBySlug = new Map(models.map((m) => [m.slug, m]));
  const orderedModels = [
    ...prioritySlugs.map((s) => modelBySlug.get(s)).filter(Boolean),
    ...models.filter((m) => !prioritySlugs.includes(m.slug)),
  ];

  // Track used indices across autoArticles to rotate smoothly
  let cursor = autoArticles.length;
  let added = 0;

  for (let offset = 0; offset <= ensureDays; offset++) {
    const targetDate = addDays(today, offset);
    if (existingDates.has(targetDate)) continue;

    let article;
    const slot = cursor % 6;
    if (slot === 0 || slot === 2 || slot === 4) {
      const m = orderedModels[Math.floor(cursor / 2) % orderedModels.length];
      article = buildModelArticle(m, targetDate, cursor);
    } else if (slot === 1) {
      const b = BRAND_GUIDE_TOPICS[Math.floor(cursor / 6) % BRAND_GUIDE_TOPICS.length];
      article = buildBrandArticle(b, targetDate);
    } else if (slot === 3) {
      const r = REGION_TOPICS[Math.floor(cursor / 6) % REGION_TOPICS.length];
      article = buildRegionArticle(r, targetDate);
    } else {
      const p = POLICY_DOC_TOPICS[Math.floor(cursor / 6) % POLICY_DOC_TOPICS.length];
      article = buildPolicyArticle(p, targetDate);
    }

    // Ensure globally unique slug
    let candidateSlug = article.slug;
    let suffix = 2;
    while (existingSlugs.has(candidateSlug)) {
      candidateSlug = `${article.slug}-${suffix++}`;
    }
    article.slug = candidateSlug;

    assertCleanArticle(article);
    existingSlugs.add(article.slug);
    existingDates.add(targetDate);
    autoArticles.push(article);
    cursor++;
    added++;
    console.log(`[auto-magazine] Issued ${targetDate}: ${article.slug} — ${article.title}`);
  }

  if (added === 0) {
    console.log(`[auto-magazine] Schedule already covered through ${addDays(today, ensureDays)}. No changes needed.`);
    return;
  }

  const fileContent =
    `import { MagazineArticle } from "./magazine";\n\n` +
    `// Auto-generated scheduled & daily magazine inventory.\n` +
    `// Managed by tools/auto-magazine/generate-daily-article.mjs and .github/workflows/auto-magazine.yml\n` +
    `export const MAGAZINE_ARTICLES_AUTO: MagazineArticle[] = ${JSON.stringify(autoArticles, null, 2)};\n`;

  fs.writeFileSync(AUTO_FILE, fileContent, "utf8");
  console.log(`[auto-magazine] Successfully wrote ${added} new article(s) (total auto inventory: ${autoArticles.length}).`);
}

main();
