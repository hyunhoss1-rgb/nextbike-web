import { NextRequest, NextResponse } from "next/server";

/**
 * 1순위: 네이버(Yeti), 구글(Googlebot), 다음(Daumoa), 빙(bingbot), 카카오톡 등
 * 검색엔진 색인 및 SNS 미리보기 공식 봇은 메인·세부페이지·사이트맵 모두 100% 무제한 허용 (노출 지장 0%)
 */
const ALLOWED_SEARCH_AND_SOCIAL_BOTS =
  /yeti|naverbot|naver\.me|cowbot|googlebot|google-inspectiontool|storebot-google|mediapartners-google|adsbot-google|apis-google|google-read-aloud|duplexweb-google|google favicon|google-site-verification|daumoa|daum|kakaotalk|kakaotalk-scrap|bingbot|msnbot|adidxbot|bingpreview|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|linespider|pinterestbot/i;

/**
 * 2순위: AI 학습/수집 크롤러, LLM 실시간 웹 브라우징 봇(GoogleOther, ChatGPT-User, OAI-SearchBot 등),
 * 경쟁사 분석 스파이 봇(Ahrefs, Semrush 등), 자동화 스크래퍼(Python, Curl, Scrapy, Headless 등)
 * 메인페이지(/) 뿐만 아니라 모든 세부페이지(/regions/*, /models/*, /magazine/*, /price, /cases, /reviews, /sitemap.xml) 접근 시 즉시 403 차단
 */
const BLOCKED_AI_AND_SCRAPER_BOTS =
  /gptbot|chatgpt-user|oai-searchbot|openai|claudebot|claude-web|claude-searchbot|claude-user|anthropic-ai|perplexitybot|perplexity-user|google-extended|googleother|google-cloudvertexbot|vertexai|applebot-extended|bytespider|ccbot|diffbot|facebookbot|meta-externalagent|meta-externalfetcher|cohere-ai|cohere-training-data-crawler|amazonbot|youbot|omgilibot|omgili|ai2bot|ai2bot-dolma|duckassistbot|timpibot|webzio-extended|imagesiftbot|kangaroo bot|petalbot|pangubot|sentibot|velenpublicwebcrawler|turnitinbot|img2dataset|icc-crawler|ahrefsbot|semrushbot|mj12bot|dotbot|blexbot|dataforseobot|rogerbot|screaming frog|siteauditbot|serpstatbot|zoominfobot|barkrowler|seekportbot|scrapy|python-requests|python-urllib|python-httpx|aiohttp|curl\/|wget\/|go-http-client|java\/|libwww-perl|mechanize|httrack|webcopier|teleport|sitesnagger|headlesschrome|phantomjs|selenium|playwright|puppeteer|node-fetch|axios\/|undici/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";

  // 1. 네이버·구글·다음 등 공식 검색엔진 봇은 무조건 최우선 통과 (SEO 100% 보호)
  if (ALLOWED_SEARCH_AND_SOCIAL_BOTS.test(ua)) {
    const response = NextResponse.next();
    // 검색엔진 색인(index, follow)은 그대로 유지하되 AI 학습 거부(noai, noimageai)만 명시
    response.headers.set("X-Robots-Tag", "noai, noimageai");
    return response;
  }

  // Applebot(일반 검색)은 허용하되 Applebot-Extended(AI 학습)는 아래에서 차단
  if (/applebot/i.test(ua) && !/applebot-extended/i.test(ua)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noai, noimageai");
    return response;
  }

  // 2. User-Agent가 비어있거나 AI 봇 / 스크래퍼 봇인 경우 메인 및 모든 세부페이지 진입 원천 차단 (403 Forbidden)
  if (!ua.trim() || BLOCKED_AI_AND_SCRAPER_BOTS.test(ua)) {
    return new NextResponse("Access Denied: Automated AI scraping is strictly prohibited on all pages.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noai, noimageai",
      },
    });
  }

  // 3. 일반 사용자 브라우저 통과 + 모든 하위 페이지 응답 헤더에 AI 수집 거부 태그 부착
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  return response;
}

// 메인페이지 및 모든 세부페이지(/regions/*, /models/*, /magazine/*, /price, /cases, /reviews, /sitemap.xml 등) 전역 적용
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|images/).*)",
  ],
};
