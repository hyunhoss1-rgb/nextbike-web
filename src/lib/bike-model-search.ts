import type { BikeModel } from "@/data/models";

export type SearchableBikeModel = Pick<
  BikeModel,
  "slug" | "name" | "brand" | "category" | "displacement" | "summary" | "priceRange"
>;

export function toSearchableBikeModel(model: BikeModel): SearchableBikeModel {
  const { slug, name, brand, category, displacement, summary, priceRange } = model;
  return { slug, name, brand, category, displacement, summary, priceRange };
}

// 한글 발음/별칭 -> 영문/정식 명칭 매핑 사전
const KOREAN_ALIAS_MAP: Record<string, string[]> = {
  피씨엑스: ["pcx", "pcx125"],
  피시엑스: ["pcx", "pcx125"],
  엔맥스: ["nmax", "nmax125", "nmax155"],
  앤맥스: ["nmax", "nmax125", "nmax155"],
  엑스맥스: ["xmax", "xmax300"],
  티맥스: ["tmax", "tmax560"],
  알삼: ["r3", "yzf-r3"],
  알쓰리: ["r3", "yzf-r3"],
  알세븐: ["r7", "yzf-r7"],
  알원: ["r1", "yzf-r1"],
  알식스: ["zx-6r", "r6"],
  엠티: ["mt-03", "mt-07", "mt-09", "mt-10", "mt-125"],
  엠티공삼: ["mt-03"],
  엠티공칠: ["mt-07"],
  엠티공구: ["mt-09"],
  엠티텐: ["mt-10"],
  스천알: ["s1000rr", "s1000r"],
  스천: ["s1000rr", "s1000r", "s1000xr"],
  알나인티: ["r ninet", "ninet"],
  지에스: ["gs", "r1250gs", "r1300gs", "f850gs", "f900gs", "g310gs"],
  레봉: ["r1250gs", "r1300gs"],
  슈퍼커브: ["cub", "슈퍼커브"],
  커브: ["cub", "슈퍼커브", "ct125", "c125"],
  헌터커브: ["ct125"],
  벤리: ["벤리", "benly"],
  포르자: ["포르자", "forza"],
  어드레스: ["어드레스", "address"],
  버그만: ["버그만", "burgman"],
  하야부사: ["하야부사", "hayabusa"],
  부사: ["하야부사", "hayabusa"],
  크루심: ["크루심", "cruisym"],
  다운타운: ["다운타운", "downtown"],
  익사이팅: ["익사이팅", "xciting"],
  시티: ["시티", "citi"],
  대림: ["dna", "대림", "시티", "vf", "엠보이"],
  디엔에이: ["dna", "대림"],
  효성: ["kr", "효성", "코멧", "미라쥬", "아퀼라", "델리로드"],
  케이알: ["kr", "효성"],
  할리: ["할리", "아이언", "포티에잇", "팻보이", "브레이크아웃", "스트리트글라이드", "로드글라이드", "스포스터", "로드킹"],
  두카티: ["두카티", "파니갈레", "몬스터", "스크램블러", "멀티스트라다"],
  트라이엄프: ["트라이엄프", "본네빌", "트라이던트", "스피드400", "스크램블러"],
  로얄엔필드: ["로얄엔필드", "클래식350", "메테오", "히말라얀", "인터셉터"],
  존테스: ["존테스", "350e", "350d"],
  장고: ["푸조", "장고"],
  드래그스터: ["이탈젯", "드래그스터"],
};

export function matchBikeModel(model: SearchableBikeModel, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const targetText = [
    model.name,
    model.brand,
    model.category,
    model.displacement,
    model.summary,
    model.priceRange,
    model.slug.replace(/-/g, " "),
  ]
    .join(" ")
    .toLowerCase();

  // 공백 단위로 쪼개서 모든 토큰이 매칭되는지 확인 (또는 별칭 매칭)
  const tokens = q.split(/\s+/).filter(Boolean);

  return tokens.every((token) => {
    if (targetText.includes(token)) return true;

    // 한글 별칭 사전 매칭
    for (const [aliasKey, mappedTerms] of Object.entries(KOREAN_ALIAS_MAP)) {
      if (aliasKey.includes(token) || token.includes(aliasKey)) {
        if (mappedTerms.some((term) => targetText.includes(term.toLowerCase()))) {
          return true;
        }
      }
    }
    return false;
  });
}
